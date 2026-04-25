import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${
    isActive ? "text-brand-500" : "text-slate-600 hover:text-brand-500"
  }`;

export const Navbar = () => {
  const { user, clearAuth } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearAuth();
    setOpen(false);
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Find Doctors" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },

    ...(user?.role === "patient"
      ? [
          { to: "/my-appointments", label: "My Appointments" },
          { to: "/profile", label: "Profile" },
        ]
      : []),
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
    ...(user?.role === "doctor"
      ? [{ to: "/doctor", label: "Doctor Panel" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/90 backdrop-blur">
      <div className="container-app flex items-center justify-between py-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl object-contain"
          />
          <div className="leading-tight">
            <p className="text-base sm:text-lg font-bold text-sky-500">
              DrConnect+
            </p>
            <p className="text-[9px] sm:text-xs text-slate-500">
              Expert Care Anytime Anywhere
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden md:block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {user.name}
              </div>
              <button
                onClick={logout}
                className="btn-secondary px-3 py-2 text-xs sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-secondary px-3 py-2 text-xs sm:text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn-primary px-3 py-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Sign up</span>
                <span className="sm:hidden">Sign</span>
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <nav className="container-app flex flex-col gap-2 py-4 px-4">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
