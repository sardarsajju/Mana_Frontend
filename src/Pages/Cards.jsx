// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { API_URL } from "../Custom/Api_url";
// import styles from "./UserCards.module.css";

// function UserCards() {
//     const [cards, setCards] = useState([]);
//     const user = useSelector(state => state.login.user);
//     const user_id = user?.user_id;

//     useEffect(() => {
//         if (user_id) {
//             axios
//                 .get(`${API_URL}/usercard/card/${user_id}`)
//                 .then(res => setCards(res.data.cards))
//                 .catch(err => console.log(err));
//         }
//     }, [user_id]);

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.heading}>Your Cards</h1>

//             <div className={styles.cardGrid}>
//                 {cards.map((card, index) => (
//                     <div
//                         key={index}
//                         className={styles.card}
//                         style={{ background: card.card_color }}
//                     >
//                         {/* Bank Name */}
//                         <div className={styles.bankName}>
//                             {card.Bank_Name}
//                         </div>

//                         {/* Chip + Network */}
//                         <div className={styles.topRow}>
//                             <div className={styles.chip}></div>
//                             <div className={styles.network}>
//                                 {card.network}
//                             </div>
//                         </div>

//                         {/* Card Number */}
//                         <div className={styles.cardNumber}>
//                             **** **** **** {card.card_last}
//                         </div>

//                         {/* Footer */}
//                         <div className={styles.cardFooter}>
//                             <div>
//                                 <p className={styles.label}>Card Holder</p>
//                                 <p className={styles.value}>
//                                     {card.card_holder_name}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className={styles.label}>Expiry</p>
//                                 <p className={styles.value}>
//                                     {card.expiry_month}/{card.expiry_year}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Debit/Credit */}
//                         <div className={styles.cardType}>
//                             {card.card_type}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default UserCards;




// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { API_URL } from "../Custom/Api_url";
// import styles from "./UserCards.module.css";

// function UserCards() {
//     const user = useSelector(state => state.login.user);
//     const user_id = user?.user_id;

//     const [cards, setCards] = useState([]);

//     const [aadhaar_number, setAadhaarNumber] = useState("");
//     const [pan_number, setPanNumber] = useState("");

//     const [showApply, setShowApply] = useState(true);
//     const [showKycForm, setShowKycForm] = useState(false);
//     const [showCards, setShowCards] = useState(false);

//     const [loading, setLoading] = useState(false);

//     const fetchCards = async () => {
//         try {
//             const res = await axios.get(`${API_URL}/usercard/card/${user_id}`);
//             setCards(res.data.cards || []);
//             console.log(res.data.cards);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     /* -------------------- KYC SUBMIT -------------------- */
//     const handleKycSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             await axios.post(`${API_URL}/kyc/kycdetails`, {
//                 aadhaar_number,
//                 pan_number,
//                 user_id
//             });

//             setShowKycForm(false);
//             setShowApply(false);
//             setShowCards(true);

//             await fetchCards();
//         } catch (err) {
//             console.error(err);
//             alert("KYC submission failed");
//         } finally {
//             setLoading(false);
//         }
//     };
// useEffect(() => {
//     if (!user_id) return;

//     axios.get(`${API_URL}/kyc/getkycdetails/${user_id}`)
//         .then(res => {
//             if (res.data.status === "PENDING") {
//                 setShowApply(true);
//                 setShowKycForm(false);
//                 setShowCards(false);
//             } else if (res.data.status === "VERIFIED") {
//                 setShowApply(false);
//                 setShowKycForm(false);
//                 setShowCards(true);
//                 fetchCards(); // ✅ VERY IMPORTANT
//             }
//         })
//         .catch(err => console.error(err));
// }, [user_id]);

//     const getBankClass = (bankName) => {
//         const bank = bankName?.toLowerCase().replace(/\s+/g, "");
//         const bankMap = {
//             chase: styles.chase,
//             bankofamerica: styles.bofa,
//             wellsfargo: styles.wellsfargo,
//             citibank: styles.citi,
//             capitalone: styles.capitalone,
//             amex: styles.amex,
//             americanexpress: styles.amex,
//             discover: styles.discover,
//         };
//         return bankMap[bank] || styles.defaultCard;
//     };

//     const getNetworkLogo = (network) => {
//         if (!network) return null;
//         return <div className={styles.networkText}>{network.toUpperCase()}</div>;
//     };

//     return (
//         <div className={styles.container}>

//             {showApply && (
//                 <button
//                     className={styles.applyBtn}
//                     onClick={() => {
//                         setShowApply(false);
//                         setShowKycForm(true);
//                     }}
//                 >
//                     Apply for Card
//                 </button>
//             )}

//             {showKycForm && (
//                 <form className={styles.kycForm} onSubmit={handleKycSubmit}>
//                     <h2>KYC Verification</h2>

//                     <input
//                         type="text"
//                         placeholder="Aadhaar Number"
//                         value={aadhaar_number}
//                         onChange={(e) => setAadhaarNumber(e.target.value)}
//                         maxLength="12"
//                         required
//                     />

//                     <input
//                         type="text"
//                         placeholder="PAN Number"
//                         value={pan_number}
//                         onChange={(e) => setPanNumber(e.target.value)}
//                         maxLength="10"
//                         required
//                     />

