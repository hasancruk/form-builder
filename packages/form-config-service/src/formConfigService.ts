import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { z } from "zod";

import { putForm, fetchForm, archiveForm, approveForm, rejectForm, fetchFormFromBucket } from "./utils";
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

// TODO extract schema to be a form partial
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
    message: "approval successful",
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

const createForm = async (form: z.infer<typeof newFormRequestSchema>) => {
  const { message, id } = await client.newForm.mutate(form);
  // TODO If creation was successful, then write to approvalBucket

  const res = await putForm(approvalBucket, form.formName, JSON.stringify(form));
  
  return {
    message: "",
  };
};

// TODO Define unified output response to better define the contracts

const appRouter = t.router({
  createNewForm: t.procedure
                  .input(newFormRequestSchema)
                  .mutation(async ({ input }) => {
                    const resp = await createForm(input);
                    // TODO If creation was successful, then write to approvalBucket

                    return {
                      message: "",
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
  // getFormById: t.procedure
  //               .input(getFormSchema)
  //               .query(async ({ input }) => {
  //                 if (!input.formId) {
  //                   return {
  //                     message: "No formId provided",
  //                     data: {},
  //                   };
  //                 }
  //                 
  //                 const { success } = await fetchFormById(formBucket, input.formId);

  //                 return {
  //                   message: success ? "get from bucket successful" : "failed to get from bucket",
  //                 };
  //               }),
  // DEBUG To debug from postman
  getFormFromBucket: t.procedure
                .query(async () => {
                  const { success, data } = await fetchFormFromBucket(formBucket, "support-us.json");

                  return {
                    message: success ? "get from bucket successful" : "failed to get from bucket",
                    data: data ?? { content: "nothing here" },
                  };
                }),

  getFormByName: t.procedure
                  .input(getFormSchema)
                  .query(async ({ input }) => {
                     if (!input.formName) {
                      return {
                        message: "No formName provided",
                        data: {},
                      };
                    }
                    
                    const { data } = await fetchForm(cdnUrl, input.formName);

                    return {
                      message: "Success",
                      data,
                    };
                  }),
  modifyFormById: t.procedure
                   .mutation(() => {
                    return {
                      message: "Not yet supported",
                    };
                   }),
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

