import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white mt-auto">
    <div className="container-app px-4 sm:px-6 py-8 sm:py-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-sm text-slate-600">
      <div>
        <h2 className="text-base sm:text-xl font-bold text-sky-500">
          DrConnect+
        </h2>
        <p className="mt-2">
          Helping patients discover specialists and book care faster.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-2">Quick Links</h3>
        <ul className="space-y-1">
          <li>
            <Link to="/about" className="hover:text-brand-500">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-brand-500">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-brand-500">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-brand-500">
              Term & Conditions
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-between">
        <p>© 2026 DrConnect+ All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);
