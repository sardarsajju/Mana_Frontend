import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./DoctorAppointment.module.css"

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5005/api/doctor/appointments/${doctorId}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, [doctorId]);

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
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.empty}>
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
                <td>{appt.reason}</td>
                <td
                  className={
                    appt.status === "BOOKED"
                      ? styles.statusBooked
                      : appt.status === "COMPLETED"
                      ? styles.statusCompleted
                      : styles.statusCancelled
                  }
                >
                  {appt.status}
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
