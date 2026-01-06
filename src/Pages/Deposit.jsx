// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { API_URL } from "../Custom/Api_url";
// import styles from "./Deposit.module.css";

// function Deposit() {
//   const user = useSelector((state) => state.login.user);
//   const user_id = user?.user_id;
//   localStorage.getItem("user_id");

//   const [activeTab, setActiveTab] = useState("friends");
//   const [friends, setFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);

//   const [friendData, setFriendData] = useState({
//     user_id,
//     Name: "",
//     Bank_name: "",
//     friend_AccountNumber: "",
//     friend_user_id: ""
//   });

//   const [transferData, setTransferData] = useState({
//     account_number: "",
//     amount: ""
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [bank, setbank] = useState([]);


//   const handleFriendChange = (e) => {
//     setFriendData({ ...friendData, [e.target.name]: e.target.value });
//   };

//   const handleAddFriend = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/friend/addfriend`, friendData);
//       setMessage("Friend added successfully");
//       setActiveTab("friends");
//       setFriendData({
//         user_id,
//         Name: "",
//         Bank_name: "",
//         friend_AccountNumber: "",
//         friend_user_id: ""
//       });
//       const res = await axios.get(`${API_URL}/friend/getfriendlist/${user_id}`);
//       setFriends(res.data);
//       setTimeout(() => setMessage(""), 3000);
//     } catch {
//       setError("Failed to add friend");
//       setError("Friend Already Exists");
//       setTimeout(() => setError(""), 3000);
//     }
//   };

//   const handleSelectFriend = (friend) => {
//     setSelectedFriend(friend);
//     setTransferData({
//       account_number: friend.friend_AccountNumber,
//       amount: ""
//     });
//     setActiveTab("transfer");
//   };

//   const handleTransferChange = (e) => {
//     setTransferData({ ...transferData, amount: e.target.value });
//   };

//   const handleTransferMoney = async (e) => {
//     e.preventDefault();

//     if (!transferData.account_number || !transferData.amount) {
//       setError("Please enter amount");
//       setTimeout(() => setError(""), 3000);
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${API_URL}/transfer/transfermoney`,
//         {
//           sender_id: user_id,
//           receiver_account: transferData.account_number,
//           amount: transferData.amount
//         }
//       );

//       setMessage(res.data.message);
//       setError("");
//       setShowPopup(true);
//       setActiveTab("friends");
//       setTransferData({ account_number: "", amount: "" });
//       setSelectedFriend(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Transfer failed");
//       setTimeout(() => setError(""), 3000);
//     }
//   };
//   // useEffect(() => {
//   //   axios
//   //     .get(`${API_URL}/bank/getbankdetails`)
//   //     .then((res) => {
//   //       setbank(res.data);
//   //       console.log(res.data);
//   //     })
//   //     .catch((err) => console.log(err));
//   // }, []);
//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>💸 Money Transfer</h1>
//         <p className={styles.subtitle}>Manage your friends and send money easily</p>
//       </div>

//       <div className={styles.tabContainer}>
//         <button
//           className={`${styles.tab} ${activeTab === "friends" ? styles.activeTab : ""}`}
//           onClick={() => setActiveTab("friends")}
//         >
//           👥 Friends
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === "addFriend" ? styles.activeTab : ""}`}
//           onClick={() => setActiveTab("addFriend")}
//         >
//           ➕ Add Friend
//         </button>
//         {selectedFriend && (
//           <button
//             className={`${styles.tab} ${activeTab === "transfer" ? styles.activeTab : ""}`}
//             onClick={() => setActiveTab("transfer")}
//           >
//             💰 Send Money
//           </button>
//         )}
//       </div>

