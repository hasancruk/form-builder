import * as esbuild from "esbuild";
import resolve from 'esbuild-plugin-resolve';
import { resolve as pathResolve } from "path";

await esbuild.build({
  entryPoints: ["./src/formConfigService.ts"],
  bundle: true,
  platform: "node",
  target: "es2021",
  format: "cjs",
  external: ["@aws-sdk/client-s3"],
  outfile: "../aws-infrastructure/bin/lambda/formConfigService.js",
  plugins: [
    resolve({
      zod: pathResolve("./node_modules/zod"),
      "@trpc/server": pathResolve("./node_modules/@trpc/server"),
      "@trpc/client": pathResolve("./node_modules/@trpc/client"),
    }),
  ],

});
