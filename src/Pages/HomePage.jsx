import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../Custom/Api_url";
import styles from "./HomePage.module.css";
import {
    Home,
    CreditCard,
    Send,
    Download,
    Receipt,
    User,
    Settings,
    LogOut,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Eye,
    EyeOff,
    Bell,
    Search,
    Building2,
    Wallet,
    Clock,
    Shield,
    Phone,
    Mail,
} from "lucide-react";
import { FaMoneyBillTransfer } from "react-icons/fa6";

export default function HomePage() {
    const { user } = useSelector((state) => state.login);
    const navigate = useNavigate();
    const user_id = user?.user_id;
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [summary, setsummary] = useState({
        income: 0,
        expense: 0,
        savings: 0
    })

    // Fetch user profile
    useEffect(() => {
        async function getProfile() {
            try {
                const res = await axios.get(`${API_URL}/getuserdetails/${user_id}`);
                if (res.data && res.data.length > 0) {
                    setProfile(res.data[0]);
                }
            } catch (error) {
                console.log("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        }
        if (user_id) getProfile();
        else setLoading(false);
    }, [user_id]);

    const [recentTransactions, setRecentTransactions] = useState([])

    // Quick actions
    const quickActions = [
        { icon: Send, label: 'Send Money', color: '#004c8c', action: () => navigate('/deposit') },
        { icon: Download, label: 'Request', color: '#28a745', action: () => console.log('Request Money') },
        { icon: CreditCard, label: 'Cards', color: '#ff6600', action: () => navigate('/cards') },
        { icon: Receipt, label: 'Bills', color: '#6f42c1', action: () => console.log('Bills') },
    ];

    const handleLogout = () => {
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
    };
    useEffect(() => {
        if (!user_id) return;

        axios
            .get(`${API_URL}/transcations/gettranscations/${user_id}`)
            .then((res) => {
                const transactions = res.data.transactions || [];
                setRecentTransactions(transactions);

                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                let income = 0;
                let expenses = 0;

                transactions.forEach(txn => {
                    const txnDate = new Date(txn.date);

                    if (
                        txnDate.getMonth() === currentMonth &&
                        txnDate.getFullYear() === currentYear
                    ) {
                        if (txn.type === "credit") {
                            income += Number(txn.amount);
                        } else {
                            expenses += Number(txn.amount);
                        }
                    }
                });

                setsummary({
                    income,
                    expenses,
                    savings: income - expenses
                });
            })
            .catch(err => console.log(err));
    }, [user_id]);


    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className={styles.errorContainer}>
                <p>Unable to load profile information</p>
            </div>
        );
    }

    return (
        <div className={styles.homeContainer}>



            <div className={styles.mainLayout}>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarContent}>
                        <button
                            className={`${styles.menuItem} ${isActive('/home') ? styles.active : ''}`}
                            onClick={() => navigate('/home')}
                        >
                            <Home size={20} />
                            <span>Dashboard</span>
                        </button>

                        <button
                            className={`${styles.menuItem} ${isActive('/transactions') ? styles.active : ''}`}
                            onClick={() => navigate('/transactions')}
                        >
                            <Receipt size={20} />
                            <span>Transactions</span>
                        </button>


                        <button
                            className={`${styles.menuItem} ${isActive('/cards') ? styles.active : ''}`}
                            onClick={() => navigate('/cards')}
                        >
                            <CreditCard size={20} />
                            <span>Cards</span>
                        </button>

                        <button
                            className={`${styles.menuItem} ${activeMenu === 'profile' ? styles.active : ''}`}
                            onClick={() => navigate('/deposit')}
                        >
                            <FaMoneyBillTransfer size={20} />
                            <span>Transfer Money</span>
                        </button>
                        <button
                            className={styles.menuItem}
                            onClick={() => alert("Settings coming soon")}
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>


                        <div className={styles.sidebarFooter}>
                            <button className={styles.logoutButton} onClick={handleLogout}>
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>

                    {/* Welcome Section */}
                    <div className={styles.welcomeSection}>
                        <div>
                            <h1 className={styles.welcomeTitle}>Welcome back, {profile.FirstName}!</h1>
                            <p className={styles.welcomeSubtitle}>Here's what's happening with your account today.</p>
                        </div>
                        {/* <div className={styles.dateInfo}>
                            <Clock size={16} />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div> */}
                    </div>

                    {/* Balance Card */}
                    <div className={styles.balanceCard}>
                        <div className={styles.balanceHeader}>
                            <div className={styles.balanceTitle}>
                                <Wallet size={24} />
                                <div>
                                    <h3>Available Balance</h3>
                                    <p>Account {profile.account_number}</p>
                                </div>
                            </div>
                            <button
                                className={styles.eyeButton}
                                onClick={() => setBalanceVisible(!balanceVisible)}
                            >
                                {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className={styles.balanceAmount}>
                            {balanceVisible ? (
                                <>
                                    <span className={styles.currency}>₹</span>
                                    <span className={styles.amount}>{profile.TotalAmount.toLocaleString('en-IN')}</span>
                                </>
                            ) : (
                                <span className={styles.hiddenBalance}>₹ ********</span>
                            )}
                        </div>

                        <div className={styles.balanceFooter}>
                            <div className={styles.balanceItem}>
                                <span className={styles.label}>BankName</span>
                                <span className={styles.value}>{profile.Bank_Name}</span>
                            </div>
                            <div className={styles.balanceDivider}></div>
                            <div className={styles.balanceItem}>
                                <span className={styles.label}>Status</span>
                                <span className={styles.statusBadge}>
                                    <span className={styles.statusDot}></span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.quickActionsSection}>
                        <h2 className={styles.sectionTitle}>Quick Actions</h2>
                        <div className={styles.quickActionsGrid}>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={styles.quickActionCard}
                                    onClick={action.action}
                                >
                                    <div className={styles.actionIcon} style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                                        <action.icon size={24} />
                                    </div>
                                    <span className={styles.actionLabel}>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.contentGrid}>

                        {/* Recent Transactions */}
                        <div className={styles.transactionsCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Recent Transactions</h2>
                                <button className={styles.viewAllButton} onClick={() => navigate('/transactions')}>
                                    View All
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>

                            <div className={styles.transactionsList}>
                                {recentTransactions.slice(0, 4).map((transaction) => (
                                    <div key={transaction.id} className={styles.transactionItem}>
                                        <div className={styles.transactionIcon}>
                                            {transaction.type === "credit" ? (
                                                <ArrowDownLeft size={20} className={styles.creditIcon} />
                                            ) : (
                                                <ArrowUpRight size={20} className={styles.debitIcon} />
                                            )}
                                        </div>

                                        <div className={styles.transactionDetails}>
                                            <h4>{transaction.description}</h4>
                                            <h5>{transaction.recipient}</h5>
                                            <p>{transaction.category}</p>
                                            <p>
                                                {transaction.date} • {transaction.time}
                                            </p>
                                        </div>

                                        <div
                                            className={`${styles.transactionAmount} ${transaction.type === "credit" ? styles.credit : styles.debit
                                                }`}
                                        >
                                            {transaction.type === "credit" ? "+" : "-"} ₹
                                            {transaction.amount.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Account Summary */}
                        <div className={styles.summaryCard}>
                            <h2 className={styles.cardTitle}>Account Summary</h2>

                            <div className={styles.summaryItems}>

                                {/* This Month */}
                                <div className={styles.summaryItem}>
                                    <div
                                        className={styles.summaryIcon}
                                        style={{ backgroundColor: '#28a74515', color: '#28a745' }}
                                    >
                                        <TrendingUp size={20} />
                                    </div>

                                    <div className={styles.summaryContent}>
                                        <span className={styles.summaryLabel}>This Month</span>
                                        <span className={styles.summaryValue}>
                                            +₹{(summary.income ?? 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>


                                <div className={styles.summaryItem}>
                                    <div
                                        className={styles.summaryIcon}
                                        style={{ backgroundColor: '#ff660015', color: '#ff6600' }}
                                    >
                                        <ArrowUpRight size={20} />
                                    </div>

                                    <div className={styles.summaryContent}>
                                        <span className={styles.summaryLabel}>Expenses</span>
                                        <span className={styles.summaryValue}>
                                            ₹{(summary.expenses ?? 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>


                                {/* Savings */}
                                <div className={styles.summaryItem}>
                                    <div
                                        className={styles.summaryIcon}
                                        style={{ backgroundColor: '#004c8c15', color: '#004c8c' }}
                                    >
                                        <Wallet size={20} />
                                    </div>
                                    <div className={styles.summaryContent}>
                                        <span className={styles.summaryLabel}>Savings</span>
                                        <span className={styles.summaryValue}>
                                            ₹{summary.savings.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className={styles.contactSection}>
                                <h3>Need Help?</h3>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactItem}>
                                        <Phone size={16} />
                                        <span>1800-XXX-XXXX</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        <Mail size={16} />
                                        <span>support@mybank.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Security Notice */}
                    <div className={styles.securityNotice}>
                        <Shield size={20} />
                        <div className={styles.securityText}>
                            <strong>Your account is secure.</strong> We use industry-standard encryption to protect your data.
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}


// import React, { useState } from "react";
// import {
//   Eye,
//   EyeOff,
//   CreditCard,
//   PiggyBank,
//   TrendingUp,
//   Shield,
//   Bell,
//   User,
//   ChevronRight,
//   Award,
//   Zap,
//   Globe,
// } from "lucide-react";
// import styles from "./Homepage.module.css";

// export default function Homepage() {
//   const [balanceVisible, setBalanceVisible] = useState(true);
//   const balance = "₹12,45,680.50";

//   return (
//     <div className={styles.page}>
//       {/* Header */}
//       <header className={styles.header}>
//         <div className={styles.headerInner}>
//           <div className={styles.logo}>
//             <Zap />
//             <span>NexBank</span>
//           </div>
//           <div className={styles.headerIcons}>
//             <button className={styles.iconBtn}>
//               <Bell />
//               <span className={styles.dot}></span>
//             </button>
//             <button className={styles.iconBtn}>
//               <User />
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className={styles.container}>
//         {/* Welcome */}
//         <div className={styles.welcome}>
//           <h1>Welcome back, Priya!</h1>
//           <p>Here's your financial overview</p>
//         </div>

//         {/* Balance Card */}
//         <div className={styles.balanceCard}>
//           <div className={styles.balanceTop}>
//             <div>
//               <p>Total Balance</p>
//               <div className={styles.balanceRow}>
//                 <h2>{balanceVisible ? balance : "₹••••••••"}</h2>
//                 <button
//                   onClick={() => setBalanceVisible(!balanceVisible)}
//                   className={styles.eyeBtn}
//                 >
//                   {balanceVisible ? <Eye /> : <EyeOff />}
//                 </button>
//               </div>
//             </div>
//             <span className={styles.growth}>+12.5%</span>
//           </div>

//           <div className={styles.balanceStats}>
//             <div>
//               <p>Savings</p>
//               <h4>₹8,45,230</h4>
//             </div>
//             <div>
//               <p>Investments</p>
//               <h4>₹4,00,450</h4>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <section>
//           <h3 className={styles.sectionTitle}>Quick Actions</h3>
//           <div className={styles.actions}>
//             <Action icon={<CreditCard />} title="Cards" desc="Manage cards" />
//             <Action icon={<PiggyBank />} title="Savings" desc="Create goals" />
//             <Action icon={<TrendingUp />} title="Invest" desc="Grow wealth" />
//             <Action icon={<Shield />} title="Insurance" desc="Stay protected" />
//           </div>
//         </section>

//         {/* Feature Cards */}
//         <div className={styles.features}>
//           <Feature icon={<Award />} title="Rewards" desc="2,450 points to redeem" />
//           <Feature icon={<TrendingUp />} title="Credit Score" desc="785 • Excellent" />
//           <Feature icon={<Globe />} title="Global Services" desc="Send money worldwide" />
//         </div>
//       </main>
//     </div>
//   );
// }

// function Action({ icon, title, desc }) {
//   return (
//     <button className={styles.actionCard}>
//       <div className={styles.actionIcon}>{icon}</div>
//       <h4>{title}</h4>
//       <p>{desc}</p>
//     </button>
//   );
// }

// function Feature({ icon, title, desc }) {
//   return (
//     <div className={styles.featureCard}>
//       <div className={styles.featureTop}>
//         <div className={styles.featureIcon}>{icon}</div>
//         <ChevronRight />
//       </div>
//       <h4>{title}</h4>
//       <p>{desc}</p>
//     </div>
//   );
// }