//       <div className={styles.content}>
//         {activeTab === "friends" && (
//           <div>
//             {friends.length === 0 ? (
//               <div className={styles.emptyState}>
//                 <div className={styles.emptyIcon}>👤</div>
//                 <h3 className={styles.emptyTitle}>No Friends Added Yet</h3>
//                 <p className={styles.emptyText}>
//                   Add your first friend to start sending money
//                 </p>
//                 <button
//                   className={styles.primaryBtn}
//                   onClick={() => setActiveTab("addFriend")}
//                 >
//                   Add Friend Now
//                 </button>
//               </div>
//             ) : (
//               <div className={styles.cardGrid}>
//                 {friends.map((friend) => (
//                   <div
//                     key={friend.id}
//                     className={styles.friendCard}
//                     onClick={() => handleSelectFriend(friend)}
//                   >
//                     <div className={styles.cardHeader}>
//                       <div className={styles.avatar}>
//                         {friend.Name.charAt(0).toUpperCase()}
//                       </div>
//                       <div className={styles.cardInfo}>
//                         <h3 className={styles.friendName}>{friend.Name}</h3>
//                         <p className={styles.bankName}>Bank_name: {friend.Bank_name}</p>
//                       </div>
//                     </div>
//                     <div className={styles.cardFooter}>
//                       <span className={styles.accountLabel}>AccountNumber:</span>
//                       <span className={styles.accountNumber}>
//                         {friend.friend_AccountNumber}
//                       </span>
//                     </div>
//                     <div className={styles.cardAction}>
//                       <span className={styles.sendMoneyText}>
//                         Click to send money →
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "addFriend" && (
//           <form className={styles.form} onSubmit={handleAddFriend}>
//             <h2 className={styles.formTitle}>Add New Friend</h2>
//             {/* <select
//               className={styles.input}
//               value={friendData.Bank_name}
//               onChange={(e) =>
//                 setFriendData({ ...friendData, Bank_name: e.target.value })
//               }
//               required
//             >
//               <option value="">Select Bank</option>

//               {bank.map((b) => (
//                 <option key={b.id} value={b.Bank_name}>
//                   {b.Bank_Name}
//                 </option>
//               ))}
//             </select> */}


//             <div className={styles.inputGroup}>
//               <label className={styles.label}>Friend Name</label>
//               <input
//                 name="Name"
//                 placeholder="Enter friend's name"
//                 value={friendData.Name}
//                 onChange={handleFriendChange}
//                 className={styles.input}
//                 required
//               />
//             </div>

//             <div className={styles.inputGroup}>
//               <label className={styles.label}>Bank Name</label>
//               <input
//                 name="Bank_name"
//                 placeholder="Enter bank name"
//                 value={friendData.Bank_name}
//                 onChange={handleFriendChange}
//                 className={styles.input}
//                 required
//               />
//             </div>

//             <div className={styles.inputGroup}>
//               <label className={styles.label}>Account Number</label>
//               <input
//                 name="friend_AccountNumber"
//                 placeholder="Enter account number"
//                 value={friendData.friend_AccountNumber}
//                 onChange={handleFriendChange}
//                 className={styles.input}
//                 required
//               />
//             </div>

//             <div className={styles.inputGroup}>
//               <label className={styles.label}>IFSC_Code</label>
//               <input
//                 name="friend_user_id"
//                 placeholder="Enter user ID if available"
//                 value={friendData.friend_user_id}
//                 onChange={handleFriendChange}
//                 className={styles.input}
//               />
//             </div>

//             <div className={styles.btnRow}>
//               <button type="submit" className={styles.primaryBtn}>
//                 💾 Save Friend
//               </button>
//               <button
//                 type="button"
//                 className={styles.cancelBtn}
//                 onClick={() => setActiveTab("friends")}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {activeTab === "transfer" && selectedFriend && (
//           <form className={styles.form} onSubmit={handleTransferMoney}>
//             <h2 className={styles.formTitle}>Send Money</h2>

//             <div className={styles.recipientCard}>
//               <div className={styles.recipientAvatar}>
//                 {selectedFriend.Name.charAt(0).toUpperCase()}
//               </div>
//               <div>
//                 <h3 className={styles.recipientName}>{selectedFriend.Name}</h3>
//                 <p className={styles.recipientBank}>{selectedFriend.Bank_name}</p>
//               </div>
//             </div>

//             <div className={styles.inputGroup}>
//               <label className={styles.label}>Receiver Account Number</label>
//               <input
//                 type="text"
//                 value={transferData.account_number}
//                 className={styles.inputReadonly}
//                 readOnly
//               />
//             </div>

//             <div className={styles.inputGroup}>
//               <label className={styles.label}>Amount ($)</label>
//               <input
//                 type="number"
//                 value={transferData.amount}
//                 onChange={handleTransferChange}
//                 className={styles.input}
//                 placeholder="Enter amount to send"
//                 required
//                 min="1"
//                 step="0.01"
//               />
//             </div>

//             <div className={styles.btnRow}>
//               <button type="submit" className={styles.primaryBtn}>
//                 💸 Send Money
//               </button>
//               <button
//                 type="button"
//                 className={styles.cancelBtn}
//                 onClick={() => {
//                   setActiveTab("friends");
//                   setSelectedFriend(null);
//                   setTransferData({ account_number: "", amount: "" });
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       {showPopup && (
//         <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
//           <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
//             <div className={styles.successIcon}>✅</div>
//             <h2 className={styles.popupTitle}>Transfer Successful!</h2>
//             <p className={styles.popupText}>
//               Your money has been transferred successfully.
//             </p>
//             <button
//               className={styles.primaryBtn}
//               onClick={() => setShowPopup(false)}
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       )}

//       {message && (
//         <div className={styles.successMessage}>
//           ✓ {message}
//         </div>
//       )}
//       {error && (
//         <div className={styles.errorMessage}>
//           ✗ {error}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Deposit;



// // import axios from "axios";
// // import { useEffect, useState } from "react";
// // import { useSelector } from "react-redux";
// // import { API_URL } from "../Custom/Api_url";
// // import styles from "./Deposit.module.css";

// // function Deposit() {
// //   const user = useSelector((state) => state.login.user);
// //   const user_id = user?.user_id;

// //   const userBankName = localStorage.getItem("userBankName");

// //   const [activeTab, setActiveTab] = useState("friends");
// //   const [friends, setFriends] = useState([]);
// //   const [selectedFriend, setSelectedFriend] = useState(null);

// //   const [friendData, setFriendData] = useState({
// //     user_id,
// //     Name: "",
// //     Bank_name: "",
// //     friend_AccountNumber: "",
// //     friend_user_id: ""
// //   });

// //   const [transferData, setTransferData] = useState({
// //     account_number: "",
// //     amount: ""
// //   });

// //   const [transferType, setTransferType] = useState("");
// //   const [charge, setCharge] = useState(0);

// //   const [message, setMessage] = useState("");
// //   const [error, setError] = useState("");
// //   const [showPopup, setShowPopup] = useState(false);

// //   // Fetch friends
// //   useEffect(() => {
// //     if (!user_id) return;

// //     axios
// //       .get(`${API_URL}/friend/getfriendlist/${user_id}`)
// //       .then((res) => setFriends(res.data))
// //       .catch(() => console.log("Failed to fetch friends"));
// //   }, [user_id]);

// //   const handleFriendChange = (e) => {
// //     setFriendData({ ...friendData, [e.target.name]: e.target.value });
// //   };

// //   const handleAddFriend = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`${API_URL}/friend/addfriend`, friendData);
// //       setMessage("Friend added successfully");
// //       setActiveTab("friends");

// //       setFriendData({
// //         user_id,
// //         Name: "",
// //         Bank_name: "",
// //         friend_AccountNumber: "",
// //         friend_user_id: ""
// //       });

// //       const res = await axios.get(
// //         `${API_URL}/friend/getfriendlist/${user_id}`
// //       );
// //       setFriends(res.data);

// //       setTimeout(() => setMessage(""), 3000);
// //     } catch {
// //       setError("Friend already exists");
// //       setTimeout(() => setError(""), 3000);
// //     }
// //   };

// //   // ✅ Detect Same Bank / Other Bank
// //   const handleSelectFriend = (friend) => {
// //     setSelectedFriend(friend);

// //     const isSameBank = friend.Bank_name === userBankName;

// //     setTransferType(isSameBank ? "SAME_BANK" : "OTHER_BANK");
// //     setCharge(isSameBank ? 0 : 5); // ₹5 / $5 example charge

// //     setTransferData({
// //       account_number: friend.friend_AccountNumber,
// //       amount: ""
// //     });

// //     setActiveTab("transfer");
// //   };

// //   const handleTransferChange = (e) => {
// //     setTransferData({ ...transferData, amount: e.target.value });
// //   };

// //   const handleTransferMoney = async (e) => {
// //     e.preventDefault();

// //     if (!transferData.amount) {
// //       setError("Please enter amount");
// //       return;
// //     }

// //     try {
// //       const res = await axios.post(
// //         `${API_URL}/transfer/transfermoney`,
// //         {
// //           sender_id: user_id,
// //           receiver_account: transferData.account_number,
// //           amount: transferData.amount,
// //           transfer_type: transferType,
// //           charge
// //         }
// //       );

// //       setMessage(res.data.message);
// //       setShowPopup(true);
// //       setActiveTab("friends");

// //       setSelectedFriend(null);
// //       setTransferData({ account_number: "", amount: "" });

// //     } catch (err) {
// //       setError(err.response?.data?.message || "Transfer failed");
// //       setTimeout(() => setError(""), 3000);
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.header}>
// //         <h1 className={styles.title}>💸 Money Transfer</h1>
// //         <p className={styles.subtitle}>
// //           Send money within bank or to other banks
// //         </p>
// //       </div>

