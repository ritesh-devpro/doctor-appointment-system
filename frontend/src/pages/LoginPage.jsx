import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await login({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app grid min-h-[80vh] items-center py-12 lg:grid-cols-2 lg:gap-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Welcome back
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">
          Access your DrConnect workspace
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Patients can book and manage visits, doctors can monitor schedules,
          and admins can onboard specialists and oversee all appointments.
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-5 p-8">
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
