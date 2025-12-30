// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import styles from "./PatientAppointments.module.css";

// function PatientAppointments() {
//     const user = useSelector((state) => state.user);
//     const patientId = user?.login_id;

//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const formatDate = (date) => {
//         return new Date(date).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric"
//         });
//     };

//     const formatTime = (time) => {
//         const [hours, minutes] = time.split(":");
//         const h = hours % 12 || 12;
//         const ampm = hours >= 12 ? "PM" : "AM";
//         return `${h}:${minutes} ${ampm}`;
//     };

//     useEffect(() => {
//         if (!patientId) return;

//         axios
//             .get(`http://localhost:5005/api/appointment/patient/${patientId}`)
//             .then((res) => setAppointments(res.data))
//             .catch(() => setAppointments([]))
//             .finally(() => setLoading(false));
//     }, [patientId]);

//     return (
//         <div className={styles.container}>
//             <h2 className={styles.title}>My Appointments</h2>

//             {loading && <p>Loading appointments...</p>}

//             {!loading && appointments.length === 0 && (
//                 <p className={styles.empty}>No appointments found</p>
//             )}

//             <div className={styles.list}>
//                 {appointments.map((appt) => (
//                     <div key={appt.appointment_id} className={styles.card}>
//                         <div className={styles.header}>
//                             <h3>Dr. {appt.doctor_name}</h3>
//                             <span
//                                 className={`${styles.status} ${styles[appt.status.toLowerCase()]}`}
//                             >
//                                 {appt.status}
//                             </span>
//                         </div>

//                         <p className={styles.specialization}>
//                             {appt.specialization.toUpperCase()}
//                         </p>

//                         <p>
//                             📅 {formatDate(appt.appointment_date)}
//                             ⏰ {formatTime(appt.appointment_time)}
//                         </p>

//                         {appt.reason && (
//                             <p className={styles.reason}>
//                                 <strong>Reason:</strong> {appt.reason}
//                             </p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default PatientAppointments;



import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./PatientAppointments.module.css";
import { useNavigate } from "react-router-dom";

function PatientAppointments() {
  const user = useSelector((state) => state.user);
  const patientId = user?.login_id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const h = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${h}:${minutes} ${ampm}`;
  };

  const fetchAppointments = () => {
    if (!patientId) return;

    axios
      .get(`http://localhost:5005/api/appointment/patient/${patientId}`)
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  // 🔴 CANCEL APPOINTMENT
  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      await axios.patch(
        `http://localhost:5005/api/appointment/cancel/${appointmentId}`
      );

      setAppointments(prev =>
        prev.map(appt =>
          appt.appointment_id === appointmentId
            ? { ...appt, status: "CANCELLED" }
            : appt
        )
      );

      fetchAppointments(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Appointments</h2>

      {loading && <p>Loading appointments...</p>}

      {!loading && appointments.length === 0 && (
        <p className={styles.empty}>No appointments found</p>
      )}

      <div className={styles.list}>
        {appointments.map((appt) => (
          <div key={appt.appointment_id} className={styles.card}>
            <div className={styles.header}>
              <h3>Dr. {appt.doctor_name}</h3>
              <span
                className={`${styles.status} ${styles[appt.status.toLowerCase()]
                  }`}
              >
                {appt.status}
              </span>
            </div>

            <p className={styles.specialization}>
              {appt.specialization.toUpperCase()}
            </p>

            <p>
              📅 {formatDate(appt.appointment_date)} &nbsp;
              ⏰ {formatTime(appt.appointment_time)}
            </p>

            {appt.reason && (
              <p className={styles.reason}>
                <strong>Reason:</strong> {appt.reason}
              </p>
            )}

            {/* 🔴 CANCEL BUTTON (ONLY FOR BOOKED) */}
            {appt.status === "BOOKED" && (
              <button
                className={styles.cancelBtn}
                disabled={cancellingId === appt.appointment_id}
                onClick={() => cancelAppointment(appt.appointment_id)}
              >
                {cancellingId === appt.appointment_id
                  ? "Cancelling..."
                  : "Cancel Appointment"}
              </button>
            )}

            {/* <button
              onClick={() => navigate(`/chat/${appt.appointment_id}`)}
            >
              Open Chat
            </button>

            {appt.status === "COMPLETED" && (
              <button
                onClick={() =>
                  navigate(`/notes/${appt.appointment_id}`)
                }
              >
                View Notes
              </button>

            )}
              <button onClick={() => navigate(`/documents/${appt.appointment_id}`)}>
                Documents
              </button> */}

<div className={styles.actions}>
  {appt.status === "BOOKED" && (
    <button
      className={`${styles.btn} ${styles.danger}`}
      disabled={cancellingId === appt.appointment_id}
      onClick={() => cancelAppointment(appt.appointment_id)}
    >
      ❌ Cancel
    </button>
  )}

  <button
    className={`${styles.btn} ${styles.info}`}
    onClick={() => navigate(`/chat/${appt.appointment_id}`)}
  >
    💬 Chat
  </button>

  {appt.status === "COMPLETED" && (
    <button
      className={`${styles.btn} ${styles.success}`}
      onClick={() => navigate(`/notes/${appt.appointment_id}`)}
    >
      📝 Notes
    </button>
  )}

  <button
    className={`${styles.btn} ${styles.secondary}`}
    onClick={() => navigate(`/documents/${appt.appointment_id}`)}
  >
    📁 Docs
  </button>
</div>




          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientAppointments;
