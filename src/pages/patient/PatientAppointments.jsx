import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./PatientAppointments.module.css";

function PatientAppointments() {
    const user = useSelector((state) => state.user);
    const patientId = user?.login_id;

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${h}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        if (!patientId) return;

        axios
            .get(`http://localhost:5005/api/appointment/patient/${patientId}`)
            .then((res) => setAppointments(res.data))
            .catch(() => setAppointments([]))
            .finally(() => setLoading(false));
    }, [patientId]);

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
                                className={`${styles.status} ${styles[appt.status.toLowerCase()]}`}
                            >
                                {appt.status}
                            </span>
                        </div>

                        <p className={styles.specialization}>
                            {appt.specialization.toUpperCase()}
                        </p>

                        <p>
                            📅 {formatDate(appt.appointment_date)}
                            ⏰ {formatTime(appt.appointment_time)}
                        </p>

                        {appt.reason && (
                            <p className={styles.reason}>
                                <strong>Reason:</strong> {appt.reason}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientAppointments;
