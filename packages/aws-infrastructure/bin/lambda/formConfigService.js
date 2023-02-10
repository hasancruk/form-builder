var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/formConfigService.ts
var formConfigService_exports = {};
__export(formConfigService_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(formConfigService_exports);

// src/utils.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var putFormToS3 = async (bucket, key, data) => {
  const client = new import_client_s3.S3Client({});
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data
  };
  const command = new import_client_s3.PutObjectCommand(params);
  try {
    const resp = await client.send(command);
    console.log(resp);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
var getForm = async (url, fileName) => {
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
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

// src/formConfigService.ts
var handler = async (event) => {
  console.log("request:", JSON.stringify(event, void 0, 2));
  const bucket = process.env.FORM_BUCKET;
  const key = "support-us.json";
  const cdnUrl = process.env.CDN_URL;
  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" }
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
        message: success ? JSON.stringify(data) : "nothing found"
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
    body: JSON.stringify(body)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
