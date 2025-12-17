import express from "express";
import {
  login,
  register,
  logout,
  verify,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/login", login);
router.post("/signup", register);
router.post("/logout", logout);
router.get("/verify", verify);
export default router;
