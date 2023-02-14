import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class AwsInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const formConfigBucket = new s3.Bucket(this, "FormConfigBucket", {
      bucketName: "form-config-bucket",
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
    });
    
    const distribution = new cloudfront.Distribution(this, "FormConfigDistribution", {
      defaultBehavior: { origin: new origins.S3Origin(formConfigBucket) },
    });

    // TODO index for faster queries
    // add ttl value so I don't get charged
    const formsTable = new dynamodb.Table(this, "Forms", {
      partitionKey: { name: "formId", type: dynamodb.AttributeType.STRING }, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const formIdCounter = new dynamodb.Table(this, "FormIdCounter", {
      partitionKey: { name: "count", type: dynamodb.AttributeType.NUMBER}, 
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
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
    formsTable.grantFullAccess(formIdService);
    formIdCounter.grantFullAccess(formIdService);
  }
}
