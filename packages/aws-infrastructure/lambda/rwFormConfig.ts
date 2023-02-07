import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const putFormToS3 = async (bucket: string, key: string, data: unknown) => {
  const client = new S3Client();
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

const getForm = async (url: string, fileName: string) => {
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

export const handler = async (event: any) => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const bucket = process.env.FORM_BUCKET;
  const key = "support-us.json";
  const cdnUrl = process.env.CDN_URL;

  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
  };

  const form = {
    id: 123,
    name: "my-form",
    values: {
      nudges: [1, 2, 3, 4],
      regularNudges: [1, 2, 3, 4]
    },
    email: true
  };
  
  let body = {
    message: "nothing"
  };

  if (event.httpMethod === "GET") {
    if (event.path === "/forms") {
      const { formId } = event.queryStringParameters;
      const { data, success } = await getForm(cdnUrl, formId);
      body = {
        message: success ? JSON.stringify(data) : "nothing found",
      };  
    } else {
      body = {
        message: "this path is not supported yet"
      };
    }
  } else if (event.httpMethod === "POST") {
    body = {
      message: "POST is not yet supported"
    };
  } else if (event.httpMethod === "PUT") {
    const { success } = await putFormToS3(bucket, key, JSON.stringify(form));
    body = {
      message: success ? "PUT form config sucessfully" : "Could not PUT form config in bucket"
    };
  } else {
    body = {
      message: "Unknown method and path"
    };
  }

  return {
    ...response,
    body: JSON.stringify(body),
  };
};
