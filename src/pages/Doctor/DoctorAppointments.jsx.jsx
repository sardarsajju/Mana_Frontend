// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./DoctorAppointment.module.css"

// const DoctorAppointments = ({ doctorId }) => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     if (!doctorId) return;

//     axios
//       .get(`http://localhost:5005/api/doctor/appointments/${doctorId}`)
//       .then((res) => setAppointments(res.data))
//       .catch((err) => console.error("Error fetching appointments:", err));
//   }, [doctorId]);

//   return (
//     <div className={styles.tableWrapper}>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Patient</th>
//             <th>Reason</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {appointments.length === 0 ? (
//             <tr>
//               <td colSpan="5" className={styles.empty}>
//                 No appointments found
//               </td>
//             </tr>
//           ) : (
//             appointments.map((appt) => (
//               <tr key={appt.appointment_id}>
//                 <td>
//   {new Date(appt.appointment_date).toLocaleDateString("en-IN")}
// </td>

//                 <td>{appt.appointment_time}</td>
//                 <td>{appt.patient_name}</td>
//                 <td>{appt.reason}</td>
//                 <td
//                   className={
//                     appt.status === "BOOKED"
//                       ? styles.statusBooked
//                       : appt.status === "COMPLETED"
//                       ? styles.statusCompleted
//                       : styles.statusCancelled
//                   }
//                 >
//                   {appt.status}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DoctorAppointments;













import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DoctorAppointment.module.css";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = () => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5005/api/doctor/appointments/${doctorId}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);

      await axios.patch(
        `http://localhost:5005/api/appointment/status/${appointmentId}`,
        { status: newStatus }
      );

      // ✅ UPDATE LOCAL STATE INSTEAD OF REFETCH
      setAppointments(prev =>
        prev.map(appt =>
          appt.appointment_id === appointmentId
            ? { ...appt, status: newStatus }
            : appt
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };


  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th> {/* 👈 NEW */}
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.empty}>
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.appointment_id}>
                <td>
                  {new Date(appt.appointment_date).toLocaleDateString("en-IN")}
                </td>
                <td>{appt.appointment_time}</td>
                <td>{appt.patient_name}</td>
                <td>{appt.reason || "-"}</td>

                {/* STATUS */}
                <td
                  className={
                    appt.status === "BOOKED"
                      ? styles.statusBooked
                      : appt.status === "IN_PROGRESS"
                        ? styles.statusInProgress
                        : appt.status === "COMPLETED"
                          ? styles.statusCompleted
                          : styles.statusCancelled
                  }
                >
                  {appt.status}
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  {appt.status === "BOOKED" && (
                    <button
                      className={styles.startBtn}
                      disabled={updatingId === appt.appointment_id}
                      onClick={() =>
                        updateStatus(appt.appointment_id, "IN_PROGRESS")
                      }
                    >
                      Start
                    </button>
                  )}

                  {appt.status === "IN_PROGRESS" && (
                    <button
                      className={styles.completeBtn}
                      disabled={updatingId === appt.appointment_id}
                      onClick={() =>
                        updateStatus(appt.appointment_id, "COMPLETED")
                      }
                    >
                      Complete
                    </button>
                  )}

                  {/* 📝 DOCTOR NOTES BUTTON */}
                  <button
                    className={styles.notesBtn}
                    onClick={() =>
                      navigate(`/notes/${appt.appointment_id}`)
                    }
                  >
                    Notes
                  </button>

                  {/* 💬 CHAT */}
                  <button
                    onClick={() => navigate(`/chat/${appt.appointment_id}`)}
                  >
                    Chat
                  </button>

                  {(appt.status === "COMPLETED" ||
                    appt.status === "CANCELLED") && <span>DONE</span>}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
