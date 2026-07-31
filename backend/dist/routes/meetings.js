"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetings_1 = require("../controllers/meetings");
const router = (0, express_1.Router)();
// Routes for /api/meetings
router.get("/", meetings_1.getMeetings);
router.get("/:id", meetings_1.getMeetingById);
router.delete("/:id", meetings_1.deleteMeeting);
exports.default = router;
