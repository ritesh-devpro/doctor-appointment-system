import bcrypt from "bcryptjs";
import { Doctor } from "../models/Doctor.js";

const sampleDoctors = [
  {
    name: "Dr. Ananya Sharma",
    email: "ananya@drconnect.com",
    specialty: "General Physician",
    degree: "MBBS, MD Medicine",
    experience: "8 Years",
    fees: 500,
    phone: "9876543210",
    image: "/uploads/doc2.png", 
    address: {
      line1: "DrConnect Clinic, Gomti Nagar",
      line2: "Lucknow, Uttar Pradesh",
    },
    about:
      "Experienced primary care doctor for fever, diabetes, blood pressure, and preventive health visits.",
  },
  {
    name: "Dr. Rohan Mehta",
    email: "rohan@drconnect.com",
    specialty: "Cardiologist",
    degree: "MBBS, DM Cardiology",
    experience: "11 Years",
    fees: 900,
    phone: "9876543211",
    image: "/uploads/doc1.png", 
    address: {
      line1: "Heart Care Center, Civil Lines",
      line2: "Prayagraj, Uttar Pradesh",
    },
    about:
      "Specialist in heart health, hypertension, chest pain evaluation, ECG review, and cardiac follow-ups.",
  },
  {
    name: "Dr. Kavya Iyer",
    email: "kavya@drconnect.com",
    specialty: "Dermatologist",
    degree: "MBBS, MD Dermatology",
    experience: "7 Years",
    fees: 650,
    phone: "9876543212",
     image: "/uploads/doc9.png",
    address: {
      line1: "Skin Wellness Clinic, Lanka",
      line2: "Varanasi, Uttar Pradesh",
    },
    about:
      "Provides treatment for acne, hair fall, allergies, infections, pigmentation, and routine skin care.",
  },
  {
    name: "Dr. Sameer Khan",
    email: "sameer@drconnect.com",
    specialty: "Pediatrician",
    degree: "MBBS, DCH",
    experience: "9 Years",
    fees: 550,
    phone: "9876543213",
     image: "/uploads/doc3.png",
    address: {
      line1: "Child Care Clinic, Sigra",
      line2: "Varanasi, Uttar Pradesh",
    },
    about:
      "Child health specialist for vaccinations, nutrition, fever, cough, growth tracking, and follow-up care.",
  },
];

const buildSlots = () => {
  const times = [
    [9, 0],
    [10, 0],
    [11, 30],
    [14, 0],
    [15, 30],
  ];
  const slots = [];
  const today = new Date();

  for (let day = 1; day <= 7; day += 1) {
    times.forEach(([hour, minute]) => {
      const slot = new Date(today);
      slot.setDate(today.getDate() + day);
      slot.setHours(hour, minute, 0, 0);
      slots.push({ start: slot });
    });
  }

  return slots;
};

export const createSampleDoctors = async () => {
  if (process.env.SEED_DEMO_DATA === "false") {
    return;
  }

  const existingDoctors = await Doctor.countDocuments();
  if (existingDoctors > 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash("Doctor@123", 10);
  await Doctor.insertMany(
    sampleDoctors.map((doctor) => ({
      ...doctor,
      password: hashedPassword,
      slots: buildSlots(),
    }))
  );

  console.log("Demo doctors created with password Doctor@123");
};
