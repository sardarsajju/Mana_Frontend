// import styles from "./StatusCards.module.css";

// function StatsCards() {
//   return (
//     <div className={styles.grid}>
//       <div className={styles.card}>
//         <h2 className={styles.label}>Total Patients</h2>
//         <p className={styles.value}>120</p>
//       </div>

//       <div className={styles.card}>
//         <h2 className={styles.label}>Today's Appointments</h2>
//         <p className={styles.value}>14</p>
//       </div>

//       <div className={styles.card}>
//         <h2 className={styles.label}>Completed</h2>
//         <p className={styles.value}>9</p>
//       </div>
//     </div>
//   );
// }

// export default StatsCards;


import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StatusCards.module.css";

const StatsCards = ({ doctorId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5005/api/appointment/doctor/${doctorId}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, [doctorId]);

  if (!stats) return <p>Loading doctor stats...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Total Appointments</h3>
          <p>{stats.totalAppointments}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>

        <div className={styles.card}>
          <h3>Today</h3>
          <p>{stats.todayAppointments}</p>
        </div>

        <div className={`${styles.card} ${styles.inProgress}`}>
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </div>

        <div className={`${styles.card} ${styles.completed}`}>
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </div>

        <div className={`${styles.card} ${styles.cancelled}`}>
          <h3>Cancelled</h3>
          <p>{stats.cancelled}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
