import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class AwsInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    // TODO Encrypt this bucket
    // TODO Define removal and retention policy
    const formConfigBucket = new s3.Bucket(this, "FormConfigBucket", {
      bucketName: "form-config-bucket",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // TODO Does this mean when retrieved, all the versions will be retrieved?
      versioned: true,
    });
    
    const distribution = new cloudfront.Distribution(this, "FormConfigDistribution", {
      defaultBehavior: { origin: new origins.S3Origin(formConfigBucket) },
    });
    
    const formIdService  = new lambda.Function(this, "FormIdService", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("bin/lambda"),
      handler: "formIdService.handler",
    });
    
    const formIdEndpoint = new apigateway.LambdaRestApi(this, "FormIdEndpoint", {
      handler: formIdService,
      deploy: true,
      deployOptions: {
        stageName: "prod",
      },
    });

    const formConfigService = new lambda.Function(this, "FormConfigService", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("bin/lambda"),
      handler: "formConfigService.handler",
      environment: {
        "FORM_BUCKET": formConfigBucket.bucketName,
        "CDN_URL": distribution.domainName,
        "FORM_ID_ENDPOINT_URL": formIdEndpoint.url,
      },
    });

    const formConfigEndpoint = new apigateway.LambdaRestApi(this, "FormConfigEndpoint", {
      handler: formConfigService,
      deploy: true,
      deployOptions: {
        stageName: "prod",
      },
    });

    formConfigBucket.grantReadWrite(formConfigService);
  }
}