// //       {/* Tabs */}
// //       <div className={styles.tabContainer}>
// //         <button
// //           className={`${styles.tab} ${
// //             activeTab === "friends" ? styles.activeTab : ""
// //           }`}
// //           onClick={() => setActiveTab("friends")}
// //         >
// //           👥 Friends
// //         </button>
// //         <button
// //           className={`${styles.tab} ${
// //             activeTab === "addFriend" ? styles.activeTab : ""
// //           }`}
// //           onClick={() => setActiveTab("addFriend")}
// //         >
// //           ➕ Add Friend
// //         </button>
// //         {selectedFriend && (
// //           <button
// //             className={`${styles.tab} ${
// //               activeTab === "transfer" ? styles.activeTab : ""
// //             }`}
// //           >
// //             💰 Send Money
// //           </button>
// //         )}
// //       </div>

// //       <div className={styles.content}>
// //         {/* FRIEND LIST */}
// //         {activeTab === "friends" && (
// //           <div className={styles.cardGrid}>
// //             {friends.map((friend) => (
// //               <div
// //                 key={friend.id}
// //                 className={styles.friendCard}
// //                 onClick={() => handleSelectFriend(friend)}
// //               >
// //                 <h3>{friend.Name}</h3>
// //                 <p>{friend.Bank_name}</p>
// //                 <small>{friend.friend_AccountNumber}</small>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* ADD FRIEND */}
// //         {activeTab === "addFriend" && (
// //           <form className={styles.form} onSubmit={handleAddFriend}>
// //             <input
// //               name="Name"
// //               placeholder="Friend Name"
// //               value={friendData.Name}
// //               onChange={handleFriendChange}
// //               required
// //             />
// //             <input
// //               name="Bank_name"
// //               placeholder="Bank Name"
// //               value={friendData.Bank_name}
// //               onChange={handleFriendChange}
// //               required
// //             />
// //             <input
// //               name="friend_AccountNumber"
// //               placeholder="Account Number"
// //               value={friendData.friend_AccountNumber}
// //               onChange={handleFriendChange}
// //               required
// //             />
// //             <button type="submit">Save Friend</button>
// //           </form>
// //         )}

