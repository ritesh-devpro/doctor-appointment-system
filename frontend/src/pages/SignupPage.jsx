import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export const SignupPage = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container-app grid min-h-[80vh] items-center py-12 lg:grid-cols-2 lg:gap-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
          Patient sign up
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">
          Create your patient account in a minute
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Doctors are created by admins, while patients can self-register and
          begin booking care right away.
        </p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-5 p-8">
        <input
          placeholder="Full name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone number"
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <button className="btn-primary w-full">Create Account</button>
      </form>
    </div>
  );
};
