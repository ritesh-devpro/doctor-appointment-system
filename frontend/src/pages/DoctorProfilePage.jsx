import { useEffect, useState } from "react";
import { api } from "../api/client";

export const DoctorProfilePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get("/doctor/profile");
    setDoctor(data.doctor);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (field, value) => {
    setDoctor((current) => ({ ...current, [field]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    await api.put("/doctor/profile", {
      name: doctor.name,
      specialty: doctor.specialty,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      phone: doctor.phone,
      addressLine1: doctor.address.line1,
      addressLine2: doctor.address.line2,
    });
    setMessage("Profile updated.");
    load();
  };

  const toggleAvailability = async () => {
    await api.patch("/doctor/availability");
    load();
  };

  if (!doctor) {
    return <div className="py-8">Loading doctor profile...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            Profile controls
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">Manage profile</h1>
        </div>
        <button onClick={toggleAvailability} className="btn-secondary">
          {doctor.available ? "Set Unavailable" : "Set Available"}
        </button>
      </div>

      <form onSubmit={onSave} className="card grid gap-4 p-6 lg:grid-cols-2">
        <input className="input" value={doctor.name} onChange={(e) => onChange("name", e.target.value)} />
        <input className="input" value={doctor.specialty} onChange={(e) => onChange("specialty", e.target.value)} />
        <input className="input" value={doctor.degree} onChange={(e) => onChange("degree", e.target.value)} />
        <input className="input" value={doctor.experience} onChange={(e) => onChange("experience", e.target.value)} />
        <input className="input" type="number" value={doctor.fees} onChange={(e) => onChange("fees", e.target.value)} />
        <input className="input" value={doctor.phone || ""} onChange={(e) => onChange("phone", e.target.value)} />
        <input
          className="input"
          value={doctor.address.line1}
          onChange={(e) => setDoctor({ ...doctor, address: { ...doctor.address, line1: e.target.value } })}
        />
        <input
          className="input"
          value={doctor.address.line2}
          onChange={(e) => setDoctor({ ...doctor, address: { ...doctor.address, line2: e.target.value } })}
        />
        <textarea className="input min-h-32 lg:col-span-2" value={doctor.about} onChange={(e) => onChange("about", e.target.value)} />
        {message && <p className="text-sm text-emerald-600 lg:col-span-2">{message}</p>}
        <button className="btn-primary lg:col-span-2">Save Changes</button>
      </form>
    </div>
  );
};
