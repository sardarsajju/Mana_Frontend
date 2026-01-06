import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, 
  TestTube, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Folder,
  Bug,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3
} from "lucide-react";
import styles from "../Components/ManageAccess.module.css";

function ManageAccess() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedUser, setExpandedUser] = useState(null);
  const orgId = localStorage.getItem("org_id");
  const orgName = localStorage.getItem("org_name");

  useEffect(() => {
    if (!orgId) {
      navigate("/admin/select-organization");
      return;
    }
    fetchUsers();
  }, [orgId, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/auth/users/stats?org_id=${orgId}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Users size={32} />
          </div>
          <div>
            <h1>Manage Employee Access</h1>
            <p>
              Overview and statistics for <strong>{orgName}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className={styles.filterBar}>
        <button
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          <Users size={18} />
          <span>All ({users.length})</span>
        </button>
        <button
          className={filter === "tester" ? styles.active : ""}
          onClick={() => setFilter("tester")}
        >
          <TestTube size={18} />
          <span>Testers ({users.filter((u) => u.role === "tester").length})</span>
        </button>
        <button
          className={filter === "developer" ? styles.active : ""}
          onClick={() => setFilter("developer")}
        >
          <Code size={18} />
          <span>Developers ({users.filter((u) => u.role === "developer").length})</span>
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Role</th>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    <AlertCircle size={48} />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.user_id}>
                    <tr className={styles.mainRow}>
                      <td>
                        <div className={styles.nameCell}>
                          <button
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(user.user_id)}
                          >
                            {expandedUser === user.user_id ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                          <div className={styles.userAvatar}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={styles.roleBadge}>
                          {user.role === "tester" ? (
                            <TestTube size={14} />
                          ) : (
                            <Code size={14} />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={styles.projectCount}>
                          <Folder size={16} />
                          {user.project_count || 0} project
                          {user.project_count !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedUser === user.user_id && (
                      <tr className={styles.expandedRow}>
                        <td colSpan="4">
                          <div className={styles.expandedContent}>
                            <div className={styles.detailSection}>
                              <h4>
                                <Folder size={18} />
                                Assigned Projects
                              </h4>
                              {user.assigned_projects ? (
                                <div className={styles.projectList}>
                                  {user.assigned_projects
                                    .split(", ")
                                    .map((project, idx) => (
                                      <span
                                        key={idx}
                                        className={styles.projectBadge}
                                      >
                                        <Folder size={14} />
                                        {project}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                <p className={styles.noProjects}>
                                  <AlertCircle size={18} />
                                  No projects assigned yet
                                </p>
                              )}
                            </div>

                            <div className={styles.detailSection}>
                              <h4>
                                {user.role === "tester" ? (
                                  <>
                                    <Bug size={18} />
                                    Bug Statistics
                                  </>
                                ) : (
                                  <>
                                    <BarChart3 size={18} />
                                    Development Statistics
                                  </>
                                )}
                              </h4>
                              {user.role === "tester" ? (
                                <div className={styles.statGrid}>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <Bug size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.bugs_raised || 0}
                                    </span>
                                    <span className={styles.statLabel}>
                                      Total Bugs Raised
                                    </span>
                                  </div>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <Folder size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.project_count || 0}
                                    </span>
                                    <span className={styles.statLabel}>
                                      Active Projects
                                    </span>
                                  </div>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <TrendingUp size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.project_count > 0
                                        ? (user.bugs_raised / user.project_count).toFixed(1)
                                        : 0}
                                    </span>
                                    <span className={styles.statLabel}>
                                      Bugs per Project
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className={styles.statGrid}>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <CheckCircle size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.bugs_resolved || 0}
                                    </span>
                                    <span className={styles.statLabel}>
                                      Bugs Resolved
                                    </span>
                                  </div>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <Bug size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.total_assigned_bugs || 0}
                                    </span>
                                    <span className={styles.statLabel}>
                                      Total Assigned
                                    </span>
                                  </div>
                                  <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                      <TrendingUp size={24} />
                                    </div>
                                    <span className={styles.statValue}>
                                      {user.total_assigned_bugs > 0
                                        ? Math.round(
                                            (user.bugs_resolved /
                                              user.total_assigned_bugs) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </span>
                                    <span className={styles.statLabel}>
                                      Resolution Rate
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageAccess;