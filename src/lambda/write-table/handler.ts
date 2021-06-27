import { Context } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { WriteLambdaInput, writeLambdaInputSchema } from "../model/model";


const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME!;

export async function handler(input: WriteLambdaInput, context: Context): Promise<any> {
  writeLambdaInputSchema.parse(input);


  for (let i = 0; i < input.itemsToWrite; i++) {
    const item = {
      pk: 'ITEM',
      sk: i
    };
    await docClient.put({
      TableName: tableName,
      Item: item
    }).promise();
  }


}