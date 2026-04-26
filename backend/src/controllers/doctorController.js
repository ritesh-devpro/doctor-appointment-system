import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const [appointments, earningsData, upcoming] = await Promise.all([
      Appointment.countDocuments({
        doctor: doctorId,
        status: { $ne: "cancelled" },
      }),

      Appointment.aggregate([
        {
          $match: {
            doctor: doctorId,
            paymentStatus: "paid",
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),


      Appointment.find({
        doctor: doctorId,
        status: { $in: ["booked", "pending", "confirmed"] },
        slot: { $gte: new Date() },
      })
        .populate("patient", "name email")
        .sort({ slot: 1 })
        .limit(6),
    ]);

    const now = new Date();

    res.json({
      stats: {
        appointments,
        earnings: earningsData[0]?.total || 0,

        availableSlots: req.user.slots.filter(
          (slot) =>
            !slot.isBooked &&
            new Date(slot.start).getTime() > now.getTime()
        ).length,
      },
      upcoming,
      profile: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    res.json({ doctor: req.user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const fields = [
      "name",
      "specialty",
      "degree",
      "experience",
      "about",
      "fees",
      "phone",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    if (req.body.addressLine1 !== undefined) {
      req.user.address.line1 = req.body.addressLine1;
    }

    if (req.body.addressLine2 !== undefined) {
      req.user.address.line2 = req.body.addressLine2;
    }

    if (Array.isArray(req.body.newSlots)) {
      const existingSlots = req.user.slots.map((s) =>
        new Date(s.start).getTime()
      );

      req.body.newSlots.forEach((slot) => {
        const date = new Date(slot);

        if (date.getTime() > new Date().getTime()) {
          const time = date.getTime();

          if (!existingSlots.includes(time)) {
            req.user.slots.push({
              start: date,
              isBooked: false,
            });
          }
        }
      });

      req.user.slots.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );
    }

    await req.user.save();

    res.json({
      message: "Profile updated",
      doctor: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

export const toggleDoctorAvailability = async (req, res) => {
  try {
    req.user.available = !req.user.available;
    await req.user.save();

    res.json({ available: req.user.available });
  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email")
      .sort({ slot: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const cancelDoctorAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed appointments cannot be cancelled" });
    }

    if (appointment.status === "cancelled") {
      return res.json({ message: "Appointment already cancelled" });
    }

    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    await appointment.save();

    await Doctor.updateOne(
      {
        _id: req.user._id,
        "slots.start": new Date(appointment.slot),
      },
      { $set: { "slots.$.isBooked": false } }
    );

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};

export const completeDoctorAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled appointments cannot be completed" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({ message: "Appointment completed" });
  } catch (error) {
    res.status(500).json({ message: "Complete failed" });
  }
};

export const getDoctorSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const now = new Date();

    const slots = doctor.slots.filter(
      (slot) =>
        !slot.isBooked &&
        new Date(slot.start).getTime() > now.getTime()
    );

    res.json({
      doctor,
      slots,
    });
  } catch (error) {
    res.status(500).json({ message: "Slot fetch failed" });
  }
};
