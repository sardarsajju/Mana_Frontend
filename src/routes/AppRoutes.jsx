// @ts-nocheck
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

import BookAppointment from "../pages/patient/BookAppointment";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/Doctor/DoctorDashboard";
import DoctorSchedule from "../pages/Doctor/DoctorSchedule";
import Specializations from "../pages/patient/Specializations";
import DoctorsList from "../pages/patient/DoctorList";
import DoctorProfile from "../pages/patient/DoctorProfile";
import ConfirmBooking from "../pages/patient/ConfirmBooking";
import PatientAppointments from "../pages/patient/PatientAppointments";
import AppointmentChat from "../pages/common/AppointmentChat";
import DoctorNotes from "../pages/common/DoctorNotes";
import AppointmentDocuments from "../pages/common/AppointmentDocuments";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/doctor/schedule" element={<DoctorSchedule />} />
      <Route path="/patient/book_appointment" element={<BookAppointment />} />
      <Route
        path="/patient/specializations"
        element={<Specializations />}
      />

      <Route
        path="/patient/doctors/:specialization"
        element={<DoctorsList />}
      />

      <Route
        path="/patient/doctor/:doctorId"
        element={<DoctorProfile />}
      />

      <Route
        path="/patient/confirm"
        element={<ConfirmBooking />}
      />

      <Route
        path="/patient/appointments"
        element={<PatientAppointments />}
      />

      <Route
        path="/chat/:appointmentId"
        element={<AppointmentChat />}
      />
      <Route
        path="/notes/:appointmentId"
        element={<DoctorNotes />}
      />

      <Route
        path="/documents/:appointmentId"
        element={<AppointmentDocuments/>}
      />

    </Routes>
  );
}

export default AppRoutes;
