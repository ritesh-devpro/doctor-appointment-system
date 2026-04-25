import { useEffect, useState } from "react";
import { uploadsBase } from "../api/client";
import { useApp } from "../context/AppContext";

export const MyAppointmentsPage = () => {
  const { fetchMyAppointments, cancelPatientAppointment, payForAppointment } =
    useApp();
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const items = await fetchMyAppointments();
    setAppointments(items);
  };

  useEffect(() => {
    load();
  }, []);

  const onPay = async (id) => {
    await payForAppointment(id);
    setMessage("Payment completed successfully.");
    load();
  };

  const onCancel = async (id) => {
    await cancelPatientAppointment(id);
    setMessage("Appointment cancelled.");
    load();
  };

  const getImageUrl = (image) => {
    if (!image) return "https://placehold.co/300x300?text=Doctor";

    return image.startsWith("http")
      ? image // cloudinary
      : `${uploadsBase}${image}`; // local
  };

  return (
    <div className="container-app space-y-8 py-14">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Patient portal
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">
          My Appointments
        </h1>
      </div>

      {message && (
        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="space-y-5">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="card grid gap-5 p-5 md:grid-cols-[160px_1fr_auto]"
          >
            <img
              src={getImageUrl(appointment.doctor.image)}
              alt={appointment.doctor.name}
              className="h-40 w-full rounded-3xl object-cover object-top"
              onError={(e) => {
                e.target.src = "https://placehold.co/300x300?text=Doctor";
              }}
            />

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">
                {appointment.doctor.name}
              </h2>
              <p className="text-slate-600">{appointment.doctor.specialty}</p>
              <p className="text-slate-500">
                {new Date(appointment.slot).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                Payment: {appointment.paymentStatus} · Status:{" "}
                {appointment.status}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => onPay(appointment._id)}
                disabled={
                  appointment.paymentStatus === "paid" ||
                  appointment.status !== "booked"
                }
                className="btn-primary disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Pay Online
              </button>

              <button
                onClick={() => onCancel(appointment._id)}
                disabled={appointment.status !== "booked"}
                className="btn-secondary disabled:cursor-not-allowed"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}

        {!appointments.length && (
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              No appointments yet
            </h2>
            <p className="mt-2 text-slate-600">
              Browse specialists and book an available time slot to see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
