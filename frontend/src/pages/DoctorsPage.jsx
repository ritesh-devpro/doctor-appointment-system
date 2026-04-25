import { useMemo, useState } from "react";
import { DoctorCard } from "../components/DoctorCard";
import { SectionTitle } from "../components/SectionTitle";
import { useApp } from "../context/AppContext";

export const DoctorsPage = () => {
  const { doctors } = useApp();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const specialties = useMemo(
    () => ["All", ...new Set(doctors.map((doctor) => doctor.specialty))],
    [doctors]
  );

  const filtered = doctors.filter((doctor) => {
    const matchSpecialty = specialty === "All" || doctor.specialty === specialty;
    const query = `${doctor.name} ${doctor.specialty}`.toLowerCase();
    return matchSpecialty && query.includes(search.toLowerCase());
  });

  return (
    <div className="container-app space-y-8 py-14">
      <SectionTitle
        eyebrow="Find your doctor"
        title="Explore specialists and live schedules"
        description="Search by name or specialty, then open the booking page to reserve an open time slot."
      />

      <div className="card grid gap-4 p-6 md:grid-cols-[1fr_auto]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          placeholder="Search by doctor name or specialty"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="input md:w-64"
        >
          {specialties.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
      {!filtered.length && (
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">No doctors found</h2>
          <p className="mt-2 text-slate-600">
            Try a different specialty or ask the admin to add doctors from the
            admin panel.
          </p>
        </div>
      )}
    </div>
  );
};
