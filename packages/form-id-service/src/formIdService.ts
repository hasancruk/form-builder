import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { z } from "zod";
import { createForm, mutateForm, dbForm } from "../../common-lib/src/lib/schema/dbForm";
import { initOperations } from "./util";

export const t = initTRPC.create();

const db = process.env.DB as string;
const counterDb = process.env.COUNTER_DB as string;

const { createNewForm, rejectFormById, archiveFormById } = initOperations({ dbTableName: db, counterDbTableName: counterDb });

const appRouter = t.router({
  getFormId: t.procedure.input(z.string()).query((req) => ({ id: req.input, greeting: "Hello from tRPC" })),
  newForm: t.procedure
            .input(createForm)
            // .output(dbForm)
            .mutation(async ({ input }) => {
              const createResult = await createNewForm(input.formName);  
              return {
                message: "newForm not yet implemented",
                id: createResult,
              };
            }),
  rejectFormById: t.procedure
                .input(mutateForm)
                .mutation(({ input }) => {
                  const rejectionResult = rejectFormById(input.formId);

                  return {
                    message: "rejectFormById not yet implemented",
                  };
                }),
  archiveFormById: t.procedure
                .input(mutateForm)
                .mutation(({ input }) => {
                  const archiveResult = archiveFormById(input.formId);

                  return {
                    message: "archiveFormById not yet implemented",
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
})

