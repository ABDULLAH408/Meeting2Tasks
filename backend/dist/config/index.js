"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    awsRegion: process.env.AWS_REGION || "us-east-1",
    groqApiKey: process.env.GROQ_API_KEY || "",
    groqModel: process.env.GROQ_MODEL || "llama3-8b-8192",
    dynamoMeetingsTable: process.env.DYNAMODB_MEETINGS_TABLE || "Meeting2Tasks-Meetings",
    dynamoTasksTable: process.env.DYNAMODB_TASKS_TABLE || "Meeting2Tasks-Tasks",
};
