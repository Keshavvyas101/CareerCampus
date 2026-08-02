import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  askNextQuestion,
  evaluateInterview,
  getInterviewHistory,
} from "../controllers/interviewController.js";

const router = express.Router();

// All interview routes require authentication
router.use(protect);

router.post("/next", askNextQuestion);
router.post("/evaluate", evaluateInterview);
router.get("/history", getInterviewHistory);

export default router;
