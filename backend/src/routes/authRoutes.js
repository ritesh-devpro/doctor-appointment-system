import express from "express";
import { getMe, login, signupPatient } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupPatient);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
