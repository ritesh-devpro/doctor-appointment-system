import { useEffect, useState } from "react";
import { api } from "../api/client";
import { DashboardStat } from "../components/DashboardStat";

export const DoctorDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/doctor/dashboard").then(({ data }) => setDashboard(data));
  }, []);

  if (!dashboard) {
    return <div className="py-8">Loading doctor dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Doctor workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Dashboard</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <DashboardStat label="Appointments" value={dashboard.stats.appointments} />
        <DashboardStat label="Earnings" value={`₹${dashboard.stats.earnings}`} />
        <DashboardStat label="Open Slots" value={dashboard.stats.availableSlots} />
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Upcoming appointments</h2>
        <div className="mt-6 space-y-4">
          {dashboard.upcoming.map((item) => (
            <div key={item._id} className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.patient.name}</p>
                <p className="text-sm text-slate-500">{item.patient.email}</p>
              </div>
              <p className="text-sm text-slate-600">{new Date(item.slot).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
