#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WriteOnTableStack } from '../lib/write-on-table-stack';
import { ReadFromStreamStack } from '../lib/read-from-stream-stack';

const app = new cdk.App();
const writeStack = new WriteOnTableStack(app, 'WriteOnTableStack', {});
new ReadFromStreamStack(app, 'ReadFromStreamStack', {table: writeStack.table})
