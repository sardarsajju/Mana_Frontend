// import React, { useEffect, useState } from "react";
// import axios from "axios";
// // import styles from "../styles/appointment.module.css";
// // import { API_URL } from "../../customs/API_Url";

// function Book_Appointment() {
//     const [appointmentDate, setAppointmentDate] = useState("");
//   const [specialization, setSpecialization] = useState("");
//   const [doctors, setDoctors] = useState([]);
//   const [doctorId, setDoctorId] = useState("");

//   // 🔑 Fetch doctors when date + specialization change
//   useEffect(() => {
//     if (appointmentDate && specialization) {
//       axios
//         .post("http://localhost:5005/api/doctor/available_doctors", {
//           appointment_date: appointmentDate,
//           specialization: specialization
//         })
//         .then((res) => {
//           setDoctors(res.data);
//         })
//         .catch(() => {
//           setDoctors([]);
//         });
//     }
//   }, [appointmentDate, specialization]);

//   return (
//     <div>
//       <h2>Book Appointment</h2>

//       {/* DATE */}
//       <label>Date</label>
//       <input
//         type="date"
//         value={appointmentDate}
//         onChange={(e) => setAppointmentDate(e.target.value)}
//       />

//       {/* SPECIALIZATION */}
//       <label>Specialization</label>
//       <select
//         value={specialization}
//         onChange={(e) => setSpecialization(e.target.value)}
//       >
//         <option value="">Select</option>
//         <option value="heart">Heart</option>
//         <option value="ortho">Ortho</option>
//         <option value="brain">Brain</option>
//         <option value="dental">denatl</option>
//       </select>

//       {/* DOCTOR */}
//       <label>Doctor</label>
//       <select
//         value={doctorId}
//         onChange={(e) => setDoctorId(e.target.value)}
//         disabled={doctors.length === 0}
//       >
//         <option value="">Select Doctor</option>
//         {doctors.map((doc) => (
//           <option key={doc.doctor_id} value={doc.doctor_id}>
//             {doc.name} ({doc.start_time} - {doc.end_time})
//           </option>
//         ))}
//       </select>

//       {/* NO DOCTORS MESSAGE */}
//       {appointmentDate && specialization && doctors.length === 0 && (
//         <p>No doctors available for selected date</p>
//       )}
//     </div>
//   );
// }

// export default Book_Appointment;













import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookAppointment.module.css";
import { useSelector } from "react-redux";


function Book_Appointment() {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");

const user = useSelector((state) => state.user);
  const patient_id = user.login_id;

  console.log(patient_id);
  

  useEffect(() => {
    if (appointmentDate && specialization) {
      axios
        .post("http://localhost:5005/api/doctor/available_doctors", {
          appointment_date: appointmentDate,
          specialization
        })
        .then((res) => setDoctors(res.data))
        .catch(() => setDoctors([]));
    }
  }, [appointmentDate, specialization]);

  const handleBookAppointment = async () => {
    if (!doctorId || !appointmentDate || !appointmentTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5005/api/appointment/book",
        {
          doctor_id: doctorId,
          patient_id,
          appointment_date: appointmentDate,
          appointment_time:
            appointmentTime.length === 5
              ? `${appointmentTime}:00`
              : appointmentTime,
          reason
        }
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

return (
  <div className={styles.container}>
    <h2 className={styles.title}>Book Appointment</h2>

    <div className={styles.formGroup}>
      <label className={styles.label}>Date</label>
      <input
        type="date"
        className={styles.input}
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Specialization</label>
      <select
        className={styles.select}
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      >
        <option value="">Select</option>
        <option value="heart">Heart</option>
        <option value="ortho">Ortho</option>
        <option value="brain">Brain</option>
        <option value="dental">Dental</option>
      </select>
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Doctor</label>
      <select
        className={styles.select}
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        disabled={doctors.length === 0}
      >
        <option value="">Select Doctor</option>
        {doctors.map((doc) => (
          <option key={doc.doctor_id} value={doc.doctor_id}>
            {doc.name} ({doc.start_time} - {doc.end_time})
          </option>
        ))}
      </select>
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Time</label>
      <input
        type="time"
        className={styles.input}
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
      />
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Reason</label>
      <input
        type="text"
        className={styles.input}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for visit"
      />
    </div>

    <button className={styles.button} onClick={handleBookAppointment}>
      Book Appointment
    </button>
  </div>
);

}

export default Book_Appointment;
