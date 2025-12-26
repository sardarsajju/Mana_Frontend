import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./DoctorNotes.module.css";

function DoctorNotes() {
  const { appointmentId } = useParams();
  const user = useSelector(state => state.user);

  const isDoctor = user.role === "doctor";

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5005/api/notes/${appointmentId}`)
      .then(res => {
        if (res.data) {
          setDiagnosis(res.data.diagnosis || "");
          setPrescription(res.data.prescription || "");
          setAdvice(res.data.advice || "");
        }
      })
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const saveNotes = async () => {
    await axios.post("http://localhost:5005/api/notes/save", {
      appointment_id: appointmentId,
      diagnosis,
      prescription,
      advice,
      role: user.role // 🔑 IMPORTANT
    });

    alert("Notes saved successfully");

    navigate("/doctor");
  };

  if (loading) return <p>Loading notes...</p>;

  return (
    <div className={styles.container}>
      <h2>Doctor Notes</h2>

      <textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={e => setDiagnosis(e.target.value)}
        disabled={!isDoctor}
      />

      <textarea
        placeholder="Prescription"
        value={prescription}
        onChange={e => setPrescription(e.target.value)}
        disabled={!isDoctor}
      />

      <textarea
        placeholder="Advice"
        value={advice}
        onChange={e => setAdvice(e.target.value)}
        disabled={!isDoctor}
      />

      {isDoctor && (
        <button onClick={saveNotes}>Save Notes</button>
      )}
    </div>
  );
}

export default DoctorNotes;
