import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const initS3 = (bucket: string, key: string) => ({
  client: new S3Client({}),
  params: {
    Bucket: bucket,
    Key: key,
  },
});

export const putForm = async (bucket: string, formName: string, data: string) => {
  // TODO Pass in region from env variable
  const { client, params } = initS3(bucket, formName);
  
  const command = new PutObjectCommand({ ...params, Body: data });

  try {
    const resp = await client.send(command);
    console.log(resp);
    return { success: true };
  } catch (err: unknown) {
    console.error(err);
    return { success: false };
  }
};

const removeForm = async (bucket: string, formName: string) => {
  const { client, params } = initS3(bucket, formName);  
  const command = new DeleteObjectCommand(params);

  try {
    const resp = await client.send(command);
    console.log(resp);
    return { success: true };
  } catch (err: unknown) {
    console.error(err);
    return { success: false };
  }
}

// TODO Read item from source -> putInto archive -> delete from source
// TODO Would it be easier to read from source bucket or cdn?
// TODO What is this key? formName
export const archiveForm = async (sourceBucket: string, targetBucket: string, formName: string) => {
  const data = await getForm(sourceBucket, formName);
  const putResp = await putForm(targetBucket, formName, JSON.stringify(data));
  const removeResp = await removeForm(sourceBucket, formName);

  return {
    success: false,
  };
};


// TODO newData should be a strict subset of the full form
const updateFormData = (current: any, newData: any) => {
  // TODO Implement function based on what the get function returns
  return {};
};

// TODO get from approval -> add/update additional fields -> putinto main bucket -> delete from temp bucket
// TODO Send correct responses and add error handling
export const approveForm = async (approvalBucket: string, formBucket: string, formName: string, data: any) => {
  const getResp = await getForm(approvalBucket, formName);
  const updatedData = updateFormData({}, data);
  const putResp = await putForm(formBucket, formName, JSON.stringify(updateFormData));
  const deleteResp = await removeForm(approvalBucket, formName);

  return {
    success: false,
  };
};

// TODO remove from temp 
export const rejectForm = async (approvalBucket: string, formName: string) => {
  const resp = await removeForm(approvalBucket, formName); 

  return {
    success: false,
  };
};

// TODO return the data back
const getForm = async (bucket: string, formName: string) => {
  const { client, params } = initS3(bucket, formName);  
  const command = new GetObjectCommand({
    ...params, 
    ResponseContentType: "application/json; charset=utf-8",
  });

  try {
    const resp = await client.send(command);
    const data = await resp.Body?.transformToString();
    console.log(resp);
    return { success: true, data: data ? JSON.parse(data) : {} };
  } catch (err: unknown) {
    console.error(err);
    return { success: false };
  }
};

export const fetchFormFromBucket = async (bucket: string, formName: string) => await getForm(bucket, formName);

export const fetchForm = async (cdnUrl: string, formName: string) => {
  try {
    const resp = await fetch(`https://${cdnUrl}/${formName}`);
    if (!resp.ok) {
      throw new Error("No such file");
    }
    const data = await resp.json();
    console.log(resp);
    return { 
      data,
      success: true
    };
  } catch (err: unknown) {
    console.error(err);
    return { success: false };
  }
};
