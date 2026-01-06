import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import styles from "./AdminAssignProject.module.css";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Folder, 
  Users, 
  TestTube, 
  Code, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

function AdminAssignProject() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();
  const orgId = localStorage.getItem("org_id");
  const orgName = localStorage.getItem("org_name");

  useEffect(() => {
    if (!orgId) {
      alert("Please select organization first");
      navigate("/admin/select-organization");
      return;
    }
    loadProjects();
  }, [orgId, navigate]);

  useEffect(() => {
    if (projectId) {
      loadUsersWithAssignmentStatus();
    }
  }, [projectId]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/projects/org/${orgId}`);

      if (!res.data || res.data.length === 0) {
        alert("Please create project first");
        navigate("/admin/create-project");
        return;
      }

      setProjects(res.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsersWithAssignmentStatus = async () => {
    setIsLoading(true);
    try {
      // Get all users from this org
      const usersRes = await API.get(`/auth/users/access?org_id=${orgId}`);
      
      // ✅ Show all users from the org
      const orgUsers = usersRes.data;

      console.log("Org users:", orgUsers); // Debug log

      // Get users assigned to this project
      const assignedRes = await API.get(`/projects/${projectId}/users`);
      const assignedUserIds = assignedRes.data.map((u) => u.user_id);

      console.log("Assigned user IDs:", assignedUserIds); // Debug log

      // Merge the data
      const usersWithStatus = orgUsers.map((user) => ({
        ...user,
        id: user.user_id,
        is_assigned: assignedUserIds.includes(user.user_id),
      }));

      console.log("Users with status:", usersWithStatus); // Debug log

      setUsers(usersWithStatus);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUser = async (userId, role) => {
    try {
      await API.post("/projects/assign", {
        project_id: Number(projectId),
        users: [{ user_id: userId, role: role }],
      });
      alert("User assigned successfully!");
      loadUsersWithAssignmentStatus();
    } catch (error) {
      console.error("Error assigning user:", error);
      alert("Failed to assign user");
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the project?")) {
      return;
    }

    try {
      await API.post("/projects/unassign", {
        project_id: Number(projectId),
        user_id: userId,
      });
      alert("User removed successfully!");
      loadUsersWithAssignmentStatus();
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  const selectedProject = projects.find(
    (p) => p.project_id === parseInt(projectId)
  );

  if (isLoading && !projectId) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate("/admin/dashboard")} className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Users size={28} />
          </div>
          <div>
            <h1>Assign Team Members to Project</h1>
            <p>Manage project assignments for <strong>{orgName}</strong></p>
          </div>
        </div>
      </div>

      {/* Project Selection */}
      <div className={styles.projectSelection}>
        <label className={styles.projectLabel}>
          <Folder size={18} />
          Select Project:
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={styles.projectSelect}
        >
          <option value="">-- Choose a Project --</option>
          {projects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.project_name}
            </option>
          ))}
        </select>
        {selectedProject && (
          <span className={styles.selectedBadge}>
            <Folder size={16} />
            <strong>{selectedProject.project_name}</strong>
          </span>
        )}
      </div>

      {/* Show users only when project is selected */}
      {projectId && (
        <>
          {/* Filter Bar */}
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
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.noData}>
                        <XCircle size={48} />
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
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
                          {user.is_assigned ? (
                            <span className={styles.statusAssigned}>
                              <CheckCircle size={16} />
                              Assigned
                            </span>
                          ) : (
                            <span className={styles.statusNotAssigned}>
                              <XCircle size={16} />
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td>
                          {user.is_assigned ? (
                            <button
                              className={styles.removeBtn}
                              onClick={() => handleRemoveUser(user.id)}
                            >
                              Remove from Project
                            </button>
                          ) : (
                            <button
                              className={styles.assignBtn}
                              onClick={() => handleAssignUser(user.id, user.role)}
                            >
                              Assign to Project
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Empty state when no project selected */}
      {!projectId && (
        <div className={styles.emptyState}>
          <Folder size={64} className={styles.emptyIcon} />
          <h3>No Project Selected</h3>
          <p>Please select a project from the dropdown above to manage assignments</p>
        </div>
      )}
    </div>
  );
}

export default AdminAssignProject;