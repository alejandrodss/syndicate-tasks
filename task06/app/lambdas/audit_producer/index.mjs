import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import crypto from 'crypto';
import {
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamoClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.audit_table_name;

const createDynamoPayload = (event) => {
    const { eventName, dynamodb } = event; 
    switch(eventName) {
        case "INSERT":
            return {
                "newValue": {
                    "key": dynamodb.NewImage.key.S,
                    "value": dynamodb.NewImage.value.N
                }
            }
        case "MODIFY":
            return {
                "updatedAttribute": "value",
                "oldValue": dynamodb.OldImage.value.N,
                "newValue": dynamodb.NewImage.value.N
            }
        default:
            return {
                "message": "No action mapped"
            }
    }
}

export const handler = async (event, context) => {
    let auditData = {};
    try {
        console.log(event);
        const dynamoEvent = event.Records[0];
        console.log(dynamoEvent)
        auditData = {
            "id": crypto.randomUUID(),
            "itemKey": dynamoEvent.dynamodb.Keys.key.S,
            "modificationTime": (new Date()).toISOString(),
            ...createDynamoPayload(dynamoEvent)
        }
        console.log(auditData)
        await dynamoClient.send(
            new PutCommand({
                TableName: tableName,
                Item: {
                ...auditData
                }
            })
        );
    } catch (e) {
        console.log("An error has ocurred: ", e.message);
    }
    return;
};
