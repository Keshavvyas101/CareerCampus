import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getApplications).post(addApplication);

router.route("/:id").put(updateApplication).delete(deleteApplication);

export default router;
