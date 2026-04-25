import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AboutPage } from "./pages/AboutPage";
import { AdminAppointmentsPage } from "./pages/AdminAppointmentsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminDoctorsPage } from "./pages/AdminDoctorsPage";
import { AdminLayout } from "./pages/AdminLayout";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { DoctorAppointmentsPage } from "./pages/DoctorAppointmentsPage";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { DoctorLayout } from "./pages/DoctorLayout";
import { DoctorProfilePage } from "./pages/DoctorProfilePage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PatientProfilePage } from "./pages/PatientProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

const App = () => (
  <div className="flex flex-col min-h-screen bg-slate-50">
    <Navbar />
     <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/book/:id" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
       

        <Route
          path="/profile"
          element={
            <ProtectedRoute allow={["patient"]}>
              <PatientProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allow={["patient"]}>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
        </Route>

        <Route
          path="/doctor"
          element={
            <ProtectedRoute allow={["doctor"]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorDashboardPage />} />
          <Route path="profile" element={<DoctorProfilePage />} />
          <Route path="appointments" element={<DoctorAppointmentsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
    
  </div>
);

export default App;
