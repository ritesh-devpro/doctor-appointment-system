import { useEffect, useState } from "react";
import { api } from "../api/client";

export const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get("/doctor/appointments");
    setAppointments(data.appointments);
  };

  useEffect(() => {
    load();
  }, []);

  const completeAppointment = async (id) => {
    await api.patch(`/doctor/appointments/${id}/complete`);
    setMessage("Appointment marked as completed.");
    load();
  };

  const cancelAppointment = async (id) => {
    await api.patch(`/doctor/appointments/${id}/cancel`);
    setMessage("Appointment cancelled.");
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Schedule view
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Doctor appointments</h1>
      </div>
      {message && <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Slot</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-t border-slate-100">
                  <td className="px-5 py-4">{appointment.patient.name}</td>
                  <td className="px-5 py-4">{appointment.patient.email}</td>
                  <td className="px-5 py-4">{new Date(appointment.slot).toLocaleString()}</td>
                  <td className="px-5 py-4">{appointment.paymentStatus}</td>
                  <td className="px-5 py-4">{appointment.status}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => completeAppointment(appointment._id)}
                        disabled={appointment.status !== "booked"}
                        className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        disabled={appointment.status !== "booked"}
                        className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!appointments.length && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan="6">
                    No appointments are assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