//                     <button type="submit" disabled={loading}>
//                         {loading ? "Submitting..." : "Submit KYC"}
//                     </button>
//                 </form>
//             )}

//             {showCards && (
//                 <>
//                     <h1 className={styles.heading}>Your Cards</h1>

//                     <div className={styles.cardGrid}>
//                         {cards.map((card, index) => (
//                             <div
//                                 key={index}
//                                 className={`${styles.card} ${getBankClass(card.Bank_Name)}`}
//                             >
//                                 <div className={styles.bankName}>
//                                     {card.Bank_Name}
//                                 </div>

//                                 <div className={styles.chip}></div>

//                                 <div className={styles.cardNumber}>
//                                     **** **** **** {card.card_last}
//                                 </div>

//                                 <div className={styles.cardFooter}>
//                                     <div>
//                                         <p className={styles.label}>CARD HOLDER</p>
//                                         <p className={styles.value}>
//                                             {card.card_holder_name?.toUpperCase()}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <p className={styles.label}>VALIDUPTO</p>
//                                         <p className={styles.value}>
//                                             {String(card.expiry_month).padStart(2, "0")}/
//                                             {String(card.expiry_year).slice(-2)}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className={styles.network}>
//                                     {getNetworkLogo(card.network)}
//                                 </div>

//                                 <div className={styles.cardType}>
//                                     {card.card_type}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// export default UserCards;



import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../Custom/Api_url";
import styles from "./UserCards.module.css";

function UserCards() {
    const user = useSelector(state => state.login.user);
    const user_id = user?.user_id;

    const [cards, setCards] = useState([]);
    const [aadhaar_number, setAadhaarNumber] = useState("");
    const [pan_number, setPanNumber] = useState("");

    const [showApply, setShowApply] = useState(true);
    const [showKycForm, setShowKycForm] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCards = async () => {
        try {
            const res = await axios.get(`${API_URL}/usercard/card/${user_id}`);
            setCards(res.data.cards || []);
        } catch (err) {
            console.error(err);
        }
    };

    /* -------------------- KYC SUBMIT -------------------- */
    const handleKycSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/kyc/kycdetails`, {
                aadhaar_number,
                pan_number,
                user_id
            });

            setShowApply(false);
            setShowKycForm(false);
            setShowCards(true);

            await fetchCards();
        } catch (err) {
            alert("KYC submission failed");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- INITIAL LOAD -------------------- */
    useEffect(() => {
        if (!user_id) return;

        axios
            .get(`${API_URL}/kyc/getkycdetails/${user_id}`)
            .then(async (res) => {
                if (res.data.status === "PENDING") {
                    setShowApply(true);
                    setShowKycForm(false);
                    setShowCards(false);
                }

                if (res.data.status === "VERIFIED") {
                    setShowApply(false);
                    setShowKycForm(false);
                    setShowCards(true);
                    await fetchCards();
                }
            })
            .catch(err => console.error(err));
    }, [user_id]);

    const getBankClass = (bankName) => {
        const bank = bankName?.toLowerCase().replace(/\s+/g, "");
        const map = {
            statebankofindia: styles.sbi,
            hdfcbank: styles.hdfc,
            icicibank: styles.icici,
            axisbank: styles.axis,
            kotakmahindra: styles.kotak
        };
        return map[bank] || styles.defaultCard;
    };

    return (
        <div className={styles.container}>

            {/* APPLY BUTTON */}
            {showApply && (
                <button
                    className={styles.applyBtn}
                    onClick={() => {
                        setShowApply(false);
                        setShowKycForm(true);
                    }}
                >
                    Apply for Card
                </button>
            )}

            {/* KYC FORM */}
            {showKycForm && (
                <form className={styles.kycForm} onSubmit={handleKycSubmit}>
                    <h2>KYC Verification</h2>

                    <input
                        type="text"
                        placeholder="Aadhaar Number"
                        value={aadhaar_number}
                        maxLength="12"
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="PAN Number"
                        value={pan_number}
                        maxLength="10"
                        onChange={(e) => setPanNumber(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit KYC"}
                    </button>
                </form>
            )}

            {/* CARDS */}
            {showCards && (
                <>
                    <h1 className={styles.heading}>Your Cards</h1>

                    <div className={styles.cardGrid}>
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className={`${styles.card} ${getBankClass(card.Bank_Name)}`}
                            >

                                {/* TOP */}
                                <div className={styles.topRow}>
                                    <div className={styles.bankName}>
                                        {card.Bank_Name}
                                    </div>
                                    <div className={styles.cardType}>
                                        {card.card_type}
                                    </div>
                                </div>

                                {/* CHIP + NETWORK */}
                                <div className={styles.chipRow}>
                                    <div className={styles.chip}></div>
                                    <div className={styles.network}>
                                        {card.network?.toUpperCase()}
                                    </div>
                                </div>

                                {/* NUMBER */}
                                <div className={styles.cardNumber}>
                                    **** **** **** {card.card_last}
                                </div>

                                {/* FOOTER */}
                                <div className={styles.cardFooter}>
                                    <div>
                                        <p className={styles.label}>CARD HOLDER</p>
                                        <p className={styles.value}>
                                            {card.card_holder_name?.toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>VALID UPTO</p>
                                        <p className={styles.value}>
                                            {String(card.expiry_month).padStart(2, "0")}/
                                            {String(card.expiry_year).slice(-2)}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default UserCards;
