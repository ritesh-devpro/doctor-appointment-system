import { useEffect, useState } from "react";
import { api, uploadsBase } from "../api/client";

const initialForm = {
  name: "",
  email: "",
  password: "",
  specialty: "",
  degree: "",
  experience: "",
  about: "",
  fees: 500,
  phone: "",
  addressLine1: "",
  addressLine2: "",
  slotsText: "",
  slotDate: "",
  slotStartTime: "09:00",
  slotEndTime: "17:00",
  slotInterval: 30,
};

const doctorFields = new Set([
  "slotsText",
  "slotDate",
  "slotStartTime",
  "slotEndTime",
  "slotInterval",
]);

export const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/admin/doctors");
      setDoctors(data.doctors);
    } catch {
      setDoctors([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (!doctorFields.has(key)) {
        payload.append(key, value);
      }
    });

    const slots = form.slotsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    payload.append("slots", JSON.stringify(slots));

    if (image) {
      payload.append("image", image);
    }

    try {
      await api.post("/admin/doctors", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Doctor added successfully.");
      setForm(initialForm);
      setImage(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add doctor");
    }
  };

  const generateSlots = () => {
    setError("");

    if (!form.slotDate || !form.slotStartTime || !form.slotEndTime) {
      setError("Choose a date, start time, and end time before generating slots.");
      return;
    }

    const start = new Date(`${form.slotDate}T${form.slotStartTime}:00`);
    const end = new Date(`${form.slotDate}T${form.slotEndTime}:00`);
    const interval = Number(form.slotInterval) || 30;

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    const slots = [];
    const cursor = new Date(start);

    while (cursor < end) {
      slots.push(cursor.toISOString());
      cursor.setMinutes(cursor.getMinutes() + interval);
    }

    setForm((current) => ({
      ...current,
      slotsText: [current.slotsText, ...slots]
        .filter(Boolean)
        .join("\n"),
    }));
  };

  const getImageUrl = (image) => {
    if (!image) return "https://placehold.co/400x260?text=Doctor";
    return image.startsWith("http") ? image : `${uploadsBase}${image}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Doctor management
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Add and manage doctors
        </h1>
      </div>

     
      <form
        onSubmit={onSubmit}
        className="card grid gap-4 p-6 lg:grid-cols-2"
      >
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="input" placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        <input className="input" placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
        <input className="input" placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <input className="input" placeholder="Consultation fee" type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Address line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
        <input className="input" placeholder="Address line 2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />

        <textarea className="input min-h-28 lg:col-span-2" placeholder="About doctor" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />

        <div className="grid gap-4 rounded-lg border bg-slate-50 p-4 lg:col-span-2 lg:grid-cols-[1fr_1fr_1fr_150px_auto]">
          <input className="input" type="date" value={form.slotDate} onChange={(e) => setForm({ ...form, slotDate: e.target.value })} />
          <input className="input" type="time" value={form.slotStartTime} onChange={(e) => setForm({ ...form, slotStartTime: e.target.value })} />
          <input className="input" type="time" value={form.slotEndTime} onChange={(e) => setForm({ ...form, slotEndTime: e.target.value })} />

          <select className="input" value={form.slotInterval} onChange={(e) => setForm({ ...form, slotInterval: e.target.value })}>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>

          <button type="button" onClick={generateSlots} className="btn-secondary">
            Generate Slots
          </button>
        </div>

        <textarea
          className="input min-h-32 lg:col-span-2"
          placeholder="Slots..."
          value={form.slotsText}
          onChange={(e) => setForm({ ...form, slotsText: e.target.value })}
        />

      
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="input lg:col-span-2"
        />

     
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="h-40 rounded-lg object-cover object-top lg:col-span-2"
          />
        )}

        {message && <p className="text-emerald-600 lg:col-span-2">{message}</p>}
        {error && <p className="text-rose-600 lg:col-span-2">{error}</p>}

        <button className="btn-primary lg:col-span-2">Add Doctor</button>
      </form>

    
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="card overflow-hidden">
            <img
              src={getImageUrl(doctor.image)}
              alt={doctor.name}
              className="h-56 w-full object-cover object-top"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p>{doctor.specialty}</p>
              <p>{doctor.degree}</p>
              <p>{doctor.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};