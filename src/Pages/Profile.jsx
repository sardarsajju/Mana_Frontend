// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../Custom/Api_url";
// import { useSelector } from "react-redux";
// import styles from "./ProfilePage.module.css";
// import {
//   User,
//   Mail,
//   Phone,
//   CreditCard,
//   Wallet,
//   Loader,
//   TrendingUp,
//   Shield,
//   Clock,
// } from "lucide-react";
// import boyimage from '../assets/boy.png'
// import { useNavigate } from "react-router-dom";

// export default function ProfilePage() {
//   const { user } = useSelector((state) => state.login);
//   const user_id = user?.user_id;

//   const [profile, setProfile] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const [showPinPopup, setShowPinPopup] = useState(false);
//   const [pin, setPin] = useState("");
//   const [pinVerified, setPinVerified] = useState(false);
//   const [pinError, setPinError] = useState("");
//   const STATIC_PIN = "1234";

//   useEffect(() => {
//     async function getProfile() {
//       try {
//         const res = await axios.get(`${API_URL}/getuserdetails/${user_id}`);
//         setProfile(res.data);
//       } catch (error) {
//         console.log("Error fetching profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (user_id) getProfile();
//     else setLoading(false);
//   }, [user_id]);

//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <Loader className={styles.spinner} size={48} />
//         <h2 className={styles.loadingText}>Loading Profile...</h2>
//       </div>
//     );
//   }

//   if (!profile || profile.length === 0) {
//     return (
//       <div className={styles.emptyContainer}>
//         <User size={64} className={styles.emptyIcon} />
//         <h2 className={styles.emptyText}>No Profile Found</h2>
//       </div>
//     );
//   }

//   const verifyPin = () => {
//     if (pin === STATIC_PIN) {
//       setPinVerified(true);
//       setShowPinPopup(false);
//       setPin("");
//       setPinError("");
//     } else {
//       setPinError("Incorrect PIN");
//     }
//   };
//   const hadnlelogout = () => {
//     navigate('/')
//   }
//   return (
//     <div className={styles.container}>
//       <div className={styles.wrapper}>
//         {profile.map((p) => (
//           <div key={p.user_id}>
//             <div className={styles.pageHeader}>
//               <div>
//                 <h1 className={styles.pageTitle}>My Profile</h1>
//                 <p className={styles.pageSubtitle}>
//                   Manage your account information
//                 </p>
//               </div>
//             </div>

//             <div className={styles.gridContainer}>
//               <div className={styles.leftColumn}>
//                 <div className={styles.profileCard}>
//                   <div className={styles.avatarCircle}>
//                     <img src={boyimage} alt="User Avatar" />
//                   </div>

//                   <h2 className={styles.userName}>
//                     {p.FirstName} {p.LastName}
//                   </h2>
//                   <p className={styles.userEmail}>{p.Email}</p>
//                   <div className={styles.userMeta}>
//                     <Phone size={16} />
//                     <span>{p.MobileNumber}</span>
//                   </div>
//                 </div>

//                 <div className={styles.balanceCard}>
//                   <div className={styles.balanceHeader}>
//                     <Wallet size={24} />
//                     <span>Total Balance</span>
//                   </div>

//                   {!pinVerified ? (
//                     <>
//                       <div className={styles.balanceAmountMasked}>••••••</div>
//                       <button
//                         className={styles.pinButton}
//                         onClick={() => {
//                           setShowPinPopup(true);
//                           setPin("");
//                           setPinError("");
//                         }}
//                       >
//                         Show Balance
//                       </button>
//                     </>
//                   ) : (
//                     <div className={styles.balanceAmount}>₹ {p.TotalAmount}</div>
//                   )}

//                   {/* <div className={styles.balanceFooter}>Secure Balance</div> */}
//                 </div>

//                 <div className={styles.statsGrid}>
//                   <div className={styles.statCard}>
//                     <div className={styles.statIcon}>
//                       <TrendingUp size={20} />
//                     </div>
//                     <div className={styles.statLabel}>Active</div>
//                     <div className={styles.statValue}>Account</div>
//                   </div>

//                   <div className={styles.statCard}>
//                     <div className={styles.statIconGreen}>
//                       <Shield size={20} />
//                     </div>
//                     <div className={styles.statLabel}>Verified</div>
//                     <div className={styles.statValue}>User</div>
//                   </div>

//                   <div className={styles.statCard}>
//                     <div className={styles.statIconPurple}>
//                       <Clock size={20} />
//                     </div>
//                     <div className={styles.statLabel}>24/7</div>
//                     <div className={styles.statValue}>Support</div>
//                   </div>
//                 </div>
//               </div>

//               <div className={styles.rightColumn}>
//                 <div className={styles.detailsCard}>
//                   <h3 className={styles.cardTitle}>Account Details</h3>

//                   <div className={styles.detailsGrid}>
//                     <div className={styles.detailItem}>
//                       <div className={styles.detailIcon}>
//                         <User size={20} />
//                       </div>
//                       <div className={styles.detailContent}>
//                         <label className={styles.detailLabel}>Full Name</label>
//                         <p className={styles.detailValue}>
//                           {p.FirstName} {p.LastName}
//                         </p>
//                       </div>
//                     </div>

//                     <div className={styles.detailItem}>
//                       <div className={styles.detailIcon}>
//                         <Mail size={20} />
//                       </div>
//                       <div className={styles.detailContent}>
//                         <label className={styles.detailLabel}>Email Address</label>
//                         <p className={styles.detailValue}>{p.Email}</p>
//                       </div>
//                     </div>

