import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../Custom/Api_url";
import styles from "./BankAdmin.module.css";
import { useNavigate } from "react-router-dom";

function BankAdmin() {
    const [bankuser, setbanker] = useState([]);
    const [stats, setStats] = useState({
        totalAccounts: 0,
        pendingKYC: 0,
        verifiedKYC: 0,
        totalTransactions: 0
    });
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");

    const Bank_id = localStorage.getItem("bankId");
    const bankName = localStorage.getItem("bankName");
    const nav = useNavigate();

    useEffect(() => {
        if (!Bank_id) return;

        axios
            .get(`${API_URL}/bank/getbankuserdetails/${Bank_id}`)
            .then(res => {
                const users = res.data || [];
                setbanker(users);
                
                // Calculate stats
                setStats({
                    totalAccounts: users.length,
                    pendingKYC: users.filter(u => u.kyc_status === "PENDING").length,
                    verifiedKYC: users.filter(u => u.kyc_status === "VERIFIED").length,
                    totalTransactions: users.length * 15 // Mock data
                });
            })
            .catch(error => console.log(error));
    }, [Bank_id]);

    const handelTranscation = (user_id) => {
        nav("/Banktransactions", { state: { user_id } });
    };

    const handlekyc = (user_id) => {
        nav("/kyc", { state: { user_id } });
    };

    const handleLogout = () => {
        localStorage.removeItem("bankId");
        localStorage.removeItem("bankName");
        nav("/banklogin");
    };

    // Filter users based on search
    const filteredUsers = bankuser.filter(user => 
        `${user.FirstName} ${user.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.IFSC_Code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.adminContainer}>
            
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏦</span>
                        <span className={styles.logoText}>Admin</span>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    <button
                        className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <span className={styles.navIcon}>📊</span>
                        <span>Overview</span>
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === "accounts" ? styles.active : ""}`}
                        onClick={() => setActiveTab("accounts")}
                    >
                        <span className={styles.navIcon}>👥</span>
                        <span>Accounts</span>
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === "kyc" ? styles.active : ""}`}
                        onClick={() => setActiveTab("kyc")}
                    >
                        <span className={styles.navIcon}>✓</span>
                        <span>KYC Management</span>
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <span className={styles.navIcon}>⚙️</span>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <span className={styles.navIcon}>🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                
                {/* Top Bar */}
                <header className={styles.topBar}>
                    <div>
                        <h1 className={styles.pageTitle}>{bankName}</h1>
                        <p className={styles.pageSubtitle}>Bank Administration Dashboard</p>
                    </div>
                    <div className={styles.topBarRight}>
                        <div className={styles.notificationBtn}>
                            <span>🔔</span>
                            <span className={styles.badge}>3</span>
                        </div>
                        <div className={styles.adminProfile}>
                            <span className={styles.adminAvatar}>A</span>
                            <span className={styles.adminName}>Admin</span>
                        </div>
                    </div>
                </header>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className={styles.tabContent}>
                        
                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            <div className={`${styles.statCard} ${styles.statPrimary}`}>
                                <div className={styles.statIcon}>👥</div>
                                <div className={styles.statContent}>
                                    <p className={styles.statLabel}>Total Accounts</p>
                                    <h2 className={styles.statValue}>{stats.totalAccounts}</h2>
                                    <span className={styles.statTrend}>↑ 12% this month</span>
                                </div>
                            </div>

                            <div className={`${styles.statCard} ${styles.statWarning}`}>
                                <div className={styles.statIcon}>⏱</div>
                                <div className={styles.statContent}>
                                    <p className={styles.statLabel}>Pending KYC</p>
                                    <h2 className={styles.statValue}>{stats.pendingKYC}</h2>
                                    <span className={styles.statTrend}>Needs attention</span>
                                </div>
                            </div>

                            <div className={`${styles.statCard} ${styles.statSuccess}`}>
                                <div className={styles.statIcon}>✓</div>
                                <div className={styles.statContent}>
                                    <p className={styles.statLabel}>Verified KYC</p>
                                    <h2 className={styles.statValue}>{stats.verifiedKYC}</h2>
                                    <span className={styles.statTrend}>↑ 8% this month</span>
                                </div>
                            </div>

                            <div className={`${styles.statCard} ${styles.statInfo}`}>
                                <div className={styles.statIcon}>💳</div>
                                <div className={styles.statContent}>
                                    <p className={styles.statLabel}>Total Transactions</p>
                                    <h2 className={styles.statValue}>{stats.totalTransactions}</h2>
                                    <span className={styles.statTrend}>Last 30 days</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className={styles.activitySection}>
                            <h3 className={styles.sectionTitle}>Recent Activity</h3>
                            <div className={styles.activityList}>
                                <div className={styles.activityItem}>
                                    <div className={styles.activityIcon}>👤</div>
                                    <div className={styles.activityContent}>
                                        <p className={styles.activityText}>New account registered</p>
                                        <span className={styles.activityTime}>2 hours ago</span>
                                    </div>
                                </div>
                                <div className={styles.activityItem}>
                                    <div className={styles.activityIcon}>✓</div>
                                    <div className={styles.activityContent}>
                                        <p className={styles.activityText}>KYC verification completed</p>
                                        <span className={styles.activityTime}>5 hours ago</span>
                                    </div>
                                </div>
                                <div className={styles.activityItem}>
                                    <div className={styles.activityIcon}>💳</div>
                                    <div className={styles.activityContent}>
                                        <p className={styles.activityText}>High-value transaction processed</p>
                                        <span className={styles.activityTime}>1 day ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Accounts Tab */}
                {activeTab === "accounts" && (
                    <div className={styles.tabContent}>
                        
                        {/* Search Bar */}
                        <div className={styles.searchBar}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search accounts by name or IFSC..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Accounts Table */}
                        <div className={styles.tableContainer}>
                            <table className={styles.accountsTable}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Account Holder</th>
                                        <th>Branch</th>
                                        <th>IFSC Code</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className={styles.emptyCell}>
                                                No accounts found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className={styles.userCell}>
                                                        <div className={styles.userAvatar}>
                                                            {user.FirstName?.charAt(0)}
                                                        </div>
                                                        <span>{user.FirstName} {user.LastName}</span>
                                                    </div>
                                                </td>
                                                <td>{user.Branch_Name}</td>
                                                <td>
                                                    <code className={styles.codeText}>{user.IFSC_Code}</code>
                                                </td>
                                                <td>
                                                    <span className={styles.statusBadge}>Active</span>
                                                </td>
                                                <td>
                                                    <div className={styles.actionBtns}>
                                                        <button
                                                            className={styles.tableBtn}
                                                            onClick={() => handelTranscation(user.user_id)}
                                                            title="View Transactions"
                                                        >
                                                            💳
                                                        </button>
                                                        <button
                                                            className={styles.tableBtn}
                                                            onClick={() => handlekyc(user.user_id)}
                                                            title="View KYC"
                                                        >
                                                            ✓
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* KYC Management Tab */}
                {activeTab === "kyc" && (
                    <div className={styles.tabContent}>
                        <h3 className={styles.sectionTitle}>KYC Verification Queue</h3>
                        
                        <div className={styles.kycGrid}>
                            {bankuser.map((user, index) => (
                                <div className={styles.kycCard} key={index}>
                                    <div className={styles.kycHeader}>
                                        <div className={styles.kycAvatar}>
                                            {user.FirstName?.charAt(0)}{user.LastName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={styles.kycName}>
                                                {user.FirstName} {user.LastName}
                                            </h4>
                                            <p className={styles.kycBranch}>{user.Branch_Name}</p>
                                        </div>
                                    </div>
                                    <div className={styles.kycBody}>
                                        <div className={styles.kycInfo}>
                                            <span className={styles.kycLabel}>IFSC:</span>
                                            <span className={styles.kycValue}>{user.IFSC_Code}</span>
                                        </div>
                                        <div className={styles.kycInfo}>
                                            <span className={styles.kycLabel}>Status:</span>
                                            <span className={`${styles.kycStatus} ${styles.pending}`}>
                                              {user.kyc_status}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className={styles.verifyBtn}
                                        onClick={() => handlekyc(user.user_id)}
                                    >
                                        Review KYC
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className={styles.tabContent}>
                        <h3 className={styles.sectionTitle}>Bank Settings</h3>
                        
                        <div className={styles.settingsCard}>
                            <div className={styles.settingItem}>
                                <div>
                                    <h4 className={styles.settingTitle}>Bank Name</h4>
                                    <p className={styles.settingDesc}>{bankName}</p>
                                </div>
                                <button className={styles.editBtn}>Edit</button>
                            </div>
                            
                            <div className={styles.settingItem}>
                                <div>
                                    <h4 className={styles.settingTitle}>Bank ID</h4>
                                    <p className={styles.settingDesc}>{Bank_id}</p>
                                </div>
                                <button className={styles.editBtn}>View</button>
                            </div>
                            
                            <div className={styles.settingItem}>
                                <div>
                                    <h4 className={styles.settingTitle}>Notification Preferences</h4>
                                    <p className={styles.settingDesc}>Manage email and SMS alerts</p>
                                </div>
                                <button className={styles.editBtn}>Configure</button>
                            </div>
                            
                            <div className={styles.settingItem}>
                                <div>
                                    <h4 className={styles.settingTitle}>Security Settings</h4>
                                    <p className={styles.settingDesc}>Two-factor authentication, passwords</p>
                                </div>
                                <button className={styles.editBtn}>Manage</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default BankAdmin;