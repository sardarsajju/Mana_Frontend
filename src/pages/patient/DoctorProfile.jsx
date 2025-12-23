import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./DoctorProfile.module.css";

function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");


  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    axios
      .get(`http://localhost:5005/api/doctor/slots/${doctorId}/${selectedDate}`)
      .then((res) => {
        setAvailableSlots(res.data.availableSlots || []);
        setBookedSlots(res.data.bookedSlots || []);
        setSelectedSlot("");
      })
      .catch(() => {
        setAvailableSlots([]);
        setBookedSlots([]);
      });
  }, [doctorId, selectedDate]);

  // if (!appointmentDate) {
  //   return <p>Please select date first</p>;
  // }


  const getNextWorkingDays = (count = 7) => {
    const days = [];
    let offset = 0;

    while (days.length < count) {
      const date = new Date();
      date.setDate(date.getDate() + offset);

      const day = date.getDay(); // 0=Sun, 6=Sat
      if (day !== 0 && day !== 6) {
        days.push({
          label: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "2-digit",
            day: "2-digit",
          }),
          value: date.toISOString().split("T")[0],
        });
      }
      offset++;
    }

    return days;
  };


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Slots</h2>
      <h2 className={styles.title}>Select Date & Time</h2>

      <p className={styles.subtitle}>
        Choose a convenient date and time slot
      </p>

      {selectedDate && (
        <p className={styles.subtitle}>
          Date: <strong>{selectedDate}</strong>
        </p>
      )}


      <div className={styles.daysRow}>
        {getNextWorkingDays().map((day) => (
          <button
            key={day.value}
            className={`${styles.dayBtn} ${selectedDate === day.value ? styles.active : ""
              }`}
            onClick={() => setSelectedDate(day.value)}
          >
            {day.label}
          </button>
        ))}
      </div>


      <div className={styles.slots}>
        {availableSlots.map((slot) => (
          <button
            key={slot}
            className={`${styles.slot} ${selectedSlot === slot ? styles.active : ""
              }`}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </button>
        ))}

        {bookedSlots.map((slot) => (
          <button
            key={slot}
            className={`${styles.slot} ${styles.booked}`}
            disabled
          >
            {slot}
          </button>
        ))}

        {availableSlots.length === 0 && bookedSlots.length === 0 && (
          <p>No slots available</p>
        )}
      </div>

      <button
        className={styles.bookBtn}
        disabled={!selectedSlot}
        onClick={() =>
          navigate("/patient/confirm", {
            state: {
              doctorId: doctorId,
              date: selectedDate,
              time: selectedSlot
            }
          })

        }
      >
        Continue
      </button>
    </div>
  );
}

export default DoctorProfile;
