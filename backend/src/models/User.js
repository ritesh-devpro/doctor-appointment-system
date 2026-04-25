import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
    dob: { type: Date, default: null },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
