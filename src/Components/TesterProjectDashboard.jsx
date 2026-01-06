import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TesterProjectDashboard.module.css";

function TesterProjectDashboard() {
  const { project_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2>Project Dashboard</h2>

      <button
        className={styles.raiseBtn}
        onClick={() =>
          navigate(`/raise-bug/${project_id}`)
        }
      >
        Raise Bug
      </button>
    </div>
  );
}

export default TesterProjectDashboard;
