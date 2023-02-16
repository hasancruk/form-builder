import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { z } from "zod";

import { putForm, fetchForm, archiveForm, approveForm, rejectForm } from "./utils";
import type { AppRouter as FormIdRouter } from "../../form-id-service/src/formIdService";

export const t = initTRPC.create();

// Config
const formBucket = process.env.FORM_BUCKET ?? "";
const archiveBucket = process.env.ARCHIVE_BUCKET ?? "";
const approvalBucket = process.env.APPROVAL_BUCKET ?? "";
const cdnUrl = process.env.CDN_URL ?? "";
const formIdServiceUrl = process.env.FORM_ID_ENDPOINT_URL ?? "http://localhost:3000/trpc";

const key = "support-us.json";

const client = createTRPCProxyClient<FormIdRouter>({
  links: [
    httpBatchLink({
      url: formIdServiceUrl, 
    }),
  ],
});

const newFormRequestSchema = z.object({
  formName: z.string(),
});

const getFormSchema = z.object({
  formName: z.string().optional(),
  formId: z.string().optional(),
  sourceCode: z.string().optional(),
});

const processByIdRequestSchema = z.object({
  formId: z.string(),
  process: z.union([
    z.literal("approve"),
    z.literal("archive"),
    z.literal("reject"),
  ]),
});

// TODO if the process is successful, then move from temp storage to form storage  
const approveById = async (formId: string) => {
  const resp = await client.approveFormById.mutate({ formId });
  // TODO pass in form name
  const res = await approveForm(approvalBucket, formBucket, formId, {});

  return {
    message: "",
  };

};

// TODO if the process is successful, then delete from temp storage  
const rejectById = async (formId: string) => {
  const resp = await client.rejectFormById.mutate({ formId });
  
  // TODO pass in form name
  const res = await rejectForm(approvalBucket, formId);

  return {
    message: "",
  };
};

// TODO if the process is successful, then move from temp storage to archive storage  
const archiveById = async (formId: string) => {
  const { status } = await client.archiveFormById.mutate({ formId });
  
  // TODO pass in form name
  const res = await archiveForm(formBucket, archiveBucket, formId);


  return {
    message: "",
  };
};


// TODO Define unified output response to better define the contracts

const appRouter = t.router({
  createNewForm: t.procedure
                  .input(newFormRequestSchema)
                  .mutation(async ({ input }) => {
                    const { message, id } = await client.newForm.mutate(input);

                    // TODO If creation was successful, then write to approvalBucket

                    return {
                      message,
                      formId: id.item.formId,
                      formName: id.item.formName,
                    };
                  }),
  processFormById: t.procedure
                    .input(processByIdRequestSchema)
                    .mutation(async ({ input }) => {
                      let resp: unknown; 
                      
                      // TODO Extract logic to util function
                      switch(input.process) {
                        case "reject":
                          resp = await rejectById(input.formId);
                          break;
                        case "archive":
                          resp = await archiveById(input.formId);
                          break;
                        case "approve":
                          resp = await approveById(input.formId);
                          break;
                      }
                      
                      return {
                        message: resp.message,
                      };
                    }),
  getFormById: t.procedure
                .input(getFormSchema)
                .query(async ({ input }) => {
                  if (!input.formId) {
                    return {
                      message: "No formId provided",
                      data: {},
                    };
                  }
                  
                  const { data } = await fetchForm(cdnUrl, input.formId);

                  return {
                    data,
                  };
                }),
  getFormByName: t.procedure
                  .input(getFormSchema)
                  .query(({ input }) => {
                    
                    return {
                      data: {},
                    };
                  }),
  // modifyFormById: t.procedure
  //                  .input()
  //                  .mutation(),
});

export type AppRouter = typeof appRouter;

// created for each request
const createContext = ({ event, context }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({}) // no context
type Context = inferAsyncReturnType<typeof createContext>;
// TODO consider using context to pass environment variables

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});

// export const handler = async (event: APIGatewayEvent) => {
//   console.log("request:", JSON.stringify(event, undefined, 2));

//   // const bucket = process.env.FORM_BUCKET;
//   // const key = "support-us.json";
//   // const cdnUrl = process.env.CDN_URL;
//   // const formIdServiceUrl = process.env.FORM_ID_ENDPOINT_URL;

//   // const client = createTRPCProxyClient<FormIdRouter>({
//   //   links: [
//   //     httpBatchLink({
//   //       url: formIdServiceUrl ?? "http://localhost:3000/trpc",
//   //     }),
//   //   ],
//   // });


//   let response = {
//     statusCode: 200,
//     headers: { "Content-Type": "application/json" },
//   };

//   const form = {
//     id: 123,
//     name: "my-form",
//     values: {
//       nudges: [1, 2, 3, 4],
//       regularNudges: [1, 2, 3, 4]
//     },
//     email: true
//   };
//   
//   let body = {
//     message: "nothing"
//   };

//   if (event.httpMethod === "GET") {
//     if (event.path === "/forms") {
//       const { formId } = event.queryStringParameters;
//       const { data, success } = await getForm(cdnUrl, formId);
//       body = {
//         message: success ? JSON.stringify(data) : "nothing found",
//       };  
//     } else if (event.path === "/trpc") {
//       const { formId } = event.queryStringParameters;
//       const data = await client.getFormId.query(formId);
//       body = {
//         message: `You queried for form: ${data.id} and it says ${data.greeting}`,
//       }; 
//     } else {
//       body = {
//         message: "this path is not supported yet"
//       };
//     }
//   } else if (event.httpMethod === "POST") {
//       if (event.path === "/trpc") {
//         const { process, formId } = event.queryStringParameters;

//         let data: unknown;
//         
//         // TODO Validate the inputs
//         switch (process) {
//           case "approve":
//             data = await client.approveFormById.mutate({ formId });
//             break;
//           case "archive":
//             data = await client.archiveFormById.mutate({ formId });
//             break;
//           case "reject":
//             data = await client.rejectFormById.mutate({ formId });
//             break;
//           default:
//             data = await client.newForm.mutate({ formName: "support-us" });
//             break;

//         };
//         body = {
//           message: `Data ID: ${data.id}, Data message: ${data.message}`,
//         }; 
//       } else {
//         body = {
//           message: "POST is not yet supported"
//         };
//       }
//   } else if (event.httpMethod === "PUT") {
//     const { success } = await putFormToS3(bucket, key, JSON.stringify(form));
//     body = {
//       message: success ? "PUT form config sucessfully" : "Could not PUT form config in bucket"
//     };
//   } else {
//     body = {
//       message: "Unknown method and path, url: " + formIdServiceUrl,
//     };
//   }

//   return {
//     ...response,
//     body: JSON.stringify(body),
//   };
// };
