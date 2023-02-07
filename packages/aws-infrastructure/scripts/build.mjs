import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./lambda/rwFormConfig.ts"],
  bundle: true,
  platform: "node",
  target: "es2021",
  format: "cjs",
  external: ["@aws-sdk/client-s3"],
  outfile: "./bin/lambda/rwFormConfig.js",
});
