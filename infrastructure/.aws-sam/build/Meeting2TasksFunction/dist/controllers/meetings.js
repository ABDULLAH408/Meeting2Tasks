"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeeting = exports.getMeetingById = exports.getStats = exports.getMeetings = void 0;
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
            dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({ TableName: config_1.config.dynamoMeetingsTable })),
            dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({ TableName: config_1.config.dynamoTasksTable }))
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
const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.GetCommand({
            TableName: config_1.config.dynamoMeetingsTable,
            Key: { MeetingID: id },
        }));
        if (!data.Item) {
            return res.status(404).json({ error: "Meeting not found" });
        }
        res.status(200).json(data.Item);
    }
    catch (error) {
        console.error("Error fetching meeting:", error);
        res.status(500).json({ error: "Failed to fetch meeting" });
    }
};
exports.getMeetingById = getMeetingById;
const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        // First, fetch all tasks for this meeting to delete them
        const tasksData = await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand({
            TableName: config_1.config.dynamoTasksTable,
            FilterExpression: "MeetingID = :mId",
            ExpressionAttributeValues: { ":mId": id }
        }));
        const tasks = tasksData.Items || [];
        // Delete tasks
        for (const task of tasks) {
            await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.DeleteCommand({
                TableName: config_1.config.dynamoTasksTable,
                Key: { TaskID: task.TaskID }
            }));
        }
        // Delete meeting
        await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.DeleteCommand({
            TableName: config_1.config.dynamoMeetingsTable,
            Key: { MeetingID: id }
        }));
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error deleting meeting:", error);
        res.status(500).json({ error: "Failed to delete meeting" });
    }
};
exports.deleteMeeting = deleteMeeting;
