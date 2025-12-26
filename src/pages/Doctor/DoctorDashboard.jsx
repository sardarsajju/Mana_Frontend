
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import StatsCards from "./StatsCards.jsx";
import DoctorSlots from "./DoctorSlots";
import DoctorAppointments from "./DoctorAppointments.jsx";

import { useSelector } from "react-redux";
import styles from "./DoctorDashboard.module.css";


function DoctorDashboard() {
  const user = useSelector((state) => state.user);

  const doctorName = user?.name || "Doctor";
  const doctorId = user?.login_id;   

  console.log(doctorName);
  console.log(doctorId)

  return (
    <div className={styles.main}>
      <Sidebar />

      <div className={styles.content}>
        <Topbar name={doctorName} />

        <StatsCards doctorId={doctorId}/> 

        {/* 🔹 NEW SECTION: SLOTS */}
        <div className={styles.section}>
          <h2>My Slots</h2>
          {doctorId && <DoctorSlots doctorId={doctorId} />}
        </div>

        {/* 🔹 NEW SECTION: APPOINTMENTS */}
        <div className={styles.section}>
          <h2>My Appointments</h2>
          {doctorId && <DoctorAppointments doctorId={doctorId} />}
        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;


