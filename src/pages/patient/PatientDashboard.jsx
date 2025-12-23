// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// function PatientDashboard() {
//   const user = useSelector((state) => state.user);
//   const navigate=useNavigate();

//   return (
//     <div>

//       <h1>Welcome Patient {user.name}</h1>
//       <button onClick={() => navigate("/patient/book_appointment")}>
//         Book Appointment
//       </button>
//     </div>
//   );
// }

// export default PatientDashboard;



import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./PatientDashboard.module.css";
import PatientHeader from "./PatientHeader";
import RecentAppointments from "./RecentAppointments";

function PatientDashboard() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

return (
  <>
    <PatientHeader />

    <div className={styles.container}>
      <h1 className={styles.title}>
        Welcome Patient {user?.name} 👋
      </h1>

      <p className={styles.subtitle}>
        Book appointments easily with the best doctors
      </p>

      <div className={styles.cards}>
        <div
          className={styles.card}
          onClick={() => navigate("/patient/specializations")}
        >
          <h3>Book Appointment</h3>
          <p>Find doctors and book a slot</p>
        </div>

        <div
          className={styles.card}
          onClick={() => navigate("/patient/appointments")}
        >
          <h3>My Appointments</h3>
          <p>View your booked appointments</p>
        </div>
      </div>
       <RecentAppointments patientId={user.login_id} />
    </div>
  </>
);
}

export default PatientDashboard;
