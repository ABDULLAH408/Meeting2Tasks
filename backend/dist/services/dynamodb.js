"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ddbDocClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("../config");
const dbFallback_1 = require("./dbFallback");
const client = new client_dynamodb_1.DynamoDBClient({
    region: config_1.config.awsRegion,
});
const marshallOptions = {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
};
const unmarshallOptions = {
    wrapNumbers: false,
};
const translateConfig = { marshallOptions, unmarshallOptions };
const realDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client, translateConfig);
// Create a wrapper that falls back to in-memory store if AWS credentials/tables are missing
exports.ddbDocClient = {
    async send(command) {
        try {
            return await realDocClient.send(command);
        }
        catch (error) {
            console.warn("[DynamoDB Fallback Active] AWS Error:", error.name, "- Using In-Memory Store");
            const isMeetingsTable = command.input.TableName === config_1.config.dynamoMeetingsTable;
            const store = isMeetingsTable ? dbFallback_1.fallbackMeetings : dbFallback_1.fallbackTasks;
            if (command instanceof lib_dynamodb_1.PutCommand) {
                const item = command.input.Item;
                store.push(item);
                return {};
            }
            if (command instanceof lib_dynamodb_1.ScanCommand) {
                if (command.input.FilterExpression && command.input.ExpressionAttributeValues) {
                    const mId = command.input.ExpressionAttributeValues[":mId"];
                    if (mId) {
                        return { Items: store.filter((i) => i.MeetingID === mId) };
                    }
                }
                return { Items: [...store] };
            }
            if (command instanceof lib_dynamodb_1.GetCommand) {
                const key = command.input.Key || {};
                const item = store.find((i) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
                return { Item: item };
            }
            if (command instanceof lib_dynamodb_1.DeleteCommand) {
                const key = command.input.Key || {};
                const index = store.findIndex((i) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
                if (index > -1)
                    store.splice(index, 1);
                return {};
            }
            if (command instanceof lib_dynamodb_1.UpdateCommand) {
                const key = command.input.Key || {};
                const item = store.find((i) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
                if (item) {
                    // Simplistic mock update
                    const vals = command.input.ExpressionAttributeValues || {};
                    if (vals[":s"])
                        item.Status = vals[":s"];
                    if (vals[":t"])
                        item.Title = vals[":t"];
                    if (vals[":d"])
                        item.Description = vals[":d"];
                    if (vals[":o"])
                        item.Owner = vals[":o"];
                    if (vals[":p"])
                        item.Priority = vals[":p"];
                    if (vals[":dd"])
                        item.DueDate = vals[":dd"];
                    return { Attributes: item };
                }
                return {};
            }
            throw error;
        }
    }
};
