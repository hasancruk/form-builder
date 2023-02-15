import { DynamoDBClient, UpdateItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { CreateFormType } from "../../common-lib/src/lib/schema/dbForm";

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
  // TODO getNewFormId
  const { newId } = await getNewFormId(client, counterClient, { formName });  
  
  return newId;
  // TODO 
};

// If a form is rejected it will be orphaned, and if it is not reviewed, then it will stay unreleased.
const getNewFormId = async (client: DbProps, counterClient: DbProps, { formName }: CreateFormType) => {
  // TODO Check for any orphaned formIds to use; early return if there are any
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

const archiveFormByIdImpl = (client: DbProps, counterClient: DbProps, formId: string) => "";

const rejectFormByIdImpl = (client: DbProps, counterClient: DbProps, formId: string) => "";

const incrementCounter = async ({ client, params }: DbProps) => {
  // --key '{"Id": { "N": "601" }}' \
  // --update-expression "SET Price = Price + :incr" \
  // --expression-attribute-values '{":incr":{"N":"5"}}' \
  // --return-values UPDATED_NEW
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
  // TODO Add return value to include the new formId
  // TODO Add the ONDON and leading zeros formatting here
  console.log(resp);

  return {
    status: resp.$metadata.httpStatusCode,
    newId: "ONDON0000042",
  };
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
    archiveFormById: (formId: string) => archiveFormByIdImpl(client, counterClient, formId),
    rejectFormById: (formId: string) => rejectFormByIdImpl(client, counterClient, formId),
  }
};
