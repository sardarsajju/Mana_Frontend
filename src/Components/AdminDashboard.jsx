import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // 🔐 Ensure organization is selected
  useEffect(() => {
    const orgId = localStorage.getItem("org_id");
    if (!orgId) {
      navigate("/admin/select-organization");
    }
  }, [navigate]);

  const orgName = localStorage.getItem("org_name");
  const userRole = localStorage.getItem("user_role") || "admin"; // Default to admin
  const isEmployee = userRole === "employee";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>

        <h1>{isEmployee ? "Employee Dashboard" : "Admin Dashboard"}</h1>
        <p>
          {isEmployee
            ? "Access team portal and collaboration tools"
            : "Manage your projects and team assignments"}
        </p>

        {/* Selected Organization */}
        {orgName && (
          <p style={{ marginTop: "6px", fontWeight: "500" }}>
            Organization: <strong>{orgName}</strong>
            {isEmployee && (
              <span className={styles.roleBadge}>Employee Access</span>
            )}
          </p>
        )}
      </div>

      {/* Cards */}
      <div className={styles.cardBox}>
        {/* ✅ Give Access to Employees */}
        <div
          className={`${styles.card} ${isEmployee ? styles.disabled : ""}`}
          onClick={() => !isEmployee && navigate("/admin/manage-access")}
        >
          {isEmployee && <div className={styles.lockOverlay}>🔒</div>}
          <div className={styles.cardIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
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
          <div className={styles.cardContent}>
            <h3>Check the status of Employees</h3>
            <p>
              {isEmployee
                ? "Admin access required"
                : "Manage user access and permissions"}
            </p>
          </div>
        </div>

        {/* Create Project */}
        <div
          className={`${styles.card} ${isEmployee ? styles.disabled : ""}`}
          onClick={() => !isEmployee && navigate("/admin/create-project")}
        >
          {isEmployee && <div className={styles.lockOverlay}>🔒</div>}
          <div className={styles.cardIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </div>
          <div className={styles.cardContent}>
            <h3>Create Project</h3>
            <p>
              {isEmployee
                ? "Admin access required"
                : "Add new projects to this organization"}
            </p>
          </div>
        </div>

        {/* Assign Project */}
        <div
          className={`${styles.card} ${isEmployee ? styles.disabled : ""}`}
          onClick={() => !isEmployee && navigate("/admin/assign-project")}
        >
          {isEmployee && <div className={styles.lockOverlay}>🔒</div>}
          <div className={styles.cardIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className={styles.cardContent}>
            <h3>Assign Project</h3>
            <p>
              {isEmployee
                ? "Admin access required"
                : "Assign projects to testers & developers"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;