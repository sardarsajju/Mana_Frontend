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

    return (
        <div className={styles.bankContainer}>
            <header className={styles.header}>
                <h1>🏦 {bankName}</h1>
            </header>

            <div className={styles.cardGrid}>
                {bankuser.length === 0 ? (
                    <p>No users found for this bank</p>
                ) : (
                    bankuser.map((item, index) => (
                        <div className={styles.bankCard} key={index}>
                            <div className={styles.cardHeader}>
                                <div className={styles.bankLogo}>
                                    {item.Bank_Name?.charAt(0)}
                                </div>
                                <h2 className={styles.bankName}>
                                    {item.Bank_Name}
                                </h2>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.row}>
                                    <span>Account Holder</span>
                                    <strong>
                                        {item.FirstName} {item.LastName}
                                    </strong>
                                </div>

                                <div className={styles.row}>
                                    <span>IFSC Code</span>
                                    <strong>{item.IFSC_Code}</strong>
                                </div>

                                <div className={styles.row}>
                                    <span>Branch Name</span>
                                    <strong>{item.Branch_Name}</strong>
                                </div>
                            </div>

                            <button
                                className={styles.viewBtn}
                                onClick={() => handelTranscation(item.user_id)}
                            >
                                View Transactions
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Bankhome;
