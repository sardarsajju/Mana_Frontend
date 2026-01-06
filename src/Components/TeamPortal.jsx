// src/pages/Admin/TeamPortal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TeamPortal.module.css";

function TeamPortal() {
  const navigate = useNavigate();
  const orgId = localStorage.getItem("org_id");
  const orgName = localStorage.getItem("org_name");

  console.log("dfsd",orgId);
  
  const handleTeamRegister = () => {
    // Pass org_id to register page
    navigate(`/user/register?org_id=${orgId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Team Member Portal</h1>
        <p>Manage tester and developer accounts</p>
        {orgName && (
          <div className={styles.orgBadge}>
            Organization: <strong>{orgName}</strong>
          </div>
        )}
      </div>

      <div className={styles.portalCards}>
        {/* Team Register */}
        <div className={styles.portalCard}>
          <div className={styles.cardIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
          </div>
          <h2>Create Team Account</h2>
          <p>Register new testers and developers</p>
          <ul className={styles.featureList}>
            <li>✓ Quick registration process</li>
            <li>✓ Role-based access control</li>
            <li>✓ Instant account activation</li>
            <li>✓ Secure authentication</li>
          </ul>
          <button
            className={styles.secondaryBtn}
            onClick={handleTeamRegister}
          >
            Create Team Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamPortal;