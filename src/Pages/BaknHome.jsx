// import axios from "axios";
// import { useEffect, useState } from "react";
// import { API_URL } from "../Custom/Api_url";
// import styles from "./Bankhome.module.css";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// function Bankhome() {
//     const [bankuser, setbanker] = useState([]);

//     const Bank_id = localStorage.getItem("bankId");
//     const bankName = localStorage.getItem("bankName");
//     const nav = useNavigate();
//     console.log("Bank_id:", Bank_id);
//     useEffect(() => {
//         if (!Bank_id) return;

//         axios
//             .get(`${API_URL}/bank/getbankuserdetails/${Bank_id}`)
//             .then(res => setbanker(res.data))
//             .catch(error => console.log(error));
//     }, [Bank_id]);
//     console.log(bankuser);
//     const handelTranscation = () => {
//         nav('/Banktransactions', {
//            state:{
//              user_id: user_id
//            }
//         })
//     }
//     return (
//         <div className={styles.bankContainer}>
//             <header className={styles.header}>
//                 <h1>🏦 {bankName}</h1>
//                 {/* <p>Manage and view registered bank users</p> */}
//             </header>

//             <div className={styles.cardGrid}>
//                 {bankuser.length === 0 ? (
//                     <p>No users found for this bank</p>
//                 ) : (
//                     bankuser.map((item, index) => (
//                         <div className={styles.bankCard} key={index}>
//                             <div className={styles.cardHeader}>
//                                 <div className={styles.bankLogo}>
//                                     {item.Bank_Name.charAt(0)}
//                                 </div>
//                                 <h2 className={styles.bankName}>
//                                     {item.Bank_Name}
//                                 </h2>
//                             </div>

//                             <div className={styles.cardBody}>
//                                 <div className={styles.row}>
//                                     <span>Account Holder</span>
//                                     <strong>
//                                         {item.FirstName} {item.LastName}
//                                     </strong>
//                                 </div>

//                                 <div className={styles.row}>
//                                     <span>IFSC Code</span>
//                                     <strong>{item.IFSC_Code}</strong>
//                                 </div>

//                                 <div className={styles.row}>
//                                     <span>Branch Name</span>
//                                     <strong>{item.Branch_Name}</strong>
//                                 </div>
//                             </div>

//                             <button className={styles.viewBtn} onClick={handelTranscation}>
//                                 View Details
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Bankhome;


// import axios from "axios";
// import { useEffect, useState } from "react";
// import { API_URL } from "../Custom/Api_url";
// import styles from "./Bankhome.module.css";
// import { useNavigate } from "react-router-dom";

// function Bankhome() {
//     const [bankuser, setbanker] = useState([]);

//     const Bank_id = localStorage.getItem("bankId");
//     const bankName = localStorage.getItem("bankName");
//     const nav = useNavigate();

//     useEffect(() => {
//         if (!Bank_id) return;

//         axios
//             .get(`${API_URL}/bank/getbankuserdetails/${Bank_id}`)
//             .then(res => setbanker(res.data || []))
//             .catch(error => console.log(error));
//     }, [Bank_id]);

//     // ✅ Pass selected user's user_id
//     const handelTranscation = (user_id) => {
//         nav("/Banktransactions", {
//             state: { user_id }
//         });
//     };

//     const handlekyc = (user_id) => {
//         nav("/kyc", {
//             state: { user_id }
//         });
//     };

//     return (
//         <div className={styles.bankContainer}>
//             <header className={styles.header}>
//                 <h1>🏦 {bankName}</h1>
//             </header>

//             <div className={styles.cardGrid}>
//                 {bankuser.length === 0 ? (
//                     <p>No users found for this bank</p>
//                 ) : (
//                     bankuser.map((item, index) => (
//                         <div className={styles.bankCard} key={index}>
//                             <div className={styles.cardHeader}>
//                                 <div className={styles.bankLogo}>
//                                     {item.Bank_Name?.charAt(0)}
//                                 </div>
//                                 <h2 className={styles.bankName}>
//                                     {item.Bank_Name}
//                                 </h2>
//                             </div>

//                             <div className={styles.cardBody}>
//                                 <div className={styles.row}>
//                                     <span>Account Holder</span>
//                                     <strong>
//                                         {item.FirstName} {item.LastName}
//                                     </strong>
//                                 </div>