// //         {/* TRANSFER */}
// //         {activeTab === "transfer" && selectedFriend && (
// //           <form className={styles.form} onSubmit={handleTransferMoney}>
// //             <h3>{selectedFriend.Name}</h3>
// //             <p>{selectedFriend.Bank_name}</p>

// //             <div className={styles.transferInfo}>
// //               <span>Transfer Type</span>
// //               <strong>
// //                 {transferType === "SAME_BANK"
// //                   ? "Same Bank"
// //                   : "Other Bank"}
// //               </strong>
// //             </div>

// //             {transferType === "OTHER_BANK" && (
// //               <div className={styles.transferInfo}>
// //                 <span>Charges</span>
// //                 <strong>${charge}</strong>
// //               </div>
// //             )}

// //             <input
// //               type="number"
// //               placeholder="Amount"
// //               value={transferData.amount}
// //               onChange={handleTransferChange}
// //               required
// //             />

// //             <div className={styles.transferInfo}>
// //               <span>Total Debit</span>
// //               <strong>
// //                 $
// //                 {transferData.amount
// //                   ? Number(transferData.amount) + charge
// //                   : 0}
// //               </strong>
// //             </div>

// //             <button type="submit">Send Money</button>
// //           </form>
// //         )}
// //       </div>

// //       {showPopup && (
// //         <div className={styles.popup}>
// //           <h2>✅ Transfer Successful</h2>
// //           <button onClick={() => setShowPopup(false)}>Done</button>
// //         </div>
// //       )}

