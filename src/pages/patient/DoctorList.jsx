

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DoctorsList.module.css";

function DoctorsList() {
  const { specialization } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!specialization) return;

    setLoading(true);

    axios
      .get(
        `http://localhost:5005/api/doctor/by-specialization/${specialization.toLowerCase()}`
      )
      .then((res) => {
        setDoctors(res.data);
      })
      .catch(() => {
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [specialization]);

  return (
<div className={styles.container}>
  <h2 className={styles.title}>
    {specialization.charAt(0).toUpperCase() + specialization.slice(1)} Doctors
  </h2>

  <p className={styles.subtitle}>
    Select a doctor to view available dates & slots
  </p>

  {loading && <p className={styles.info}>Loading doctors...</p>}

  {!loading && doctors.length === 0 && (
    <p className={styles.info}>No doctors available</p>
  )}

<div className={styles.grid}>
  {doctors.map((doc) => (
    <div
      key={doc.doctor_id}
      className={styles.card}
      onClick={() => navigate(`/patient/doctor/${doc.doctor_id}`)}
    >
      <h3 className={styles.name}>Dr. {doc.name}</h3>

      <span className={styles.badge}>
        {doc.specialization.toUpperCase()}
      </span>

      <p className={styles.experience}>
        {doc.experience} Years Experience
      </p>
    </div>
  ))}
</div>

</div>

  );
}

export default DoctorsList;
