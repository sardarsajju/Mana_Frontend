import styles from "./PatientList.module.css";

function PatientList() {
  const patients = [
    "Riya Sharma",
    "Amit Verma",
    "Shreya Patel",
    "David Raj",
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recent Patients</h2>

      <ul className={styles.list}>
        {patients.map((name, i) => (
          <li key={i} className={styles.item}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
