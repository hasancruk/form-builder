import * as esbuild from "esbuild";
import resolve from 'esbuild-plugin-resolve';
import { resolve as pathResolve } from "path";

await esbuild.build({
  entryPoints: ["./src/formIdService.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "../aws-infrastructure/bin/lambda/formIdService.js",
  plugins: [
    resolve({
      zod: pathResolve("./node_modules/zod"),
      "@trpc/server": pathResolve("./node_modules/@trpc/server"),
    }),
  ],
});

