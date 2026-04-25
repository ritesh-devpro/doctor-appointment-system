import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Patient-first booking",
    text: "Patients can discover doctors by specialty, check live slots, book appointments, pay online, and manage visits from one place.",
  },
  {
    title: "Convenience",
    text: "Access to a network of trusted healthcare professionals in your area.",
  },
  {
    title: "Personalization",
    text: "Tailored recommendations and reminders to help you stay on top of your health.",
  },
];

export const AboutPage = () => (
  <div className="bg-slate-50">
    <section className="container-app grid gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-500">
          About DrConnect+
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          A simpler way to connect patients, doctors, and healthcare teams.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          DrConnect+ is an online doctor appointment booking platform built to
          reduce waiting time, remove manual scheduling confusion, and give each
          role a focused dashboard for daily healthcare work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/doctors" className="btn-primary">
            Find Doctors
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl">
        <img
          src="/about_image.png"
          alt="Doctor consultation"
          className="h-full w-full object-cover"
        />
      </div>
    </section>

    <section className="container-app grid gap-5 pb-16 md:grid-cols-3">
      {highlights.map((item) => (
        <article key={item.title} className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
          <p className="mt-3 text-slate-600">{item.text}</p>
        </article>
      ))}
    </section>

    <section className="border-y border-slate-200 bg-white">
      <div className="container-app grid gap-8 py-14 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-500">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Make appointment booking clear, fast, and accessible.
          </h2>
        </div>
        <p className="text-slate-600">
          The system is designed for patients who need quick access to care,
          doctors who need reliable schedules, and administrators who need a
          centralized view of doctors, slots, appointments, and payments.
        </p>
      </div>
    </section>
  </div>
);
