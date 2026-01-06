// src/pages/SuperAdmin/SuperAdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./SuperAdminDashboard.module.css";
import {
  Shield,
  Building2,
  FolderKanban,
  Users,
  Bug,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowRight,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Code2,
  MessageSquare,
  PieChart
} from "lucide-react";

function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalProjects: 0,
    totalBugs: 0,
    totalUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Bug tracker tips and content
  const bugTrackerTips = [
    {
      icon: <Bug size={24} />,
      title: "Effective Bug Reporting",
      content: "Always include steps to reproduce, expected behavior, and actual behavior when reporting bugs."
    },
    {
      icon: <Zap size={24} />,
      title: "Priority Matters",
      content: "Critical bugs should be fixed immediately, while low-priority bugs can be scheduled for later sprints."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Communication is Key",
      content: "Use the built-in chat feature to clarify bug details between testers and developers."
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Test Before Closing",
      content: "Always verify that a bug is truly fixed before marking it as resolved."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Track Trends",
      content: "Monitor bug trends to identify areas of the application that need more attention."
    }
  ];

  // Fun facts about bug tracking
  const funFacts = [
    "The first computer bug was an actual bug - a moth found in Harvard's Mark II computer in 1947.",
    "On average, developers spend 50% of their time finding and fixing bugs.",
    "The cost of fixing a bug increases 10x at each stage of the software development lifecycle.",
    "A study found that the average software project has 15-50 bugs per 1000 lines of code.",
    "The term 'debugging' was popularized by Grace Hopper after the moth incident."
  ];

  useEffect(() => {
    loadDashboardData();

    // Rotate tips every 5 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % bugTrackerTips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/super-admin/organizations");
      console.log("API Response:", res.data); // Debug log

      setOrganizations(res.data.organizations || []);
      setStats(res.data.stats || {
        totalOrganizations: 0,
        totalProjects: 0,
        totalBugs: 0,
        totalUsers: 0
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      console.error("Error response:", error.response?.data); // More detailed error

      // Show user-friendly error
      alert(`Failed to load dashboard: ${error.response?.data?.message || error.message}`);

      setOrganizations([]);
      setStats({
        totalOrganizations: 0,
        totalProjects: 0,
        totalBugs: 0,
        totalUsers: 0
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleManageOrg = (orgId, orgName) => {
    localStorage.setItem("org_id", orgId);
    localStorage.setItem("org_name", orgName);
    navigate("/admin/dashboard");
  };

  const getRandomFact = () => {
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Super Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <Shield size={32} />
            <div>
              <h1>BugTracker</h1>
              <span>Super Admin</span>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <a href="#overview" className={`${styles.navItem} ${styles.active}`}>
            <BarChart3 size={20} />
            <span>Overview</span>
          </a>
          <a href="#organizations" className={styles.navItem}>
            <Building2 size={20} />
            <span>Organizations</span>
          </a>
          <a href="#insights" className={styles.navItem}>
            <Activity size={20} />
            <span>Insights</span>
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name || "Admin"}</span>
              <span className={styles.userRole}>Super Admin</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Welcome back, {user?.name || "Admin"}!</h1>
            <p>Here's what's happening across all organizations</p>
          </div>
          <button className={styles.refreshBtn} onClick={loadDashboardData}>
            <RefreshCw size={20} />
            Refresh
          </button>
        </header>

        {/* Stats Cards */}
        <section id="overview" className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <Building2 size={28} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalOrganizations}</span>
                <span className={styles.statLabel}>Organizations</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
                <FolderKanban size={28} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalProjects}</span>
                <span className={styles.statLabel}>Total Projects</span>
              </div>
            </div>

        

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                <Users size={28} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalUsers}</span>
                <span className={styles.statLabel}>Total Users</span>
              </div>
            </div>
          </div>
        </section>

        {/* Organizations Section */}
        <section id="organizations" className={styles.organizationsSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Building2 size={24} />
              All Organizations
            </h2>
            <span className={styles.badge}>{organizations.length} Organizations</span>
          </div>

          <div className={styles.orgGrid}>
            {organizations.map((org, index) => (
              <div key={org.org_id} className={styles.orgCard}>
                <div className={styles.orgCardHeader}>
                  <div className={styles.orgIcon} style={{
                    background: `linear-gradient(135deg, ${['#667eea', '#11998e', '#f093fb', '#4facfe', '#ff6b6b'][index % 5]
                      }, ${['#764ba2', '#38ef7d', '#f5576c', '#00f2fe', '#feca57'][index % 5]
                      })`
                  }}>
                    <Globe size={24} />
                  </div>
                  <div className={styles.orgName}>
                    <h3>{org.name}</h3>
                    <span>ID: #{org.org_id}</span>
                  </div>
                </div>

                <div className={styles.orgStats}>
                  <div className={styles.orgStat}>
                    <FolderKanban size={18} />
                    <span>{org.project_count || 0} Projects</span>
                  </div>
                  <div className={styles.orgStat}>
                    <Users size={18} />
                    <span>{org.user_count || 0} Members</span>
                  </div>
                </div>

             
              </div>
            ))}
          </div>
        </section>

        {/* Insights Section */}
        <section id="insights" className={styles.insightsSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <Activity size={24} />
              Bug Tracking Insights
            </h2>
          </div>

          <div className={styles.insightsGrid}>
            {/* Rotating Tips */}
            <div className={styles.tipCard}>
              <div className={styles.tipHeader}>
                <PieChart size={20} />
                <span>Pro Tip</span>
              </div>
              <div className={styles.tipContent}>
                <div className={styles.tipIcon}>
                  {bugTrackerTips[currentTip].icon}
                </div>
                <h3>{bugTrackerTips[currentTip].title}</h3>
                <p>{bugTrackerTips[currentTip].content}</p>
              </div>
              <div className={styles.tipDots}>
                {bugTrackerTips.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.dot} ${currentTip === index ? styles.activeDot : ''}`}
                    onClick={() => setCurrentTip(index)}
                  />
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className={styles.factCard}>
              <div className={styles.factHeader}>
                <Zap size={20} />
                <span>Did You Know?</span>
              </div>
              <p className={styles.factContent}>{getRandomFact()}</p>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStatsCard}>
              <div className={styles.quickStatHeader}>
                <TrendingUp size={20} />
                <span>Platform Status</span>
              </div>
              <div className={styles.quickStatsList}>
                <div className={styles.quickStat}>
                  <CheckCircle size={16} color="#38ef7d" />
                  <span>All systems operational</span>
                </div>
                <div className={styles.quickStat}>
                  <Clock size={16} color="#fbbf24" />
                  <span>Last updated: Just now</span>
                </div>
                <div className={styles.quickStat}>
                  <Code2 size={16} color="#667eea" />
                  <span>Version: 2.0.1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default SuperAdminDashboard;