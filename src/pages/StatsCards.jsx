import styles from "./StatusCards.module.css";

function StatsCards() {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <h2 className={styles.label}>Total Patients</h2>
        <p className={styles.value}>120</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label}>Today's Appointments</h2>
        <p className={styles.value}>14</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.label}>Completed</h2>
        <p className={styles.value}>9</p>
      </div>
    </div>
  );
}

export default StatsCards;
