import { Link } from "react-router-dom";

export const PrivacyPage = () => {
  return (
    <div className="bg-slate-50">
      <div className="container-app px-4 sm:px-6 py-12 sm:py-16 max-w-4xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Effective Date: January 2026
        </p>

        
        <section className="mt-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <strong>DrConnect+</strong>. Your privacy is important to us.
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our platform.
          </p>
        </section>

        
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
            <li>Personal details (name, email, phone number)</li>
            <li>Appointment and booking data</li>
            <li>Doctor and patient interaction details</li>
            <li>Technical data such as browser and device information</li>
          </ul>
        </section>

       
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
            <li>To manage doctor appointments and bookings</li>
            <li>To improve platform functionality and user experience</li>
            <li>To communicate important updates</li>
            <li>To ensure security and prevent misuse</li>
          </ul>
        </section>

        
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Data Security
          </h2>
          <p className="text-sm sm:text-base text-slate-700">
            We implement appropriate technical and organizational measures to
            protect your data from unauthorized access, loss, or misuse.
          </p>
        </section>

        
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Third-Party Services
          </h2>
          <p className="text-sm sm:text-base text-slate-700">
            We may use third-party services for payment processing and analytics.
            These providers follow their own privacy policies.
          </p>
        </section>

       
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Your Rights
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
            <li>You can access and update your personal information</li>
            <li>You can request deletion of your account</li>
            <li>You can contact us for any privacy concerns</li>
          </ul>
        </section>

        
        <section className="mt-10 space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base text-slate-700">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p className="text-sm sm:text-base text-slate-700">
            Email: support@drconnect.com
          </p>
        </section>

       
        <div className="mt-12">
          <Link
            to="/"
            className="btn-primary px-4 py-2 text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};