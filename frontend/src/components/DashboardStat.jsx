export const DashboardStat = ({ label, value, hint }) => (
  <div className="card p-6">
    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</p>
    <p className="mt-3 text-4xl font-semibold text-slate-900">{value}</p>
    {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
  </div>
);
