import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import crypto from 'crypto';
import {
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "cmtr-b3ebc0e6-Events";


export const handler = async (event, context) => {
    let body;
    let statusCode = 201;
    const headers = {
        "Content-Type": "application/json",
    };
    let dynamo_event = {};
    try {
        console.log(event);
        dynamo_event = {
            "id": crypto.randomUUID(),
            "principalId": event.principalId,
            "createdAt": (new Date()).toISOString(),
            "body": event.content
        }
        console.log(dynamo_event)
        await dynamo.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                ...dynamo_event 
                }
            })
        );
        body = {
            "event": { ...dynamo_event }
        };
    } catch (e) {
        statusCode = 400;
        body = {
            "message": e.message
        }
    }

    return {
        statusCode,
        body,
        headers
    };
};