//                     <div className={styles.detailItem}>
//                       <div className={styles.detailIcon}>
//                         <Phone size={20} />
//                       </div>
//                       <div className={styles.detailContent}>
//                         <label className={styles.detailLabel}>Mobile Number</label>
//                         <p className={styles.detailValue}>{p.MobileNumber}</p>
//                       </div>
//                     </div>

//                     <div className={styles.detailItem}>
//                       <div className={styles.detailIcon}>
//                         <CreditCard size={20} />
//                       </div>
//                       <div className={styles.detailContent}>
//                         <label className={styles.detailLabel}>Account Number</label>
//                         <p className={styles.detailValue}>{p.account_number}</p>
//                       </div>
//                       <div className={styles.detailContent}>
//                         <label className={styles.detailLabel}>BankName</label>
//                         <p className={styles.detailValue}>{p.Bank_Name}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showPinPopup && (
//         <div className={styles.pinPopupOverlay}>
//           <div className={styles.pinPopupBox}>
//             <h2>Enter Secure PIN</h2>

//             <input
//               type="password"
//               maxLength={6}
//               value={pin}
//               onChange={(e) => setPin(e.target.value)}
//               className={styles.pinInput}
//               placeholder="Enter PIN"
//             />

//             {pinError && <p className={styles.pinError}>{pinError}</p>}

//             <div className={styles.pinButtonRow}>
//               <button className={styles.verifyButton} onClick={verifyPin}>
//                 Verify
//               </button>
//               <button
//                 className={styles.cancelButton}
//                 onClick={() => {
//                   setShowPinPopup(false);
//                   setPin("");
//                   setPinError("");
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <button
//         onClick={hadnlelogout}
//         className={styles.logoutButton}
//       >
//         Logout
//       </button>

//     </div>
//   );
// }


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
  Shield,
  LogOut,
  Eye,
  EyeOff,
  ChevronRight,
  Building2,
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
        <h2 className={styles.loadingText}>Loading your profile...</h2>
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
      setPinError("Incorrect PIN. Please try again.");
    }
  };
  
  const hadnlelogout = () => {
    navigate('/')
  }
  
  return (
    <div className={styles.pageContainer}>
      {profile.map((p) => (
        <div key={p.user_id}>


          <div className={styles.welcomeBanner}>
            <div className={styles.bannerContent}>
              <div className={styles.welcomeText}>
                <h1 className={styles.welcomeTitle}>Welcome, {p.FirstName}</h1>
                <p className={styles.welcomeSubtitle}>Account Overview</p>
              </div>
              <div className={styles.profileAvatar}>
                <img src={boyimage} alt="Profile" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.contentWrapper}>
              
              {/* Account Balance Section */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <Wallet size={20} />
                    <h2>Account Balance</h2>
                  </div>
                </div>
                <div className={styles.balanceDisplay}>
                  {!pinVerified ? (
                    <>
                      <div className={styles.balanceHidden}>
                        <span className={styles.currencySymbol}>₹</span>
                        <span className={styles.hiddenAmount}>********</span>
                      </div>
                      <button
                        className={styles.viewBalanceBtn}
                        onClick={() => {
                          setShowPinPopup(true);
                          setPin("");
                          setPinError("");
                        }}
                      >
                        <Eye size={16} />
                        View Balance
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.balanceVisible}>
                        <span className={styles.currencySymbol}>₹</span>
                        <span className={styles.amount}>{p.TotalAmount}</span>
                      </div>
                      <button
                        className={styles.hideBalanceBtn}
                        onClick={() => setPinVerified(false)}
                      >
                        <EyeOff size={16} />
                        Hide Balance
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <User size={20} />
                    <h2>Personal Information</h2>
                  </div>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Full Name</label>
                    <p>{p.FirstName} {p.LastName}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Email Address</label>
                    <p>{p.Email}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Mobile Number</label>
                    <p>{p.MobileNumber}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Account Status</label>
                    <p className={styles.statusActive}>
                      <span className={styles.statusDot}></span>
                      Active
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <CreditCard size={20} />
                    <h2>Bank Account Details</h2>
                  </div>
                </div>
                <div className={styles.bankDetailsWrapper}>
                  <div className={styles.bankDetailItem}>
                    <label>Account Number</label>
                    <p className={styles.accountNumber}>{p.account_number}</p>
                  </div>
                  <div className={styles.bankDetailItem}>
                    <label>Bank Name</label>
                    <p>{p.Bank_Name}</p>
                  </div>
                  <div className={styles.bankDetailItem}>
                    <label>Account Type</label>
                    <p>Savings Account</p>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className={styles.securityCard}>
                <div className={styles.securityContent}>
                  <Shield size={24} className={styles.securityIcon} />
                  <div className={styles.securityText}>
                    <h3>Account Security</h3>
                    <p>Your account is protected with advanced security measures</p>
                  </div>
                  <div className={styles.verifiedBadge}>
                    <Shield size={16} />
                    Verified
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* PIN Verification Modal */}
      {showPinPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <Shield size={32} className={styles.modalIcon} />
              <h2>Verify Your Identity</h2>
              <p>Please enter your 4-digit security PIN</p>
            </div>

            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={styles.pinInput}
              placeholder="Enter PIN"
            />

            {pinError && (
              <div className={styles.errorMessage}>
                {pinError}
              </div>
            )}

            <div className={styles.modalActions}>
              <button 
                className={styles.btnSecondary} 
                onClick={() => {
                  setShowPinPopup(false);
                  setPin("");
                  setPinError("");
                }}
              >
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={verifyPin}>
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}