import { NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-brand-500 text-white" : "text-slate-600 hover:text-brand-500"
  }`;

export const AdminLayout = () => (
  <div className="container-app space-y-8 py-12">
    <div className="flex flex-wrap gap-3">
      <NavLink to="/admin" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/doctors" className={linkClass}>
        Doctors
      </NavLink>
      <NavLink to="/admin/appointments" className={linkClass}>
        Appointments
      </NavLink>
    </div>
    <Outlet />
  </div>
);
