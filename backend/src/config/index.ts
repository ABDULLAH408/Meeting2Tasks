import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  awsRegion: process.env.AWS_REGION || "us-east-1",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  dynamoMeetingsTable: process.env.DYNAMODB_MEETINGS_TABLE || "Meeting2Tasks-Meetings",
  dynamoTasksTable: process.env.DYNAMODB_TASKS_TABLE || "Meeting2Tasks-Tasks",
};
