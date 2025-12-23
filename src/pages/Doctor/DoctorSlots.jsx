
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./DoctorSlots.module.css";

const DoctorSlots = ({ doctorId }) => {
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const normalizeTime = (time) => time.slice(0, 5);


  const navigate = useNavigate();

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const fetchSlots = async (selectedDate) => {
    try {
      const res = await axios.get(
        `http://localhost:5005/api/doctor/slots/${doctorId}/${selectedDate}`
      );
console.log(res.data);

      const available = (res.data.availableSlots || []).slice().sort();
      const booked = (res.data.bookedSlots || []).slice().sort();

      setAvailableSlots(available);
      setBookedSlots(booked);
    } catch (error) {
      console.error("Error fetching slots:", error);

    }
  };


  // 🔹 LOAD TODAY SLOTS BY DEFAULT
  useEffect(() => {
    if (!doctorId) return;

    const today = getTodayDate();
    setDate(today);
    fetchSlots(today);
  }, [doctorId]);


  const allSlotsMap = new Map();

  // Available slots
  availableSlots.forEach((time) => {
    allSlotsMap.set(normalizeTime(time), "available");
  });

  // Booked slots override available
  bookedSlots.forEach((time) => {
    allSlotsMap.set(normalizeTime(time), "booked");
  });


  const handleDeleteSchedule = async () => {
  if (!date) return;

  const dayOfWeek = new Date(date).toLocaleString("en-US", {
    weekday: "long",
  });

  const confirmDelete = window.confirm(
    `Delete schedule for ${dayOfWeek}? This will remove all slots for this day.`
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `http://localhost:5005/api/doctor/schedule/${doctorId}/${dayOfWeek}`
    );
    console.log(res.data)
    alert(res.data.message);

    // Clear slots immediately
    setAvailableSlots([]);
    setBookedSlots([]);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete schedule");
  }
};


  const allSlots = Array.from(allSlotsMap.entries())
    .map(([time, status]) => ({ time, status }))
    .sort((a, b) => a.time.localeCompare(b.time));


  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <input
          type="date"
          className={styles.dateInput}
          value={date}
          onChange={(e) => {
            const selectedDate = e.target.value;
            setDate(selectedDate);
            fetchSlots(selectedDate);
          }}
        />

        <button
          className={styles.addScheduleBtn}
          onClick={() => navigate("/doctor/schedule")}
        >
          + Add Schedule
        </button>
      </div>

<button
  className={styles.deleteScheduleBtn}
  onClick={handleDeleteSchedule}
>
  🗑 Delete Schedule
</button>

      {/* SLOTS */}
      <div className={styles.slotsWrapper}>
        {allSlots.length === 0 && (
          <p className={styles.empty}>No slots available</p>
        )}

        {allSlots.map((slot) => (
          <button
            key={slot.time}
            className={`${styles.slot} ${slot.status === "available"
                ? styles.available
                : styles.booked
              }`}
            disabled={slot.status === "booked"}
          >
            {slot.time}
          </button>
        ))}
      </div>

    </div>
  );
};

export default DoctorSlots;
