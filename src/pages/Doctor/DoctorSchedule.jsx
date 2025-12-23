import React, { useState } from "react";
import axios from "axios";
import styles from "./DoctorSchedule.module.css";
import { useSelector } from "react-redux";
// import { API_URL } from "../customs/API_Url";

function DoctorSchedule() {
  const user = useSelector((state) => state.user);
  const doctor_id = user.login_id;
  console.log("doctor_id : ", doctor_id);

  const [day_of_week, setDayOfWeek] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");

  const handleAddSchedule = async () => {
    console.log("ghfvb tfvtyfbtyftyfgvtyfgvty")
    if (!doctor_id) {
      alert("Doctor ID not found! Please login again.");
      return;
    }

    console.log("Sending:", {
      doctor_id,
      day_of_week,
      start_time,
      end_time
    });


    try {
      const res = await axios.post(
        "http://localhost:5005/api/appointment/schedule",
        // `${API_URL}/appointment/schedule`,
        {
          doctor_id,
          day_of_week,
          start_time,
          end_time,
        }
      );

      alert(res.data.message);
      console.log(res.data)
    } catch (err) {
  console.error("Backend error:", err.response?.data);

  if (err.response?.data?.message) {
    alert(err.response.data.message);
  } else {
    alert("Failed to add schedule");
  }
}

  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Doctor Schedule</h2>



      <select value={day_of_week} onChange={(e) => setDayOfWeek(e.target.value)}>
        <option value="">Select Day</option>
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
      </select>

      <label>Start Time</label>
      <input
        type="time"
        value={start_time}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label>End Time</label>
      <input
        type="time"
        value={end_time}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button onClick={handleAddSchedule}>Add Schedule</button>
    </div>
  );
}

export default DoctorSchedule;