import express from "express";
import multer from "multer";
import { jdGuidance} from "../controllers/jdGuidanceController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// JD-guided resume analysis
router.post("/jd", upload.single("resume"), jdGuidance);

// Debug route to check available models
// router.get("/list-models", listModelsDebug);

export default router;