//                                 <div className={styles.row}>
//                                     <span>IFSC Code</span>
//                                     <strong>{item.IFSC_Code}</strong>
//                                 </div>

//                                 <div className={styles.row}>
//                                     <span>Branch Name</span>
//                                     <strong>{item.Branch_Name}</strong>
//                                 </div>
//                             </div>

//                             <button
//                                 className={styles.viewBtn}
//                                 onClick={() => handelTranscation(item.user_id)}
//                             >
//                                 View Transactions
//                             </button>
//                             <button
//                                 className={styles.viewBtn}
//                                 onClick={() => handlekyc(item.user_id)}
//                             >
//                                 View Kyc details
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Bankhome;



// Bankhome.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../Custom/Api_url";
import styles from "./Bankhome.module.css";
import { useNavigate } from "react-router-dom";

function Bankhome() {
    const [bankuser, setbanker] = useState([]);

    const Bank_id = localStorage.getItem("bankId");
    const bankName = localStorage.getItem("bankName");
    const nav = useNavigate();

    useEffect(() => {
        if (!Bank_id) return;

        axios
            .get(`${API_URL}/bank/getbankuserdetails/${Bank_id}`)
            .then(res => setbanker(res.data || []))
            .catch(error => console.log(error));
    }, [Bank_id]);

    // ✅ Pass selected user's user_id
    const handelTranscation = (user_id) => {
        nav("/Banktransactions", {
            state: { user_id }
        });
    };

    const handlekyc = (user_id) => {
        nav("/kyc", {
            state: { user_id }
        });
    };

    return (
        <div className={styles.bankContainer}>
            {/* Top Banner */}
            <div className={styles.topBanner}>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerLeft}>
                        <div className={styles.bankIcon}>🏦</div>
                        <div>
                            <h1 className={styles.mainTitle}>{bankName}</h1>
                            <p className={styles.subtitle}>Account Management Dashboard</p>
                        </div>
                    </div>
                    <div className={styles.bannerRight}>
                        <div className={styles.statCard}>
                            <span className={styles.statIcon}>👥</span>
                            <div>
                                <p className={styles.statValue}>{bankuser.length}</p>
                                <p className={styles.statLabel}>Total Accounts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.contentWrapper}>
                
                {bankuser.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📭</div>
                        <h3 className={styles.emptyTitle}>No Accounts Found</h3>
                        <p className={styles.emptyText}>
                            There are currently no user accounts registered with this bank.
                        </p>
                    </div>
                ) : (
                    <div className={styles.cardGrid}>
                        {bankuser.map((item, index) => (
                            <div className={styles.bankCard} key={index}>
                                
                                {/* Card Top Section */}
                                <div className={styles.cardTop}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.bankLogo}>
                                            {item.Bank_Name?.charAt(0)}
                                        </div>
                                        <div className={styles.bankInfo}>
                                            <h2 className={styles.bankName}>
                                                {item.Bank_Name}
                                            </h2>
                                            <span className={styles.accountBadge}>
                                                Personal Account
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.cardId}>#{index + 1}</div>
                                </div>

                                {/* Account Holder */}
                                <div className={styles.holderSection}>
                                    <div className={styles.avatarCircle}>
                                        {item.FirstName?.charAt(0)}{item.LastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={styles.holderLabel}>Account Holder</p>
                                        <h3 className={styles.holderName}>
                                            {item.FirstName} {item.LastName}
                                        </h3>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>🏢</span>
                                        <div>
                                            <p className={styles.detailLabel}>Branch</p>
                                            <p className={styles.detailValue}>
                                                {item.Branch_Name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>🔢</span>
                                        <div>
                                            <p className={styles.detailLabel}>IFSC Code</p>
                                            <p className={styles.detailValue}>
                                                {item.IFSC_Code}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles.actionButtons}>
                                    <button
                                        className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                        onClick={() => handelTranscation(item.user_id)}
                                    >
                                        <span className={styles.btnIcon}>💳</span>
                                        <span>Transactions</span>
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                        onClick={() => handlekyc(item.user_id)}
                                    >
                                        <span className={styles.btnIcon}>✓</span>
                                        <span>KYC Details</span>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bankhome;