import { Context } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { WriteLambdaInput, writeLambdaInputSchema } from "../model/model";


const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME!;

export async function handler(input: WriteLambdaInput, context: Context): Promise<any> {
  writeLambdaInputSchema.parse(input);

  const pkNumber = input.pkNumber ?? 1;

  for (let i = 0; i < input.itemsToWrite; i++) {
    const currentPkNumber = i % pkNumber;
    const item = {
      pk: `ITEM-${currentPkNumber}`,
      sk: i
    };
    await docClient.put({
      TableName: tableName,
      Item: item
    }).promise();
  }


}