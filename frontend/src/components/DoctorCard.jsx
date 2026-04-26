import { Link } from "react-router-dom";
import { uploadsBase } from "../api/client";

export const DoctorCard = ({ doctor }) => (
  <div className="card overflow-hidden">
    <div className="bg-gradient-to-br from-brand-100 to-white p-5">
      <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl">
        <img
          src={
            <img src={`${import.meta.env.VITE_UPLOADS_URL}/uploads/${doctor.image}`} />
              ? doctor.image.startsWith("http")
                ? doctor.image
                : `${uploadsBase}${doctor.image}`
              : "https://placehold.co/400x300?text=Doctor"
          }
          alt={doctor.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
    <div className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            doctor.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {doctor.available ? "Available" : "Unavailable"}
        </span>
        <span className="text-sm font-semibold text-brand-600">
          ₹{doctor.fees}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
        <p className="text-slate-600">{doctor.specialty}</p>
        <p className="mt-1 text-sm text-slate-500">{doctor.degree}</p>
      </div>
      <Link to={`/book/${doctor._id}`} className="btn-primary w-full">
        Book Appointment
      </Link>
    </div>
  </div>
);
