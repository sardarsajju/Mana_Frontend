// Kycdetails.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../Custom/Api_url";
import styles from "./Kycdetails.module.css";

const Kycdetails = () => {
  const location = useLocation();
  const nav = useNavigate();
  const { user_id } = location.state || {};

  const [kycStatus, setKycStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- GET KYC STATUS ---------------- */
  useEffect(() => {
    if (!user_id) return;

    axios
      .get(`${API_URL}/kyc/getkycdetails/${user_id}`)
      .then(res => setKycStatus(res.data.status))
      .catch(err => console.error(err));
  }, [user_id]);

  /* ---------------- VERIFY KYC ---------------- */
  const handleVerifyKyc = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/kyc/verifykycdetails/${user_id}`
      );
      alert(res.data.message);
      setKycStatus("VERIFIED");
    } catch (err) {
      console.error(err);
      alert("KYC verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user_id) {
    return (
      <div className={styles.page}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>User Not Found</h2>
          <p className={styles.errorText}>Unable to retrieve user information</p>
          <button onClick={() => nav(-1)} className={styles.primaryBtn}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Top Navigation */}
        <div className={styles.topNav}>
          <button onClick={() => nav(-1)} className={styles.backBtn}>
            <span className={styles.backArrow}>←</span>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          
          {/* Left Panel - User Info */}
          <div className={styles.leftPanel}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                <div className={styles.avatarCircle}>
                  <span className={styles.avatarIcon}>👤</span>
                </div>
                <div className={styles.statusDot}></div>
              </div>
              <h3 className={styles.userName}>User Account</h3>
              <p className={styles.userId}>ID: {user_id}</p>
              
              <div className={styles.divider}></div>
              
              <div className={styles.quickInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📋</span>
                  <div>
                    <p className={styles.infoLabel}>Account Type</p>
                    <p className={styles.infoValue}>Standard</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🔐</span>
                  <div>
                    <p className={styles.infoLabel}>Security</p>
                    <p className={styles.infoValue}>Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className={styles.helpCard}>
              <h4 className={styles.helpTitle}>Need Assistance?</h4>
              <p className={styles.helpText}>
                Contact our support team for help with KYC verification
              </p>
              <button className={styles.helpBtn}>Contact Support</button>
            </div>
          </div>

          {/* Right Panel - KYC Details */}
          <div className={styles.rightPanel}>
            <div className={styles.mainCard}>
              
              <div className={styles.cardHeader}>
                <div>
                  <h1 className={styles.mainTitle}>KYC Verification</h1>
                  <p className={styles.mainSubtitle}>Know Your Customer Status</p>
                </div>
                <div className={styles.headerBadge}>
                  <span className={styles.badgeIcon}>🛡️</span>
                </div>
              </div>

              {/* Status Section */}
              <div className={styles.statusSection}>
                <div className={styles.statusHeader}>
                  <h3 className={styles.sectionTitle}>Current Status</h3>
                  <div className={styles.statusTimestamp}>
                    Last updated: Today
                  </div>
                </div>

                <div
                  className={`${styles.statusCard} ${
                    kycStatus === "VERIFIED"
                      ? styles.statusVerified
                      : kycStatus === "PENDING"
                      ? styles.statusPending
                      : styles.statusUnknown
                  }`}
                >
                  <div className={styles.statusContent}>
                    <div className={styles.statusIconWrapper}>
                      {kycStatus === "VERIFIED" && <span className={styles.statusIcon}>✓</span>}
                      {kycStatus === "PENDING" && <span className={styles.statusIcon}>⏱</span>}
                      {!kycStatus && <span className={styles.statusIcon}>⟳</span>}
                    </div>
                    <div>
                      <p className={styles.statusText}>
                        {kycStatus || "Loading..."}
                      </p>
                      <p className={styles.statusDescription}>
                        {kycStatus === "VERIFIED" && "Account fully verified and active"}
                        {kycStatus === "PENDING" && "Verification pending approval"}
                        {!kycStatus && "Fetching verification status..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Boxes */}
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>📄</span>
                  <h4 className={styles.infoCardTitle}>Documents</h4>
                  <p className={styles.infoCardText}>
                    {kycStatus === "VERIFIED" ? "Verified" : "Required"}
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>🔍</span>
                  <h4 className={styles.infoCardTitle}>Review</h4>
                  <p className={styles.infoCardText}>
                    {kycStatus === "VERIFIED" ? "Complete" : "In Progress"}
                  </p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardIcon}>✅</span>
                  <h4 className={styles.infoCardTitle}>Approval</h4>
                  <p className={styles.infoCardText}>
                    {kycStatus === "VERIFIED" ? "Approved" : "Pending"}
                  </p>
                </div>
              </div>

              {/* Alert Box */}
              {kycStatus === "PENDING" && (
                <div className={styles.alertBox}>
                  <span className={styles.alertIcon}>💡</span>
                  <p className={styles.alertText}>
                    Your KYC verification is pending. Click the button below to complete the verification process.
                  </p>
                </div>
              )}

              {kycStatus === "VERIFIED" && (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>🎉</span>
                  <p className={styles.successText}>
                    Congratulations! Your account is fully verified and you have access to all banking services.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className={styles.actionSection}>
                <button
                  className={`${styles.actionBtn} ${
                    kycStatus === "VERIFIED" ? styles.actionBtnDisabled : styles.actionBtnActive
                  }`}
                  onClick={handleVerifyKyc}
                  disabled={kycStatus === "VERIFIED" || loading}
                >
                  {loading && (
                    <span className={styles.spinner}></span>
                  )}
                  <span>
                    {loading
                      ? "Processing Verification..."
                      : kycStatus === "VERIFIED"
                      ? "✓ KYC Verified"
                      : "Verify KYC Now"}
                  </span>
                  {!loading && kycStatus !== "VERIFIED" && (
                    <span className={styles.btnArrow}>→</span>
                  )}
                </button>
                
                {kycStatus !== "VERIFIED" && (
                  <p className={styles.actionNote}>
                    By clicking verify, you confirm that all provided information is accurate
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Kycdetails;