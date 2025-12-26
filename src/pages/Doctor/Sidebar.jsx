import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Doctor Panel</h2>

      <ul>
        <li
          className={styles.menuItem}
          onClick={() => navigate("/doctor")}
        >
          Dashboard
        </li>

        <li
          className={styles.menuItem}
          onClick={() => navigate("/doctor/appointments")}
        >
          Appointments
        </li>

        <li
          className={styles.menuItem}
          onClick={() => navigate("/doctor/patients")}
        >
          Patients
        </li>

        {/* ⭐ NEW MENU ITEM FOR SCHEDULE */}
        <li
          className={styles.menuItem}
          onClick={() => navigate("/doctor/schedule")}
        >
          Schedule
        </li>

        <li
          className={`${styles.menuItem} ${styles.logout}`}
          onClick={() => navigate("/")}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
