import bcrypt from "bcryptjs";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const sanitize = (account) => ({
  _id: account._id,
  name: account.name,
  email: account.email,
  phone: account.phone || "",
  gender: account.gender || "",
  dob: account.dob || null,
  address: account.address || { line1: "", line2: "" },
  role: account.role,
  image: account.image || "",
  specialty: account.specialty || "",
});

export const signupPatient = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email.toLowerCase();

    const [existingUser, existingDoctor] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Doctor.findOne({ email: normalizedEmail }),
    ]);

    if (existingUser || existingDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: "patient",
    });

    const token = generateToken({
      id: patient._id,
      role: patient.role,
    });

    res.status(201).json({
      token,
      user: sanitize(patient),
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    let account;

    if (role === "doctor") {
      account = await Doctor.findOne({ email: normalizedEmail });
    } else if (role === "admin") {
      account = await User.findOne({
        email: normalizedEmail,
        role: "admin",
      });
    } else {
      account = await User.findOne({
        email: normalizedEmail,
        role: "patient",
      });
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("LOGIN USER:", account.email, account.role);

    if (!account.password) {
      return res.status(400).json({ message: "Invalid account data" });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: account._id,
      role: account.role,
    });

    res.json({
      token,
      user: sanitize(account),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      user: sanitize(req.user),
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
