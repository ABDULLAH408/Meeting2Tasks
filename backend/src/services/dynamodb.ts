import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";
import { fallbackMeetings, fallbackTasks } from "./dbFallback";

const client = new DynamoDBClient({
  region: config.awsRegion,
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

const realDocClient = DynamoDBDocumentClient.from(client, translateConfig);

// Create a wrapper that falls back to in-memory store if AWS credentials/tables are missing
export const ddbDocClient = {
  async send(command: any): Promise<any> {
    try {
      return await realDocClient.send(command);
    } catch (error: any) {
      console.warn("[DynamoDB Fallback Active] AWS Error:", error.name, "- Using In-Memory Store");
      
      const isMeetingsTable = command.input.TableName === config.dynamoMeetingsTable;
      const store = isMeetingsTable ? fallbackMeetings : fallbackTasks;

      if (command instanceof PutCommand) {
        const item = command.input.Item;
        store.push(item);
        return {};
      }
      
      if (command instanceof ScanCommand) {
        if (command.input.FilterExpression && command.input.ExpressionAttributeValues) {
          const mId = command.input.ExpressionAttributeValues[":mId"];
          if (mId) {
            return { Items: store.filter((i: any) => i.MeetingID === mId) };
          }
        }
        return { Items: [...store] };
      }

      if (command instanceof GetCommand) {
        const key: any = command.input.Key || {};
        const item = store.find((i: any) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
        return { Item: item };
      }

      if (command instanceof DeleteCommand) {
        const key: any = command.input.Key || {};
        const index = store.findIndex((i: any) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
        if (index > -1) store.splice(index, 1);
        return {};
      }

      if (command instanceof UpdateCommand) {
        const key: any = command.input.Key || {};
        const item = store.find((i: any) => i.TaskID === key.TaskID || i.MeetingID === key.MeetingID);
        if (item) {
          // Simplistic mock update
          const vals: any = command.input.ExpressionAttributeValues || {};
          if (vals[":s"]) item.Status = vals[":s"];
          if (vals[":t"]) item.Title = vals[":t"];
          if (vals[":d"]) item.Description = vals[":d"];
          if (vals[":o"]) item.Owner = vals[":o"];
          if (vals[":p"]) item.Priority = vals[":p"];
          if (vals[":dd"]) item.DueDate = vals[":dd"];
          return { Attributes: item };
        }
        return {};
      }

      throw error;
    }
  }
};
