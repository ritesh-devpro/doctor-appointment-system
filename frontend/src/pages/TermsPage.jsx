import { Link } from "react-router-dom";

export const TermsPage = () => {
  return (
    <div className="bg-slate-50">
      <div className="container-app px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          Terms & Conditions
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Effective Date: January 2026
        </p>

        <section className="mt-8 space-y-4 text-slate-700 text-sm sm:text-base">
          <p>
            Welcome to <strong>DrConnect+</strong>. By using our platform, you
            agree to comply with the following terms and conditions.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Use of Services
          </h2>
          <p className="text-slate-700">
            You agree to use DrConnect+ only for lawful purposes related to
            booking and managing doctor appointments.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            User Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Provide accurate personal information</li>
            <li>Maintain account confidentiality</li>
            <li>Do not misuse the platform</li>
          </ul>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Doctor Information
          </h2>
          <p className="text-slate-700">
            DrConnect+ displays doctor profiles for informational purposes. We
            do not guarantee medical outcomes.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Limitation of Liability
          </h2>
          <p className="text-slate-700">
            DrConnect+ is not responsible for any direct or indirect damages
            arising from the use of the platform.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Changes to Terms
          </h2>
          <p className="text-slate-700">
            We may update these terms at any time. Continued use of the platform
            implies acceptance of updated terms.
          </p>
        </section>

        <div className="mt-12">
          <Link to="/" className="btn-primary px-4 py-2">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};