// //       {message && <div className={styles.success}>{message}</div>}
// //       {error && <div className={styles.error}>{error}</div>}
// //     </div>
// //   );
// // }

// // export default Deposit;














import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../Custom/Api_url";
import styles from "./Deposit.module.css";

function Deposit() {
  const user = useSelector((state) => state.login.user);
  const user_id = user?.user_id;

  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [friendData, setFriendData] = useState({
    user_id,
    Name: "",
    Bank_name: "",
    friend_AccountNumber: "",
    friend_user_id: ""
  });

  const [transferData, setTransferData] = useState({
    account_number: "",
    amount: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [bank, setbank] = useState([]);
  const [IFSC_Code, setIFSC_Code] = useState("");

  /* ---------------- ACCOUNT VERIFICATION ---------------- */
  // useEffect(() => {
  //   if (friendData.friend_AccountNumber && IFSC_Code) {
  //     axios
  //       .post(`${API_URL}/account/verifyAccount`, {
  //         accountNumber: friendData.friend_AccountNumber,
  //         IFSC_Code,
  //         Bank_name: friendData.Bank_name
  //       })

  //       .then((res) => {
  //         setFriendData((prev) => ({
  //           ...prev,
  //           Name: res.data.accountHolderName || ""
  //         }));
  //       })
  //       .catch(() => {
  //         setError("Invalid account number or IFSC code");
  //         setFriendData((prev) => ({ ...prev, Name: "" }));
  //         setTimeout(() => setError(""), 3000);
  //       });
  //     console.log(friendData.Bank_name);
  //   }
  // }, [friendData.friend_AccountNumber, IFSC_Code]);
  useEffect(() => {
  if (!friendData.friend_AccountNumber || !IFSC_Code) return;

  axios
    .post(`${API_URL}/account/verifyAccount`, {
      accountNumber: friendData.friend_AccountNumber,
      IFSC_Code
    })
    .then((res) => {
      setFriendData((prev) => ({
        ...prev,
        Name: res.data.accountHolderName
      }));
      setError("");
    })
    .catch((err) => {
      const msg =
        err.response?.data?.message || "Verification failed";

      setError(msg); 
      setFriendData((prev) => ({ ...prev, Name: "" }));

      setTimeout(() => setError(""), 3000);
    });
}, [friendData.friend_AccountNumber, IFSC_Code]);


  const handleFriendChange = (e) => {
    setFriendData({ ...friendData, [e.target.name]: e.target.value });
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/friend/addfriend`, friendData);
      setMessage("Friend added successfully");
      setActiveTab("friends");
      setFriendData({
        user_id,
        Name: "",
        Bank_name: "",
        friend_AccountNumber: "",
        friend_user_id: ""
      });
      setIFSC_Code("");

      const res = await axios.get(`${API_URL}/friend/getfriendlist/${user_id}`);
      setFriends(res.data);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Friend Already Exists");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setTransferData({
      account_number: friend.friend_AccountNumber,
      amount: ""
    });
    setActiveTab("transfer");
  };

  const handleTransferChange = (e) => {
    setTransferData({ ...transferData, amount: e.target.value });
  };

  const handleTransferMoney = async (e) => {
    e.preventDefault();

    if (!transferData.account_number || !transferData.amount) {
      setError("Please enter amount");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/transfer/transfermoney`, {
        sender_id: user_id,
        receiver_account: transferData.account_number,
        amount: transferData.amount
      });

      setMessage(res.data.message);
      setShowPopup(true);
      setActiveTab("friends");
      setTransferData({ account_number: "", amount: "" });
      setSelectedFriend(null);
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/bank/getbankdetails`)
      .then((res) => setbank(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/friend/getfriendlist/${user_id}`)
      .then((res) => setFriends(res.data))
      .catch(() => { });
  }, [user_id]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>💸 Money Transfer</h1>
        <p className={styles.subtitle}>Manage your friends and send money easily</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "friends" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          👥 Friends
        </button>
        <button
          className={`${styles.tab} ${activeTab === "addFriend" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("addFriend")}
        >
          ➕ Add Friend
        </button>
        {selectedFriend && (
          <button
            className={`${styles.tab} ${activeTab === "transfer" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("transfer")}
          >
            💰 Send Money
          </button>
        )}
      </div>

      <div className={styles.content}>
        {/* FRIEND LIST */}
        {activeTab === "friends" && (
          <div>
            {friends.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👤</div>
                <h3>No Friends Added</h3>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setActiveTab("addFriend")}
                >
                  Add Friend
                </button>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={styles.friendCard}
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <div className={styles.avatar}>
                      {friend.Name.charAt(0).toUpperCase()}
                    </div>
                    <h3>Name:{friend.Name}</h3>
                    <p>BankName:{friend.Bank_name}</p>
                    <p>AccountNumber:{friend.friend_AccountNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD FRIEND */}
        {activeTab === "addFriend" && (
          <form className={styles.form} onSubmit={handleAddFriend}>
            <h2>Add New Friend</h2>

            <select
              className={styles.input}
              value={friendData.Bank_name}
              onChange={(e) =>
                setFriendData({ ...friendData, Bank_name: e.target.value })
              }
              required
            >
              <option value="">Select Bank</option>
              {bank.map((b) => (
                <option key={b.id} value={b.Bank_name}>
                  {b.Bank_Name}
                </option>
              ))}
            </select>

            <input
              value={friendData.Name}
              className={styles.input}
              placeholder="Auto fetched name"
              readOnly
            />

            <input
              name="friend_AccountNumber"
              value={friendData.friend_AccountNumber}
              onChange={handleFriendChange}
              className={styles.input}
              placeholder="Account Number"
              required
            />

            {/* <input
              defaultValue={IFSC_Code}
              onBlur={(e) => setIFSC_Code(e.target.value)}
              className={styles.input}
              placeholder="IFSC Code"
              required
            /> */}
            <input
              value={IFSC_Code}
              onChange={(e) => setIFSC_Code(e.target.value)}
              className={styles.input}
              placeholder="IFSC Code"
              required
            />


            <button type="submit" className={styles.primaryBtn}>
              Save Friend
            </button>
            {/* <button
              type="cancel"
              className={styles.cancelBtn}
              onClick={() => setActiveTab("friends")}
            >
              Cancel
            </button> */}
          </form>
        )}

        {/* TRANSFER */}
        {activeTab === "transfer" && selectedFriend && (
          <form className={styles.form} onSubmit={handleTransferMoney}>
            <h2>Send Money to {selectedFriend.Name}</h2>

            <input
              value={transferData.account_number}
              readOnly
              className={styles.input}
            />

            <input
              type="number"
              value={transferData.amount}
              onChange={handleTransferChange}
              className={styles.input}
              placeholder="Amount"
              required
            />

            <button type="submit" className={styles.primaryBtn}>
              Send Money
            </button>
          </form>
        )}
      </div>

      {message && <div className={styles.successMessage}>✓ {message}</div>}
      {error && <div className={styles.errorMessage}>✗ {error}</div>}
    </div>
  );
}

export default Deposit;
