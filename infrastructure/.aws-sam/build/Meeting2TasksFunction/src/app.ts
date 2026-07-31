import express from "express";
import cors from "cors";
import { analyzeMeeting } from "./controllers/analysis";
import { getTasks, updateTask, deleteTask } from "./controllers/tasks";
import { getStats } from "./controllers/meetings";
import meetingsRouter from "./routes/meetings";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large transcripts

// Routes
app.post("/api/analyze", analyzeMeeting);

app.get("/api/tasks", getTasks);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

app.use("/api/meetings", meetingsRouter);
app.get("/api/stats", getStats);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
