#!/bin/bash

tableName=$1

streamArn=`aws dynamodbstreams list-streams --table-name $tableName | jq -r '.Streams[0].StreamArn'`


aws dynamodbstreams describe-stream --stream-arn $streamArn | jq -r '.StreamDescription.Shards[].ShardId' | while read shardId
do
	shardIter=`aws dynamodbstreams get-shard-iterator --stream-arn "$streamArn" --shard-id $shardId --shard-iterator-type TRIM_HORIZON | jq -r '.ShardIterator'`
	recordsResult=`aws dynamodbstreams get-records --shard-iterator $shardIter`
	echo $recordsResult | jq '.Records' > $shardId.json
	recordsLength=`echo $recordsResult | jq '.Records | length'`
	while [ $recordsLength -ne 0 ]
	do
		shardIter=`echo $recordsResult | jq -r '.NextShardIterator'`
		recordsResult=`aws dynamodbstreams get-records --shard-iterator $shardIter`
		echo $recordsResult | jq '.Records' >> $shardId.json
		recordsLength=`echo $recordsResult | jq '.Records | length'`
	done
done