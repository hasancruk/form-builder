const aws = require("aws-sdk");

const putFormToS3 = async (bucket, key, data) => {
  const s3 = new aws.S3();
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data
  };
  
  try {
    const resp = await s3.putObject(params).promise();
    console.log(resp);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

const getForm = async (bucket, key) => {
  const s3 = new aws.S3();
  const params = {
    Bucket: bucket,
    Key: key
  };

  try {
    const resp = await s3.getObject(params).promise();
    console.log(resp);
    return { 
      data: JSON.parse(resp.Body),
      success: true
    };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

exports.handler = async (event) => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const bucket = process.env.FORM_BUCKET;
  const key = "support-us.json";

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
      const { data, success } = await getForm(bucket, formId);
      body = {
        content: success ? JSON.stringify(data) : "nothing found",
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
