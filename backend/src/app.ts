import express from "express";
import cors from "cors";
import { analyzeMeeting } from "./controllers/analysis";
import { getTasks, updateTask, deleteTask } from "./controllers/tasks";
import { getMeetings, getStats, getMeetingById, deleteMeeting } from "./controllers/meetings";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large transcripts

// Routes
app.post("/api/analyze", analyzeMeeting);

app.get("/api/tasks", getTasks);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

app.get("/api/meetings", getMeetings);
app.get("/api/meetings/:id", getMeetingById);
app.delete("/api/meetings/:id", deleteMeeting);
app.get("/api/stats", getStats);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
