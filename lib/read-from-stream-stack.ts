import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaEventSource from '@aws-cdk/aws-lambda-event-sources';
import * as path from 'path';
import { Duration } from '@aws-cdk/core';


export interface ReadFromStreamStackProps extends cdk.StackProps {
  table: dynamodb.ITable
}


export class ReadFromStreamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ReadFromStreamStackProps) {
    super(scope, id, props);

    const lambdaStreamRead = new lambda.Function(this, 'readStreamTable', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../dist/webpack/src/lambda/read-table-stream')
      ),
      handler: 'handler.handler',
      timeout: Duration.seconds(5),
      environment: {
        TABLE_NAME: props.table.tableName
      }
    });

    props.table.grantStreamRead(lambdaStreamRead);

    const streamEventSource = new lambdaEventSource.DynamoEventSource(props.table, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
      retryAttempts: 5,
    });

    lambdaStreamRead.addEventSource(streamEventSource);
  }

}