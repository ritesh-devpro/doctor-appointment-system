import express from "express";
import {
  addDoctor,
  cancelAppointmentAsAdmin,
  getAdminDashboard,
  getAllAppointments,
  getAllDoctors,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/doctors", getAllDoctors);

router.post(
  "/doctors",
  upload.single("image"), // Cloudinary upload
  addDoctor,
);

router.get("/appointments", getAllAppointments);

router.patch("/appointments/:id/cancel", cancelAppointmentAsAdmin);

export default router;
