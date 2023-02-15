import { putFormToS3, getForm } from "./utils";
import type { APIGatewayEvent } from "aws-lambda";
import type { AppRouter } from "../../form-id-service/src/formIdService";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const handler = async (event: APIGatewayEvent) => {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const bucket = process.env.FORM_BUCKET;
  const key = "support-us.json";
  const cdnUrl = process.env.CDN_URL;
  const formIdServiceUrl = process.env.FORM_ID_ENDPOINT_URL;

  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: formIdServiceUrl ?? "http://localhost:3000/trpc",
      }),
    ],
  });


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
    } else if (event.path === "/trpc") {
      const { formId } = event.queryStringParameters;
      const data = await client.getFormId.query(formId);
      body = {
        message: `You queried for form: ${data.id} and it says ${data.greeting}`,
      }; 
    } else {
      body = {
        message: "this path is not supported yet"
      };
    }
  } else if (event.httpMethod === "POST") {
      if (event.path === "/trpc") {
        const { process, formId } = event.queryStringParameters;

        let data: unknown;
        
        // TODO Validate the inputs
        switch (process) {
          case "approve":
            data = await client.approveFormById.mutate({ formId });
            break;
          case "archive":
            data = await client.archiveFormById.mutate({ formId });
            break;
          case "reject":
            data = await client.rejectFormById.mutate({ formId });
            break;
          default:
            data = await client.newForm.mutate({ formName: "support-us" });
            break;

        };
        body = {
          message: `Data ID: ${data.id}, Data message: ${data.message}`,
        }; 
      } else {
        body = {
          message: "POST is not yet supported"
        };
      }
  } else if (event.httpMethod === "PUT") {
    const { success } = await putFormToS3(bucket, key, JSON.stringify(form));
    body = {
      message: success ? "PUT form config sucessfully" : "Could not PUT form config in bucket"
    };
  } else {
    body = {
      message: "Unknown method and path, url: " + formIdServiceUrl,
    };
  }

  return {
    ...response,
    body: JSON.stringify(body),
  };
};
