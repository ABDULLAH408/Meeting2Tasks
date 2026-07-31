import { Request, Response } from "express";
import { ddbDocClient } from "../services/dynamodb";
import { ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const meetingId = req.query.meetingId as string;
    
    let command;
    if (meetingId) {
      command = new ScanCommand({
        TableName: config.dynamoTasksTable,
        FilterExpression: "MeetingID = :mId",
        ExpressionAttributeValues: { ":mId": meetingId }
      });
    } else {
      command = new ScanCommand({
        TableName: config.dynamoTasksTable,
      });
    }

    const data = await ddbDocClient.send(command);
    res.status(200).json(data.Items || []);
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Status, Title, Description, Owner, Priority, DueDate } = req.body;

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (Status) { updateExpressions.push("#S = :s"); expressionAttributeNames["#S"] = "Status"; expressionAttributeValues[":s"] = Status; }
    if (Title) { updateExpressions.push("#T = :t"); expressionAttributeNames["#T"] = "Title"; expressionAttributeValues[":t"] = Title; }
    if (Description) { updateExpressions.push("#D = :d"); expressionAttributeNames["#D"] = "Description"; expressionAttributeValues[":d"] = Description; }
    if (Owner) { updateExpressions.push("#O = :o"); expressionAttributeNames["#O"] = "Owner"; expressionAttributeValues[":o"] = Owner; }
    if (Priority) { updateExpressions.push("#P = :p"); expressionAttributeNames["#P"] = "Priority"; expressionAttributeValues[":p"] = Priority; }
    if (DueDate !== undefined) { updateExpressions.push("#DD = :dd"); expressionAttributeNames["#DD"] = "DueDate"; expressionAttributeValues[":dd"] = DueDate; }

    if (updateExpressions.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const command = new UpdateCommand({
      TableName: config.dynamoTasksTable,
      Key: { TaskID: id },
      UpdateExpression: "SET " + updateExpressions.join(", "),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const data = await ddbDocClient.send(command);
    res.status(200).json(data.Attributes);
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: config.dynamoTasksTable,
        Key: { TaskID: id },
      })
    );
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
