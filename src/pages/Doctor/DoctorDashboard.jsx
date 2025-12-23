
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import StatsCards from "../StatsCards";
import DoctorSlots from "./DoctorSlots";
import DoctorAppointments from "./DoctorAppointments.jsx";

import { useSelector } from "react-redux";
import styles from "./DoctorDashboard.module.css";

// function DoctorDashboard() {
//   const user = useSelector((state) => state.user);
//   const doctorName = user?.name || "Doctor";

//   return (
//     <div className={styles.main}>
//       <Sidebar />

//       <div className={styles.content}>
//         <Topbar name={doctorName} />

//         <StatsCards />

//         <div className={styles.grid}>
//           <TodayAppointments />
//           <PatientList />
//         </div>
//       </div>
//     </div>
//   );
// }

function DoctorDashboard() {
  const user = useSelector((state) => state.user);

  const doctorName = user?.name || "Doctor";
  const doctorId = user?.login_id;   // 🔑 important

  console.log(doctorName);

  return (
    <div className={styles.main}>
      <Sidebar />

      <div className={styles.content}>
        <Topbar name={doctorName} />

        <StatsCards />

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


