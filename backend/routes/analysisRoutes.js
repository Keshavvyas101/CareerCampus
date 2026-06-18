import express from "express";
import multer from "multer";
import { jdGuidance } from "../controllers/jdGuidanceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// JD-guided resume analysis
router.post("/jd", protect, upload.single("resume"), jdGuidance);

export default router;
