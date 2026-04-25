import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const exists = await User.findOne({ email: adminEmail.toLowerCase() });
  if (exists) {
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: process.env.ADMIN_NAME || "Platform Admin",
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Default admin created for ${adminEmail}`);
};
