import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const putFormToS3 = async (bucket: string, key: string, data: string) => {
  // TODO Pass in region from env variable
  const client = new S3Client({});
  const params = {
    Bucket: bucket,
    Key: key,
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


export const getForm = async (url: string, fileName: string) => {
  try {
    const resp = await fetch(`https://${url}/${fileName}`);
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
