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




import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_URL } from "../Custom/Api_url";
import styles from "./UserCards.module.css";

function UserCards() {
    const [cards, setCards] = useState([]);
    const user = useSelector(state => state.login.user);
    const user_id = user?.user_id;

    useEffect(() => {
        if (user_id) {
            axios
                .get(`${API_URL}/usercard/card/${user_id}`)
                .then(res => setCards(res.data.cards))
                .catch(err => console.log(err));
        }
    }, [user_id]);

    // Function to get bank-specific class
    const getBankClass = (bankName) => {
        console.log("Bank Name:", bankName);
        const bank = bankName?.toLowerCase().replace(/\s+/g, '');
        const bankMap = {
            'chase': styles.chase,
            'bankofamerica': styles.bofa,
            'wellsfargo': styles.wellsfargo,
            'citibank': styles.citi,
            'capitalone': styles.capitalone,
            'amex': styles.amex,
            'americanexpress': styles.amex,
            'discover': styles.discover,
            'usbank': styles.usbank,
            'pnc': styles.pnc,
            'tdbank': styles.tdbank,
            'goldmansachs': styles.goldmansachs,
            'apple': styles.apple
        };
        return bankMap[bank] || styles.defaultCard;
    };

    // Function to get network logo
    const getNetworkLogo = (network) => {
        const networkLower = network?.toLowerCase();
        switch (networkLower) {
            case 'visa':
                return (
                    <svg className={styles.networkLogo} viewBox="0 0 48 32" fill="none">
                        <path d="M19.5 10.5L17.5 21.5H14.5L16.5 10.5H19.5Z" fill="currentColor"/>
                        <path d="M30 10.8C29.3 10.5 28.2 10.2 26.8 10.2C23.8 10.2 21.6 11.7 21.6 13.9C21.6 15.5 23.2 16.4 24.4 16.9C25.6 17.4 26.1 17.8 26.1 18.3C26.1 19.1 25.1 19.4 24.2 19.4C22.8 19.4 22 19.2 20.7 18.7L20.2 18.5L19.7 21.1C20.7 21.5 22.4 21.9 24.2 21.9C27.4 21.9 29.5 20.4 29.5 18C29.5 16.7 28.7 15.7 26.8 14.9C25.7 14.4 25 14.1 25 13.6C25 13.1 25.5 12.6 26.7 12.6C27.7 12.6 28.5 12.8 29.1 13.1L29.4 13.2L29.9 10.7L30 10.8Z" fill="currentColor"/>
                        <path d="M35.4 10.5C34.6 10.5 34 10.5 33.7 11.3L29.1 21.5H32.3L32.9 19.7H36.8L37.2 21.5H40L37.6 10.5H35.4ZM33.7 17.4C33.9 16.9 34.8 14.3 34.8 14.3C34.8 14.3 35 13.7 35.2 13.2L35.4 14.2C35.4 14.2 35.9 16.6 36.1 17.4H33.7Z" fill="currentColor"/>
                        <path d="M11.5 10.5L8.5 17.8L8.2 16.4C7.8 15 6.4 13.4 4.8 12.6L7.6 21.5H10.8L14.7 10.5H11.5Z" fill="currentColor"/>
                        <path d="M5.5 10.5H0.5L0.5 10.7C4.4 11.6 6.8 13.9 7.6 16.3L6.7 11.4C6.6 10.6 6 10.5 5.3 10.5H5.5Z" fill="currentColor"/>
                    </svg>
                );
            case 'mastercard':
                return (
                    <svg className={styles.networkLogo} viewBox="0 0 48 32" fill="none">
                        <circle cx="19" cy="16" r="10" fill="#EB001B"/>
                        <circle cx="29" cy="16" r="10" fill="#F79E1B"/>
                        <path d="M24 10C26.21 11.67 27.5 14.24 27.5 16C27.5 17.76 26.21 20.33 24 22C21.79 20.33 20.5 17.76 20.5 16C20.5 14.24 21.79 11.67 24 10Z" fill="#FF5F00"/>
                    </svg>
                );
            case 'amex':
            case 'americanexpress':
                return (
                    <svg className={styles.networkLogo} viewBox="0 0 48 32" fill="none">
                        <rect x="8" y="12" width="32" height="8" fill="currentColor"/>
                        <text x="24" y="18" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">AMEX</text>
                    </svg>
                );
            case 'discover':
                return <div className={styles.networkText}>DISCOVER</div>;
            default:
                return <div className={styles.networkText}>{network}</div>;
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Your Cards</h1>

            <div className={styles.cardGrid}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`${styles.card} ${getBankClass(card.Bank_Name)}`}
                        style={card.card_color && !getBankClass(card.Bank_Name).includes('defaultCard') ? {} : { background: card.card_color }}
                    >
                        {/* Pattern overlay for some banks */}
                        <div className={styles.cardPattern}></div>

                        {/* Bank Name */}
                        <div className={styles.bankName}>
                            {card.Bank_Name}
                        </div>

                        {/* Chip */}
                        <div className={styles.chip}>
                            <div className={styles.chipLine1}></div>
                            <div className={styles.chipLine2}></div>
                            <div className={styles.chipLine3}></div>
                            <div className={styles.chipLine4}></div>
                        </div>

                        {/* Contactless indicator */}
                        <div className={styles.contactless}>
                            <div className={styles.contactlessWave}></div>
                            <div className={styles.contactlessWave}></div>
                            <div className={styles.contactlessWave}></div>
                            <div className={styles.contactlessWave}></div>
                        </div>

                        {/* Card Number */}
                        <div className={styles.cardNumber}>
                            <span className={styles.cardNumberGroup}>****</span>
                            <span className={styles.cardNumberGroup}>****</span>
                            <span className={styles.cardNumberGroup}>****</span>
                            <span className={styles.cardNumberGroup}>{card.card_last}</span>
                        </div>

                        {/* Footer */}
                        <div className={styles.cardFooter}>
                            <div className={styles.cardInfo}>
                                <p className={styles.label}>VALID UPTO</p>
                                <p className={styles.value}>
                                    {String(card.expiry_month).padStart(2, '0')}/{String(card.expiry_year).slice(-2)}
                                </p>
                            </div>

                            <div className={styles.cardInfo}>
                                <p className={styles.label}>CARD HOLDER</p>
                                <p className={styles.value}>
                                    {card.card_holder_name?.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Network Logo */}
                        <div className={styles.network}>
                            {getNetworkLogo(card.network)}
                        </div>

                        {/* Card Type */}
                        <div className={styles.cardType}>
                            {card.card_type}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserCards;