import jwt from "jsonwebtoken";
import { Doctor } from "../models/Doctor.js";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate role
    if (!["doctor", "patient", "admin"].includes(decoded.role)) {
      return res.status(401).json({ message: "Invalid token role" });
    }

    if (decoded.role === "doctor") {
      req.user = await Doctor.findById(decoded.id).select("-password");
    } else {
      req.user = await User.findById(decoded.id).select("-password");
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Token is invalid" });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};