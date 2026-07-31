"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.getMeetings = void 0;
const dynamodb_1 = require("../services/dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("../config");
const getMeetings = async (req, res) => {
    try {
        const data = await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({
            TableName: config_1.config.dynamoMeetingsTable,
        }));
        // Sort by CreatedAt descending
        const meetings = (data.Items || []).sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
        res.status(200).json(meetings);
    }
    catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
};
exports.getMeetings = getMeetings;
const getStats = async (req, res) => {
    try {
        const [meetingsData, tasksData] = await Promise.all([
            dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({ TableName: config_1.config.dynamoMeetingsTable, ProjectionExpression: "MeetingID" })),
            dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({ TableName: config_1.config.dynamoTasksTable, ProjectionExpression: "TaskID, Status, Priority" }))
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
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};
exports.getStats = getStats;
