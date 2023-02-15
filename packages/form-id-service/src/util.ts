import { DynamoDBClient, UpdateItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { CreateFormType, DBFormType } from "../../common-lib/src/lib/schema/dbForm";

type ConfigProps = {
  dbTableName: string;
  counterDbTableName: string;
};

type DbProps = {
  client: DynamoDBClient;
  params: {
    TableName: string;
  };
};

const createNewFormImpl = async (client: DbProps, counterClient: DbProps, formName: string) => {
  const { newId } = await getNewFormId(client, counterClient, { formName });  

  // TODO need schema validation and maybe even a transformation
  const item: DBFormType = {
    formName,
    formId: newId,
    formStatus: "created",
  };

  const command = new PutItemCommand({
    ...client.params,
    Item: {
      formId: { S: item.formId },
      formStatus: { S: item.formStatus },
      formName: { S: item.formName },
    },
  });

  const resp = await client.client.send(command);

  console.log("INFO CreateNewForm:", resp);
  
  // INFO this return is only for reference on what the details of this operation was
  return {
    item,
  };
};

// If a form is rejected it will be orphaned, and if it is not reviewed, then it will stay unreleased.
const getNewFormId = async (client: DbProps, counterClient: DbProps, { formName }: CreateFormType) => {
  const clientScan = new ScanCommand({
    ...client.params,
    FilterExpression: "formStatus = :status",
    ExpressionAttributeValues: {
      ":status": { S: "orphaned" },
    },
  });

  const scanResp = await client.client.send(clientScan);
  console.log(scanResp.Items?.length > 0 ? scanResp.Items : "no items found for this query");

  // TODO parse against the schema
  const selectedFormId = scanResp.Items?.at(0)?.formId.S;
  
  if (selectedFormId) {
    return  {
      newId: selectedFormId,
      message: "INFO reusing an orphaned formId",
    };
  }

  // TODO Update counter and use the latest value
  const { status, newId } = await incrementCounter(counterClient);

  console.log(status);

  return {
    newId,
    message: "INFO generated a new formId",
  };
};

const archiveFormByIdImpl = async (client: DbProps, counterClient: DbProps, formId: string) => {
  const command = new UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId },
    },
    UpdateExpression:  "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "archived" } },
    ReturnValues: "UPDATED_NEW",
  });

  const resp = await client.client.send(command);

  console.log("INFO ArchiveByFormId:", resp);

  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} archived successfully` : `INFO Could not archive formId:${formId}`,
  };
};

const rejectFormByIdImpl = async (client: DbProps, counterClient: DbProps, formId: string) => {
  const command = new UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId },
    },
    UpdateExpression:  "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "orphaned" } },
    ReturnValues: "UPDATED_NEW",
  });

  const resp = await client.client.send(command);

  console.log("INFO RejectByFormId:", resp);

  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} rejected successfully` : `INFO Could not reject formId:${formId}`,
  };
};

const approveFormByIdImpl = async (client: DbProps, counterClient: DbProps, formId: string) => {
  const command = new UpdateItemCommand({
    ...client.params,
    Key: {
      formId: { S: formId },
    },
    UpdateExpression:  "SET formStatus = :status",
    ExpressionAttributeValues: { ":status": { S: "issued" } },
    ReturnValues: "UPDATED_NEW",
  });

  const resp = await client.client.send(command);

  console.log("INFO ApproveByFormId:", resp);

  return {
    status: resp.$metadata.httpStatusCode,
    message: resp.$metadata.httpStatusCode === 200 ? `INFO ${resp.Attributes?.formName.S ?? formId} approved successfully` : `INFO Could not approve formId:${formId}`,
  };
};

const incrementCounter = async ({ client, params }: DbProps) => {
  const command = new UpdateItemCommand({
    ...params,
    Key: {
      counterKey: { S: "current" },
    },
    UpdateExpression: "SET formCount = formCount + :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
    ReturnValues: "UPDATED_NEW",
  });

  const resp = await client.send(command); 
  console.log("INFO Counter DB:", resp);

  return {
    status: resp.$metadata.httpStatusCode,
    newId: formatFormId("ONDON", resp.Attributes?.formCount.N),
  };
};

const formatFormId = (prefix: string, n: string | undefined) => {
  const id = ("000000" + (n ?? "0")).slice(-6); 
  return `${prefix}${id}`;
};

export const initOperations = ({ dbTableName, counterDbTableName }: ConfigProps) => {
  const client = {
    client: new DynamoDBClient({}),
    params: {
      TableName: dbTableName,
    },
  };

  const counterClient = {
    client: new DynamoDBClient({}),
    params: {
      TableName: counterDbTableName,
    },
  };

  return {
    createNewForm: (formName: string) => createNewFormImpl(client, counterClient, formName),
    processFormById: (formId: string, action: "approve" | "archive" | "reject") => {
      switch (action) {
        case "approve":
          return approveFormByIdImpl(client, counterClient, formId);
        case "archive":
          return archiveFormByIdImpl(client, counterClient, formId);
        case "reject":
          return rejectFormByIdImpl(client, counterClient, formId);
      }
    },
  }
};
