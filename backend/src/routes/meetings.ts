import { Router } from "express";
import { getMeetings, getMeetingById, deleteMeeting } from "../controllers/meetings";

const router = Router();

// Routes for /api/meetings
router.get("/", getMeetings);
router.get("/:id", getMeetingById);
router.delete("/:id", deleteMeeting);

export default router;
