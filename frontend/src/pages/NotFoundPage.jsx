import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <div className="container-app grid min-h-[70vh] place-items-center py-16">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
        404
      </p>
      <h1 className="mt-4 text-5xl font-semibold text-slate-900">Page not found</h1>
      <Link to="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </div>
  </div>
);
