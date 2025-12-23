import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RecentAppointments.module.css";

function RecentAppointments({ patientId }) {
    const [appointments, setAppointments] = useState([]);


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


    useEffect(() => {
        if (!patientId) return;

        axios
            .get(
                `http://localhost:5005/api/appointment/patient/${patientId}/recent`
            )
            .then((res) => setAppointments(res.data))
            .catch(() => setAppointments([]));
    }, [patientId]);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Recent Appointments</h3>

            {appointments.length === 0 && (
                <p className={styles.empty}>No recent appointments</p>
            )}

            {appointments.map((appt) => (
                <div key={appt.appointment_id} className={styles.card}>
                    <div>
                        <strong>{appt.doctor_name}</strong>
                        <span className={styles.spec}>
                            {appt.specialization.toUpperCase()}
                        </span>
                    </div>

                    <div className={styles.meta}>
                        <span>📅 {formatDate(appt.appointment_date)}</span>
                        <span>⏰ {formatTime(appt.appointment_time)}</span>

                        <span className={styles.status}>{appt.status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentAppointments;
