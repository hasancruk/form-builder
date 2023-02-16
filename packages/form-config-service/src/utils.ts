import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const putForm = async (bucket: string, formName: string, data: string) => {
  // TODO Pass in region from env variable
  const client = new S3Client({});
  const params = {
    Bucket: bucket,
    Key: formName,
    Body: data
  };
  
  const command = new PutObjectCommand(params);

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
  
  return {
    success: false,
  };
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

// TODO get from approval -> add/update additional fields -> putinto main bucket -> delete from temp bucket
export const approveForm = async (approvalBucket: string, formBucket: string, data: any, formName: string) => {
  
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


const getForm = async (bucket: string, formName: string) => {
  
  return {
    data: {},
    success: true,
  };
};

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
