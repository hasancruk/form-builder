import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { z } from "zod";

export const t = initTRPC.create();

const appRouter = t.router({
  getFormId: t.procedure.input(z.string()).query((req) => ({ id: req.input, greeting: "Hello from tRPC" })),
});

export type AppRouter = typeof appRouter;

// created for each request
const createContext = ({ event, context }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({}) // no context
type Context = inferAsyncReturnType<typeof createContext>;

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
})

