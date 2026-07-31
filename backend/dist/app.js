"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const analysis_1 = require("./controllers/analysis");
const tasks_1 = require("./controllers/tasks");
const meetings_1 = require("./controllers/meetings");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' })); // Allow large transcripts
// Routes
app.post("/api/analyze", analysis_1.analyzeMeeting);
app.get("/api/tasks", tasks_1.getTasks);
app.put("/api/tasks/:id", tasks_1.updateTask);
app.delete("/api/tasks/:id", tasks_1.deleteTask);
app.get("/api/meetings", meetings_1.getMeetings);
app.get("/api/meetings/:id", meetings_1.getMeetingById);
app.delete("/api/meetings/:id", meetings_1.deleteMeeting);
app.get("/api/stats", meetings_1.getStats);
// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
exports.default = app;
