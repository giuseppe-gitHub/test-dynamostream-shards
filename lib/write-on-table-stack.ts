import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda';
import { AttributeType, BillingMode, StreamViewType } from '@aws-cdk/aws-dynamodb';

export class WriteOnTableStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'streamTable', {
      partitionKey: {
        name: 'pk',
        type:  AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.NUMBER
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE
    });

    const lambdaRead = new lambda.Function(this, 'writeTable', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('src/lambda'),
      handler: 'write-table.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    table.grantWriteData(lambdaRead);
  }
}