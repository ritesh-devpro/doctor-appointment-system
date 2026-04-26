import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

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
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = "Phone must be 10 digits (start with 6-9)";
    }

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

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
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

        <input
          placeholder="Email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        <input
          placeholder="Phone number"
          className="input"
          maxLength={10}
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setForm({ ...form, phone: value });
          }}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

        {/* PASSWORD */}
        <input
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}

        {/* API ERROR */}
        {error && <p className="text-sm text-rose-500">{error}</p>}

        <button className="btn-primary w-full">Create Account</button>
      </form>
    </div>
  );
};
