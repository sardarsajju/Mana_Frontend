import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Specializations.module.css";

function Specializations() {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/doctor/specializations")
      .then((res) => setSpecializations(res.data))
      .catch(() => setSpecializations([]));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Choose a Specialization</h2>
        <p className={styles.subtitle}>
          Find doctors based on medical specialization
        </p>

        <div className={styles.grid}>
          {specializations.map((spec) => (
            <div
              key={spec}
              className={styles.card}
              onClick={() => navigate(`/patient/doctors/${spec}`)}
            >
              <span className={styles.cardText}>
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {specializations.length === 0 && (
          <p className={styles.empty}>No specializations available</p>
        )}
      </div>
    </div>
  );
}

export default Specializations;
