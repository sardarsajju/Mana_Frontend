import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./ConfirmBooking.module.css";

function ConfirmBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = useSelector((state) => state.user);




  const { doctorId, date, time } = state || {};

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5005/api/doctor/${doctorId}`)
      .then((res) => {
        setDoctor(res.data);
      })
       .catch((err) => {
      console.error("Doctor fetch error:", err);
      setDoctor(null);
      });
  }, [doctorId]);


  if (!doctorId || !date || !time) {
    return <p>Invalid booking details</p>;
  }


  const handleConfirm = async () => {
    try {
      setLoading(true);

      const payload = {
        doctor_id: doctorId,
        patient_id: user.login_id,
        appointment_date: date,
        appointment_time: time.length === 5 ? `${time}:00` : time,
        reason
      };


      await axios.post(
        "http://localhost:5005/api/appointment/book",
        payload
      );

      alert("Appointment booked successfully ✅");
      navigate("/patient");
    } catch (err) {
      console.error("Booking error:", err.response?.data);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }

  };



  return (
<div className={styles.container}>
  <h2 className={styles.title}>Confirm Appointment</h2>
  <p className={styles.subtitle}>
    Please review the details before confirming
  </p>

  <div className={styles.card}>
    <div className={styles.row}>
      <span>Doctor</span>
      <strong>{doctor ? doctor.name : "Loading..."}</strong>
    </div>

    <div className={styles.row}>
      <span>Specialization</span>
      <strong>{doctor ? doctor.specialization : "Loading..."}</strong>
    </div>

    <div className={styles.row}>
      <span>Date</span>
      <strong>{date}</strong>
    </div>

    <div className={styles.row}>
      <span>Time</span>
      <strong>{time}</strong>
    </div>
  </div>

  <div className={styles.section}>
    <label>Reason for Visit</label>
    <textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Briefly describe your concern"
    />
  </div>

  <div className={styles.actions}>
    <button
      className={styles.cancelBtn}
      onClick={() => navigate(-1)}
      disabled={loading}
    >
      Back
    </button>

    <button
      className={styles.confirmBtn}
      disabled={!reason || loading}
      onClick={handleConfirm}
    >
      {loading ? "Booking..." : "Confirm Appointment"}
    </button>
  </div>
</div>

  );
}

export default ConfirmBooking;
