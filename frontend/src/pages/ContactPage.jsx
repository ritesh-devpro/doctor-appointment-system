import { useState } from "react";

const contactItems = [
  {
    label: "Email",
    value: "support@drconnect.com",
  },
  {
    label: "Phone",
    value: "+91 98765 43210",
  },
  {
    label: "Address",
    value: "DrConnect+ Care Desk, Varanasi, Uttar Pradesh",
  },
];

export const ContactPage = () => {
  const [sent, setSent] = useState(false);
  
  const onSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      setSent(true);
      event.currentTarget.reset();
    } else {
      alert(result.error || "Something went wrong");
    }
  } catch (error) {
    alert("Server error");
  }
};

  return (
    <div className="container-app grid gap-10 py-16 lg:grid-cols-[0.85fr_1fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-500">
          Contact us
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          We are here to help with appointments and platform support.
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Reach out for booking help, doctor onboarding, payment questions, or
          technical support.
        </p>

        <div className="mt-8 grid gap-4">
          {contactItems.map((item) => (
            <div key={item.label} className="card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={onSubmit} className="card space-y-5 p-6">
        <div>
          <label className="text-sm font-semibold text-slate-700">Full name</label>
          <input className="input mt-2" name="name" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input className="input mt-2" name="email" type="email" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Subject</label>
          <input className="input mt-2" name="subject" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea className="input mt-2 min-h-36" name="message" required />
        </div>
        {sent && (
          <p className="rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            Your message has been noted. Our support team will contact you soon.
          </p>
        )}
        <button className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  );
};
