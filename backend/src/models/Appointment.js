import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slot: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    cancelledBy: {
      type: String,
      enum: ["patient", "admin", "doctor", null],
      default: null,
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctor: 1, slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } },
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
