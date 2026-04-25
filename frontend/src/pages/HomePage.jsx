import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DoctorCard } from "../components/DoctorCard";
import { SectionTitle } from "../components/SectionTitle";
import { useApp } from "../context/AppContext";

export const HomePage = () => {
  const { doctors, topDoctors } = useApp();
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  const specialties = useMemo(
    () => ["All", ...new Set(doctors.map((doctor) => doctor.specialty))],
    [doctors],
  );

  const filteredDoctors =
    activeSpecialty === "All"
      ? doctors.slice(0, 8)
      : doctors
          .filter((doctor) => doctor.specialty === activeSpecialty)
          .slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 sm:pb-20">
      <section className="bg-hero text-white">
        <div className="container-app px-4 sm:px-6 grid gap-10 py-12 sm:py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
              Seamless care coordination
            </p>

            <h1
              className="
              max-w-3xl font-semibold leading-tight
              text-3xl 
              sm:text-4xl 
              md:text-5xl 
              lg:text-6xl
            "
            >
              Book trusted doctors with a patient-first experience.
            </h1>

            <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200">
              Discover specialists, lock in live availability from the database,
              and manage every appointment from one calm dashboard.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/doctors"
                className="btn-primary px-4 py-2 text-sm sm:text-base bg-accent hover:bg-orange-500"
              >
                Explore Specialists
              </Link>

              <Link
                to="/signup"
                className="btn-secondary px-4 py-2 text-sm sm:text-base border-white/30 text-white hover:border-white hover:text-white"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/doctor.png"
              alt="Doctor"
              className="w-[80%] sm:w-full max-w-xs sm:max-w-md object-contain drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      <section className="container-app px-4 sm:px-6 space-y-6 sm:space-y-8">
        <SectionTitle
          eyebrow="Browse by specialty"
          title="Choose the care you need"
          description="Filter doctors by expertise and jump into live booking without leaving the page."
        />

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setActiveSpecialty(specialty)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                activeSpecialty === specialty
                  ? "bg-brand-500 text-white"
                  : "bg-white text-slate-600 shadow-sm hover:text-brand-500"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>

        {!filteredDoctors.length && (
          <div className="card p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
              No doctors are listed yet
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Log in as admin to onboard doctors and publish appointment slots.
            </p>
          </div>
        )}
      </section>

      <section className="container-app px-4 sm:px-6 space-y-6 sm:space-y-8">
        <SectionTitle
          eyebrow="Top Doctors"
          title="Popular specialists on DrConnect"
          description="A quick starting point for patients who want high-quality, available doctors right now."
        />

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {topDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>

        {!topDoctors.length && (
          <div className="card p-6 sm:p-8 text-center text-slate-600">
            Top doctors will appear here after the admin adds available doctors.
          </div>
        )}
      </section>
    </div>
  );
};
