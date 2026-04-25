import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: true },
);

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "doctor" },
    image: { type: String, default: "" },
    specialty: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, default: "1 Year" },
    about: { type: String, default: "" },
    fees: { type: Number, default: 500 },
    available: { type: Boolean, default: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    slots: [slotSchema],
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
