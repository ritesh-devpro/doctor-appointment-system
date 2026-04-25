import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";

const emptyProfile = {
  name: "",
  phone: "",
  gender: "",
  dob: "",
  address: { line1: "", line2: "" },
};

export const PatientProfilePage = () => {
  const { fetchMe } = useApp();
  const [profile, setProfile] = useState(emptyProfile);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/patient/profile");
    setProfile({
      ...emptyProfile,
      ...data.patient,
      dob: data.patient.dob ? data.patient.dob.slice(0, 10) : "",
      address: {
        line1: data.patient.address?.line1 || "",
        line2: data.patient.address?.line2 || "",
      },
    });
  };

  useEffect(() => {
    load();
  }, []);

  const updateAddress = (field, value) => {
    setProfile((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.put("/patient/profile", {
        name: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
        addressLine1: profile.address.line1,
        addressLine2: profile.address.line2,
      });
      await fetchMe();
      setMessage("Profile updated successfully.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <div className="container-app space-y-8 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-500">
          Patient profile
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          Keep your care details ready
        </h1>
        <p className="mt-4 text-slate-600">
          These details help appointments stay organized and make follow-up visits
          easier for you and your doctor.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card grid gap-4 p-6 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Full name</span>
          <input
            className="input"
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Phone</span>
          <input
            className="input"
            value={profile.phone || ""}
            onChange={(event) =>
              setProfile({ ...profile, phone: event.target.value })
            }
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Gender</span>
          <select
            className="input"
            value={profile.gender || ""}
            onChange={(event) =>
              setProfile({ ...profile, gender: event.target.value })
            }
          >
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Date of birth</span>
          <input
            type="date"
            className="input"
            value={profile.dob || ""}
            onChange={(event) =>
              setProfile({ ...profile, dob: event.target.value })
            }
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Address line 1</span>
          <input
            className="input"
            value={profile.address.line1}
            onChange={(event) => updateAddress("line1", event.target.value)}
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Address line 2</span>
          <input
            className="input"
            value={profile.address.line2}
            onChange={(event) => updateAddress("line2", event.target.value)}
          />
        </label>

        {message && <p className="text-sm text-emerald-600 lg:col-span-2">{message}</p>}
        {error && <p className="text-sm text-rose-600 lg:col-span-2">{error}</p>}

        <button className="btn-primary lg:col-span-2">Save Profile</button>
      </form>
    </div>
  );
};
