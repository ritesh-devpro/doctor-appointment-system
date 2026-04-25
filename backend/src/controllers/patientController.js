import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select("-password");
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob, addressLine1, addressLine2 } = req.body;

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        gender,
        dob: dob || null,
        address: {
          line1: addressLine1 || "",
          line2: addressLine2 || "",
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({ message: "Profile updated", patient });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

export const getTopDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ available: true })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching top doctors" });
  }
};

export const getDoctorSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.available) {
      return res.status(400).json({ message: "Doctor not available" });
    }

    const slots = doctor.slots
      .filter((slot) => !slot.isBooked)
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    res.json({ doctor, slots });
  } catch (error) {
    res.status(500).json({ message: "Slot fetch failed" });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId } = req.body;

    const slotObjectId = new mongoose.Types.ObjectId(slotId);

    const doctor = await Doctor.findOne({
      _id: doctorId,
      available: true,
      slots: {
        $elemMatch: {
          _id: slotObjectId,
          isBooked: false,
        },
      },
    });

    if (!doctor) {
      return res.status(400).json({
        message: "Selected slot is no longer available",
      });
    }

    const slot = doctor.slots.find(
      (item) => String(item._id) === String(slotId),
    );

    if (!slot) {
      return res.status(400).json({ message: "Slot not found" });
    }

    const updateResult = await Doctor.updateOne(
      {
        _id: doctorId,
        slots: {
          $elemMatch: {
            _id: slotObjectId,
            isBooked: false,
          },
        },
      },
      { $set: { "slots.$.isBooked": true } },
    );

    if (!updateResult.modifiedCount) {
      return res.status(400).json({
        message: "Selected slot is no longer available",
      });
    }

    let appointment;

    try {
      appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        slot: slot.start,
        amount: doctor.fees,
      });
    } catch (error) {
      // rollback
      await Doctor.updateOne(
        { _id: doctorId, "slots._id": slotObjectId },
        { $set: { "slots.$.isBooked": false } },
      );
      throw error;
    }

    res.status(201).json({
      message: "Appointment booked",
      appointment,
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Booking failed" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate("doctor", "name image specialty fees")
      .sort({ slot: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const cancelMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("doctor");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled",
      });
    }

    if (appointment.status === "cancelled") {
      return res.json({ message: "Appointment already cancelled" });
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";
    await appointment.save();

    await Doctor.updateOne(
      {
        _id: appointment.doctor._id,
        "slots.start": new Date(appointment.slot),
      },
      { $set: { "slots.$.isBooked": false } },
    );

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};

export const payForAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled appointments cannot be paid",
      });
    }

    if (appointment.paymentStatus === "paid") {
      return res.json({ message: "Already paid" });
    }

    appointment.paymentStatus = "paid";
    await appointment.save();

    res.json({ message: "Payment successful" });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};
