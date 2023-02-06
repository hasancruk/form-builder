#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsInfrastructureStack } from '../lib/aws-infrastructure-stack';

const app = new cdk.App();
new AwsInfrastructureStack(app, 'AwsInfrastructureStack');
