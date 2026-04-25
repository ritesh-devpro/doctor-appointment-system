import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadsBase } from "../api/client";
import { useApp } from "../context/AppContext";

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchDoctorSlots, bookAppointment } = useApp();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDoctorSlots(id);
        setDoctor(data.doctor);
        setSlots(data.slots);
      } catch (err) {
        setError(
          err.response?.data?.message || "Doctor profile could not be loaded",
        );
      }
    };
    load();
  }, [id]);

  const onBook = async () => {
    if (!selectedSlot) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setMessage("");

    try {
      await bookAppointment({ doctorId: id, slotId: selectedSlot });
      setMessage("Appointment booked successfully.");
      const refreshed = await fetchDoctorSlots(id);
      setSlots(refreshed.slots);
      setSelectedSlot("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not book this slot");
    }
  };

  if (error && !doctor) {
    return <div className="container-app py-16 text-rose-600">{error}</div>;
  }

  if (!doctor) {
    return <div className="container-app py-16">Loading doctor profile...</div>;
  }

  return (
    <div className="container-app grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-brand-100 to-white p-5">
          <img
            src={
              doctor.image
                ? doctor.image.startsWith("http")
                  ? doctor.image
                  : `${uploadsBase}${doctor.image}`
                : "https://placehold.co/600x420?text=Doctor"
            }
            alt={doctor.name}
            className="h-80 w-full rounded-3xl object-cover object-top"
          />
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-slate-900">
              {doctor.name}
            </h1>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
              {doctor.specialty}
            </span>
          </div>
          <p className="text-slate-600">{doctor.degree}</p>
          <p className="text-slate-600">{doctor.experience}</p>
          <p className="text-slate-600">{doctor.about}</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p>{doctor.address.line1}</p>
            <p>{doctor.address.line2}</p>
          </div>
          <p className="text-xl font-semibold text-brand-600">
            Consultation fee ₹{doctor.fees}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Live availability
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Book an open slot
        </h2>
        <p className="mt-3 text-slate-600">
          Available time slots come directly from the database and are locked
          when booked.
        </p>
        {!doctor.available && (
          <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm font-semibold text-amber-700">
            This doctor is currently unavailable for new bookings.
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => setSelectedSlot(slot._id)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                selectedSlot === slot._id
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 hover:border-brand-300"
              }`}
            >
              <p className="font-semibold text-slate-900">
                {new Date(slot.start).toLocaleDateString()}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(slot.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </button>
          ))}
        </div>

        {!slots.length && (
          <p className="mt-6 rounded-2xl bg-slate-100 p-4 text-slate-600">
            No free slots are currently available for this doctor.
          </p>
        )}

        {message && <p className="mt-6 text-sm text-emerald-600">{message}</p>}
        {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

        <button
          onClick={onBook}
          disabled={!selectedSlot || !doctor.available}
          className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};
