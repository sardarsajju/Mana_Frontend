import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./PatientHeader.module.css";

function PatientHeader() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setOpen(false);
    navigate("/");
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div
        className={styles.logo}
        onClick={() => navigate("/patient/dashboard")}
      >
        Hospital
      </div>

      {/* Right Section */}
      <div className={styles.right}>
        {/* Notifications */}
        <div
          className={styles.notification}
          onClick={() => navigate("/patient/notifications")}
        >
          🔔
        </div>

        {/* Profile */}
        <div className={styles.profile} ref={dropdownRef}>
          <div
            className={styles.avatar}
            onClick={() => setOpen((prev) => !prev)}
          >
            {user?.name?.charAt(0) || "P"}
          </div>

          {open && (
            <div className={styles.dropdown}>
              <p onClick={() => navigate("/patient/profile")}>
                👤 My Profile
              </p>
              <p onClick={() => navigate("/patient/appointments")}>
                📖 My Appointments
              </p>
              <p className={styles.logout} onClick={handleLogout}>
                🚪 Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PatientHeader;
