// AdminProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import styles from "./AdminProfile.module.css";
import { AuthContext } from "../context/AuthContext";
import { 
  User, 
  Calendar, 
  FolderKanban, 
  Users,
  Award,
  Activity,
  Shield,
  Code2,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Building2,
  Bug,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function AdminProfile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Collapse/Expand states
  const [isTeamOverviewOpen, setIsTeamOverviewOpen] = useState(true);
  const [isProjectStatsOpen, setIsProjectStatsOpen] = useState(true);

  // Get org_id from localStorage or user context
  const orgId = localStorage.getItem("org_id") || user?.org_id;

  useEffect(() => {
    if (user && user.user_id && orgId) {
      loadProfileAndStats();
    }
  }, [user, orgId]);

  const loadProfileAndStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("📤 Loading profile and stats for org_id:", orgId);

      const [profileRes, statsRes, projectStatsRes] = await Promise.all([
        API.get(`/auth/admin/profile/${user.user_id}`),
        API.get(`/auth/admin/system-stats?org_id=${orgId}`),
        API.get(`/auth/admin/project-stats?org_id=${orgId}`)
      ]);

      console.log("📥 Profile:", profileRes.data);
      console.log("📥 Stats:", statsRes.data);
      console.log("📥 Project Stats:", projectStatsRes.data);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setProjectStats(projectStatsRes.data);
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <AlertTriangle size={48} />
          <p>Organization not found. Please login again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <AlertTriangle size={48} />
          <p>{error}</p>
          <button onClick={loadProfileAndStats} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <p>Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {profile.name?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className={styles.badge}>
              <Shield size={16} />
              Administrator
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <User size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{profile.name || user.name}</span>
            </div>
          </div>

          {/* Organization Info */}
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Building2 size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Organization</span>
              <span className={styles.value}>{profile.org_name || 'N/A'}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <Calendar size={18} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.label}>Member Since</span>
              <span className={styles.value}>
                {profile.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats - Collapsible */}
      {stats && (
        <div className={styles.statsCard}>
          <div className={styles.collapsibleHeader}>
            <h2 className={styles.sectionTitle}>
              <Users size={20} />
              Team Overview
            </h2>
            <button 
              className={styles.collapseButton}
              onClick={() => setIsTeamOverviewOpen(!isTeamOverviewOpen)}
              aria-label={isTeamOverviewOpen ? "Collapse section" : "Expand section"}
            >
              {isTeamOverviewOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          <div className={`${styles.collapsibleContent} ${isTeamOverviewOpen ? styles.open : styles.closed}`}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.userIcon}`}>
                  <Users size={24} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total_users || 0}</span>
                  <span className={styles.statLabel}>Total Users</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.devIcon}`}>
                  <Code2 size={24} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total_developers || 0}</span>
                  <span className={styles.statLabel}>Developers</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.testerIcon}`}>
                  <ClipboardList size={24} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total_testers || 0}</span>
                  <span className={styles.statLabel}>Testers</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.projectIcon}`}>
                  <FolderKanban size={24} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.total_projects || 0}</span>
                  <span className={styles.statLabel}>Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project-wise Stats - Collapsible */}
      {projectStats && projectStats.length > 0 && (
        <div className={styles.statsCard}>
          <div className={styles.collapsibleHeader}>
            <h2 className={styles.sectionTitle}>
              <FolderKanban size={20} />
              Project-wise Statistics
            </h2>
            <button 
              className={styles.collapseButton}
              onClick={() => setIsProjectStatsOpen(!isProjectStatsOpen)}
              aria-label={isProjectStatsOpen ? "Collapse section" : "Expand section"}
            >
              {isProjectStatsOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          <div className={`${styles.collapsibleContent} ${isProjectStatsOpen ? styles.open : styles.closed}`}>
            <div className={styles.projectsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Total Bugs</th>
                    <th>Open</th>
                    <th>In Progress</th>
                    <th>Resolved</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {projectStats.map((project) => (
                    <tr key={project.project_id}>
                      <td>
                        <div className={styles.projectName}>
                          <FolderKanban size={16} />
                          {project.project_name}
                        </div>
                      </td>
                      <td>{project.total_bugs}</td>
                      <td>
                        <span className={styles.openBadge}>{project.open_bugs}</span>
                      </td>
                      <td>
                        <span className={styles.progressBadge}>{project.in_progress_bugs}</span>
                      </td>
                      <td>
                        <span className={styles.resolvedBadge}>{project.resolved_bugs}</span>
                      </td>
                      <td>
                        <div className={styles.miniProgress}>
                          <div 
                            className={styles.miniProgressFill}
                            style={{
                              width: `${project.total_bugs > 0 
                                ? (project.resolved_bugs / project.total_bugs) * 100 
                                : 0}%`
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className={styles.actionsCard}>
        <h2 className={styles.sectionTitle}>
          <Award size={20} />
          Quick Actions
        </h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/dashboard" className={styles.actionButton}>
            <Activity size={20} /> 
            <span>Dashboard</span>
          </a>
          <a href="/admin/users" className={styles.actionButton}>
            <Users size={20} />
            <span>Manage Users</span>
          </a>
          <a href="/admin/projects" className={styles.actionButton}>
            <FolderKanban size={20} />
            <span>View All Projects</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;