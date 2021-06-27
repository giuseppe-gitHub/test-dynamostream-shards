import { Context, DynamoDBStreamEvent } from "aws-lambda";
import _ from 'lodash';

let index: number = 0;

export async function handler(event: DynamoDBStreamEvent, context: Context): Promise<any> {
  _.forEach(event.Records, record => {
    console.log(index, record.dynamodb?.NewImage);
    index++;
  })
}