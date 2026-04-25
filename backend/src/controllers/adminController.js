import bcrypt from "bcryptjs";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js"; 
import streamifier from "streamifier";


const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "drconnect" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};


const generateSlots = (date) => {
  const slots = [];

  for (let h = 9; h < 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      const slotTime = new Date(date);
      slotTime.setHours(h, m, 0, 0);

      if (slotTime.getTime() > new Date().getTime()) {
        slots.push({
          start: new Date(slotTime),
          isBooked: false,
        });
      }
    }
  }

  return slots;
};


export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      degree,
      experience,
      about,
      fees,
      phone,
      addressLine1,
      addressLine2,
      slots = [],
      generateSlotsDate,
    } = req.body;

    if (!name || !email || !password || !specialty) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const [doctorExists, userExists] = await Promise.all([
      Doctor.findOne({ email: email.toLowerCase() }),
      User.findOne({ email: email.toLowerCase() }),
    ]);

    if (doctorExists || userExists) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let normalizedSlots = [];


    let parsedSlots = [];
    try {
      parsedSlots = Array.isArray(slots)
        ? slots
        : JSON.parse(slots || "[]");
    } catch {
      return res.status(400).json({ message: "Invalid slot format" });
    }


    if (parsedSlots.length > 0) {
      normalizedSlots = parsedSlots
        .map((slot) => new Date(slot))
        .filter((slot) => !Number.isNaN(slot.getTime()))
        .filter((slot) => slot.getTime() > new Date().getTime())
        .sort((a, b) => a - b)
        .map((slot) => ({
          start: slot,
          isBooked: false,
        }));
    } else if (generateSlotsDate) {
      const baseDate = new Date(generateSlotsDate);

      for (let d = 0; d < 5; d++) {
        const day = new Date(baseDate);
        day.setDate(baseDate.getDate() + d);
        normalizedSlots.push(...generateSlots(day));
      }
    } else {
      const today = new Date();

      for (let d = 0; d < 5; d++) {
        const day = new Date(today);
        day.setDate(today.getDate() + d);
        normalizedSlots.push(...generateSlots(day));
      }
    }

    const uniqueMap = new Map();

    normalizedSlots.forEach((slot) => {
      const time = new Date(slot.start).getTime();
      if (!uniqueMap.has(time)) {
        uniqueMap.set(time, slot);
      }
    });

    normalizedSlots = Array.from(uniqueMap.values());


    normalizedSlots.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );


    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
  
    const doctor = await Doctor.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      specialty,
      degree,
      experience,
      about,
      fees,
      phone,
      image: imageUrl,
      address: {
        line1: addressLine1,
        line2: addressLine2,
      },
      slots: normalizedSlots,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: await Doctor.findById(doctor._id).select("-password"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding doctor" });
  }
};


export const getAdminDashboard = async (req, res) => {
  try {
    const [
      doctorCount,
      patientCount,
      appointmentCount,
      revenueData,
      upcoming,
    ] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Appointment.find({
        status: "booked",
        slot: { $gte: new Date() },
      })
        .populate("doctor", "name specialty")
        .populate("patient", "name")
        .sort({ slot: 1 })
        .limit(5),
    ]);

    res.json({
      stats: {
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        revenue: revenueData[0]?.total || 0,
      },
      upcoming,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialty")
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const cancelAppointmentAsAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctor");

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
    appointment.cancelledBy = "admin";
    await appointment.save();

  
    await Doctor.updateOne(
      {
        _id: appointment.doctor._id,
        "slots.start": new Date(appointment.slot),
      },
      { $set: { "slots.$.isBooked": false } }
    );

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};