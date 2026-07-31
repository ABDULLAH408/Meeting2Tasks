import { Request, Response } from "express";
import { analyzeMeetingTranscript } from "../services/groq";
import { ddbDocClient } from "../services/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";
import crypto from "crypto";

export const analyzeMeeting = async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;
    console.log("[Backend API] Received transcript length:", transcript ? transcript.length : 0);
    console.log("[Backend API] Transcript starts with:", typeof transcript === "string" ? transcript.substring(0, 30) : "");
    
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({ error: "Transcript is required" });
    }

    // 1. Analyze transcript using Groq
    console.log("[Backend API] Calling Groq...");
    const analysis = await analyzeMeetingTranscript(transcript);
    console.log("[Backend API] Groq analysis completed:", analysis.summary ? analysis.summary.substring(0, 30) : "No summary");
    
    // 2. Generate IDs
    const meetingId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    
    // 3. Prepare Tasks with generated IDs
    const tasksToInsert = (analysis.tasks || []).map((t: any) => ({
      TaskID: crypto.randomUUID(),
      MeetingID: meetingId,
      Title: t.title,
      Description: t.description || "",
      Owner: t.owner || "Unassigned",
      Priority: t.priority || "Medium",
      DueDate: t.due_date || "",
      Status: "Pending",
      CreatedAt: createdAt
    }));

    // 4. Save Meeting to DynamoDB
    await ddbDocClient.send(
      new PutCommand({
        TableName: config.dynamoMeetingsTable,
        Item: {
          MeetingID: meetingId,
          CreatedAt: createdAt,
          Summary: analysis.summary || "",
          Sentiment: analysis.sentiment || "Neutral",
          Decisions: analysis.decisions || [],
          Risks: analysis.risks || [],
          Questions: analysis.questions || [],
          Transcript: transcript,
          TasksCount: tasksToInsert.length,
        }
      })
    );

    // 5. Save Tasks to DynamoDB (looping for simplicity, could use BatchWrite in production if < 25 items)
    for (const task of tasksToInsert) {
      await ddbDocClient.send(
        new PutCommand({
          TableName: config.dynamoTasksTable,
          Item: task
        })
      );
    }

    // 6. Return the formatted data to frontend
    res.status(200).json({
      meetingId,
      analysis,
      tasks: tasksToInsert
    });
  } catch (error: any) {
    console.error("Error analyzing meeting:", error);
    res.status(500).json({ error: error.message || "Failed to analyze meeting" });
  }
};
