import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as lambda from '@aws-cdk/aws-lambda';
import { AttributeType, BillingMode, ITable, StreamViewType } from '@aws-cdk/aws-dynamodb';
import * as path from 'path';

export class WriteOnTableStack extends cdk.Stack {

  private _table: ITable;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this._table = new dynamodb.Table(this, 'streamTable', {
      partitionKey: {
        name: 'pk',
        type:  AttributeType.STRING
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.NUMBER
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    

    const lambdaDynamoWrite = new lambda.Function(this, 'writeTable', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../dist/webpack/src/lambda/write-table')
      ),
      handler: 'handler.handler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        TABLE_NAME: this._table.tableName
      }
    });

    this._table.grantWriteData(lambdaDynamoWrite);
  }


  get table() {
    return this._table;
  }
}
