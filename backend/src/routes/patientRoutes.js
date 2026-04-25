import express from "express";
import {
  bookAppointment,
  cancelMyAppointment,
  getDoctorSlots,
  getDoctors,
  getMyAppointments,
  getPatientProfile,
  getTopDoctors,
  payForAppointment,
  updatePatientProfile,
} from "../controllers/patientController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/doctors/top", getTopDoctors);
router.get("/doctors/:id/slots", getDoctorSlots);
router.get("/profile", protect, authorize("patient"), getPatientProfile);
router.put("/profile", protect, authorize("patient"), updatePatientProfile);
router.get("/appointments/my", protect, authorize("patient"), getMyAppointments);
router.post("/appointments", protect, authorize("patient"), bookAppointment);
router.patch("/appointments/:id/pay", protect, authorize("patient"), payForAppointment);
router.patch(
  "/appointments/:id/cancel",
  protect,
  authorize("patient"),
  cancelMyAppointment
);

export default router;
