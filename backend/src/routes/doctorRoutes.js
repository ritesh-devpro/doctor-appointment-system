import express from "express";
import {
  cancelDoctorAppointment,
  completeDoctorAppointment,
  getDoctorAppointments,
  getDoctorDashboard,
  getDoctorProfile,
  toggleDoctorAvailability,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("doctor"));
router.get("/dashboard", getDoctorDashboard);
router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.patch("/availability", toggleDoctorAvailability);
router.get("/appointments", getDoctorAppointments);
router.patch("/appointments/:id/cancel", cancelDoctorAppointment);
router.patch("/appointments/:id/complete", completeDoctorAppointment);

export default router;
