"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMeeting = void 0;
const groq_1 = require("../services/groq");
const dynamodb_1 = require("../services/dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("../config");
const crypto_1 = __importDefault(require("crypto"));
const analyzeMeeting = async (req, res) => {
    try {
        const { transcript } = req.body;
        if (!transcript || typeof transcript !== "string") {
            return res.status(400).json({ error: "Transcript is required" });
        }
        // 1. Analyze transcript using Groq
        const analysis = await (0, groq_1.analyzeMeetingTranscript)(transcript);
        // 2. Generate IDs
        const meetingId = crypto_1.default.randomUUID();
        const createdAt = new Date().toISOString();
        // 3. Prepare Tasks with generated IDs
        const tasksToInsert = (analysis.tasks || []).map((t) => ({
            TaskID: crypto_1.default.randomUUID(),
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
        await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.PutCommand({
            TableName: config_1.config.dynamoMeetingsTable,
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
        }));
        // 5. Save Tasks to DynamoDB (looping for simplicity, could use BatchWrite in production if < 25 items)
        for (const task of tasksToInsert) {
            await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.PutCommand({
                TableName: config_1.config.dynamoTasksTable,
                Item: task
            }));
        }
        // 6. Return the formatted data to frontend
        res.status(200).json({
            meetingId,
            analysis,
            tasks: tasksToInsert
        });
    }
    catch (error) {
        console.error("Error analyzing meeting:", error);
        res.status(500).json({ error: error.message || "Failed to analyze meeting" });
    }
};
exports.analyzeMeeting = analyzeMeeting;
