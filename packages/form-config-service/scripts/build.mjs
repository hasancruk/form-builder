import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/formConfigService.ts"],
  bundle: true,
  platform: "node",
  target: "es2021",
  format: "cjs",
  external: ["@aws-sdk/client-s3"],
  outfile: "../aws-infrastructure/bin/lambda/formConfigService.js",
});
