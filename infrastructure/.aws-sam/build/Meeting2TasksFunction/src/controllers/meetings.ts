import { Request, Response } from "express";
import { ddbDocClient } from "../services/dynamodb";
import { ScanCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const data = await ddbDocClient.send(
      new ScanCommand({
        TableName: config.dynamoMeetingsTable,
      })
    );
    // Sort by CreatedAt descending
    const meetings = (data.Items || []).sort((a, b) => 
      new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
    );
    res.status(200).json(meetings);
  } catch (error: any) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [meetingsData, tasksData] = await Promise.all([
      ddbDocClient.send(new ScanCommand({ TableName: config.dynamoMeetingsTable, ProjectionExpression: "MeetingID" })),
      ddbDocClient.send(new ScanCommand({ 
        TableName: config.dynamoTasksTable, 
        ProjectionExpression: "TaskID, #status, Priority",
        ExpressionAttributeNames: { "#status": "Status" }
      }))
    ]);

    const meetings = meetingsData.Items || [];
    const tasks = tasksData.Items || [];

    const totalMeetings = meetings.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.Status === "Completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter((t) => t.Priority === "High").length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const avgTasksPerMeeting = totalMeetings > 0 ? Math.round(totalTasks / totalMeetings) : 0;

    res.status(200).json({
      totalMeetings,
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      completionRate,
      avgTasksPerMeeting
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const getMeetingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await ddbDocClient.send(
      new GetCommand({
        TableName: config.dynamoMeetingsTable,
        Key: { MeetingID: id },
      })
    );

    if (!data.Item) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.status(200).json(data.Item);
  } catch (error: any) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
};

export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First, fetch all tasks for this meeting to delete them
    const tasksData = await ddbDocClient.send(
      new ScanCommand({
        TableName: config.dynamoTasksTable,
        FilterExpression: "MeetingID = :mId",
        ExpressionAttributeValues: { ":mId": id }
      })
    );

    const tasks = tasksData.Items || [];

    // Delete tasks
    for (const task of tasks) {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: config.dynamoTasksTable,
          Key: { TaskID: task.TaskID }
        })
      );
    }

    // Delete meeting
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: config.dynamoMeetingsTable,
        Key: { MeetingID: id }
      })
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};
