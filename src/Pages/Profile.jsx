import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../Custom/Api_url";
import { useSelector } from "react-redux";
import styles from "./ProfilePage.module.css";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Wallet,
  Loader,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import boyimage from '../assets/boy.png'
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.login);
  const user_id = user?.user_id;

  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showPinPopup, setShowPinPopup] = useState(false);
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState("");
  const STATIC_PIN = "1234";

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(`${API_URL}/getuserdetails/${user_id}`);
        setProfile(res.data);
      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user_id) getProfile();
    else setLoading(false);
  }, [user_id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} size={48} />
        <h2 className={styles.loadingText}>Loading Profile...</h2>
      </div>
    );
  }

  if (!profile || profile.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <User size={64} className={styles.emptyIcon} />
        <h2 className={styles.emptyText}>No Profile Found</h2>
      </div>
    );
  }

  const verifyPin = () => {
    if (pin === STATIC_PIN) {
      setPinVerified(true);
      setShowPinPopup(false);
      setPin("");
      setPinError("");
    } else {
      setPinError("Incorrect PIN");
    }
  };
  const hadnlelogout = () => {
    navigate('/')
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {profile.map((p) => (
          <div key={p.user_id}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>My Profile</h1>
                <p className={styles.pageSubtitle}>
                  Manage your account information
                </p>
              </div>
            </div>

            <div className={styles.gridContainer}>
              <div className={styles.leftColumn}>
                <div className={styles.profileCard}>
                  <div className={styles.avatarCircle}>
                    <img src={boyimage} alt="User Avatar" />
                  </div>

                  <h2 className={styles.userName}>
                    {p.FirstName} {p.LastName}
                  </h2>
                  <p className={styles.userEmail}>{p.Email}</p>
                  <div className={styles.userMeta}>
                    <Phone size={16} />
                    <span>{p.MobileNumber}</span>
                  </div>
                </div>

                <div className={styles.balanceCard}>
                  <div className={styles.balanceHeader}>
                    <Wallet size={24} />
                    <span>Total Balance</span>
                  </div>

                  {!pinVerified ? (
                    <>
                      <div className={styles.balanceAmountMasked}>••••••</div>
                      <button
                        className={styles.pinButton}
                        onClick={() => {
                          setShowPinPopup(true);
                          setPin("");
                          setPinError("");
                        }}
                      >
                        Show Balance
                      </button>
                    </>
                  ) : (
                    <div className={styles.balanceAmount}>₹ {p.TotalAmount}</div>
                  )}

                  {/* <div className={styles.balanceFooter}>Secure Balance</div> */}
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <TrendingUp size={20} />
                    </div>
                    <div className={styles.statLabel}>Active</div>
                    <div className={styles.statValue}>Account</div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIconGreen}>
                      <Shield size={20} />
                    </div>
                    <div className={styles.statLabel}>Verified</div>
                    <div className={styles.statValue}>User</div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIconPurple}>
                      <Clock size={20} />
                    </div>
                    <div className={styles.statLabel}>24/7</div>
                    <div className={styles.statValue}>Support</div>
                  </div>
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.detailsCard}>
                  <h3 className={styles.cardTitle}>Account Details</h3>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <User size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <label className={styles.detailLabel}>Full Name</label>
                        <p className={styles.detailValue}>
                          {p.FirstName} {p.LastName}
                        </p>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <Mail size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <label className={styles.detailLabel}>Email Address</label>
                        <p className={styles.detailValue}>{p.Email}</p>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <Phone size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <label className={styles.detailLabel}>Mobile Number</label>
                        <p className={styles.detailValue}>{p.MobileNumber}</p>
                      </div>
                    </div>

                    <div className={styles.detailItem}>
                      <div className={styles.detailIcon}>
                        <CreditCard size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <label className={styles.detailLabel}>Account Number</label>
                        <p className={styles.detailValue}>{p.account_number}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPinPopup && (
        <div className={styles.pinPopupOverlay}>
          <div className={styles.pinPopupBox}>
            <h2>Enter Secure PIN</h2>

            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={styles.pinInput}
              placeholder="Enter PIN"
            />

            {pinError && <p className={styles.pinError}>{pinError}</p>}

            <div className={styles.pinButtonRow}>
              <button className={styles.verifyButton} onClick={verifyPin}>
                Verify
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowPinPopup(false);
                  setPin("");
                  setPinError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={hadnlelogout}
        className={styles.logoutButton}
      >
        Logout
      </button>

    </div>
  );
}
