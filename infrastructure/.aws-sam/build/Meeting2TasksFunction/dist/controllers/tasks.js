"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = void 0;
const dynamodb_1 = require("../services/dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("../config");
const getTasks = async (req, res) => {
    try {
        const meetingId = req.query.meetingId;
        let command;
        if (meetingId) {
            command = new lib_dynamodb_1.ScanCommand({
                TableName: config_1.config.dynamoTasksTable,
                FilterExpression: "MeetingID = :mId",
                ExpressionAttributeValues: { ":mId": meetingId }
            });
        }
        else {
            command = new lib_dynamodb_1.ScanCommand({
                TableName: config_1.config.dynamoTasksTable,
            });
        }
        const data = await dynamodb_1.ddbDocClient.send(command);
        res.status(200).json(data.Items || []);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { Status, Title, Description, Owner, Priority, DueDate } = req.body;
        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        if (Status) {
            updateExpressions.push("#S = :s");
            expressionAttributeNames["#S"] = "Status";
            expressionAttributeValues[":s"] = Status;
        }
        if (Title) {
            updateExpressions.push("#T = :t");
            expressionAttributeNames["#T"] = "Title";
            expressionAttributeValues[":t"] = Title;
        }
        if (Description) {
            updateExpressions.push("#D = :d");
            expressionAttributeNames["#D"] = "Description";
            expressionAttributeValues[":d"] = Description;
        }
        if (Owner) {
            updateExpressions.push("#O = :o");
            expressionAttributeNames["#O"] = "Owner";
            expressionAttributeValues[":o"] = Owner;
        }
        if (Priority) {
            updateExpressions.push("#P = :p");
            expressionAttributeNames["#P"] = "Priority";
            expressionAttributeValues[":p"] = Priority;
        }
        if (DueDate !== undefined) {
            updateExpressions.push("#DD = :dd");
            expressionAttributeNames["#DD"] = "DueDate";
            expressionAttributeValues[":dd"] = DueDate;
        }
        if (updateExpressions.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }
        const command = new lib_dynamodb_1.UpdateCommand({
            TableName: config_1.config.dynamoTasksTable,
            Key: { TaskID: id },
            UpdateExpression: "SET " + updateExpressions.join(", "),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW",
        });
        const data = await dynamodb_1.ddbDocClient.send(command);
        res.status(200).json(data.Attributes);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await dynamodb_1.ddbDocClient.send(new lib_dynamodb_1.DeleteCommand({
            TableName: config_1.config.dynamoTasksTable,
            Key: { TaskID: id },
        }));
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
