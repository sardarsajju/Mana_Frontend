// AdminUsers.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import styles from "./AdminUsers.module.css";
import { AuthContext } from "../context/AuthContext";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Code2,
  ClipboardList,
  X,
  AlertTriangle,
  Filter,
  RefreshCw,
  UserPlus,
  Plus
} from "lucide-react";

function AdminUsers() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tester"
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  // Get current org_id
  const currentOrgId = user?.org_id || localStorage.getItem("org_id");

  useEffect(() => {
    if (currentOrgId) {
      loadUsers();
    }
  }, [currentOrgId]); // Reload when org_id changes

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const orgId = localStorage.getItem("org_id");
    
    console.log("📤 Fetching users for org_id:", orgId);
    
    if (!orgId) {
      setError("Organization ID not found. Please login again.");
      setIsLoading(false);
      return;
    }

    // ✅ Send org_id as query parameter
    const res = await API.get(`/auth/admin/users?org_id=${orgId}`);
    
    console.log("📥 Received users:", res.data);
    
    setUsers(res.data);
  } catch (error) {
    console.error("❌ Error loading users:", error);
    setError("Failed to load users");
  } finally {
    setIsLoading(false);
  }
};

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "developer":
        return <Code2 size={16} />;
      case "tester":
        return <ClipboardList size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "developer":
        return styles.developerBadge;
      case "tester":
        return styles.testerBadge;
      default:
        return "";
    }
  };

  // Add User
  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "tester"
    });
    setFormError("");
    setFormSuccess("");
    setShowAddModal(true);
  };

const handleAddUser = async (e) => {
  e.preventDefault();
  setFormError("");
  setFormSuccess("");
  setFormLoading(true);

  try {
    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("All fields are required");
      setFormLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Please enter a valid email address");
      setFormLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      setFormLoading(false);
      return;
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      org_id: currentOrgId
    };

    await API.post("/auth/register", newUser);
    setFormSuccess("User created successfully!");
    setFormData({ name: "", email: "", password: "", role: "tester" });

    // Close modal after a short delay and reload users
    setTimeout(() => {
      setShowAddModal(false);
      setFormSuccess("");
      loadUsers();
    }, 1500);

  } catch (error) {
    console.error("Error adding user:", error);
    
    // Handle specific error cases
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message;
    const errorType = error.response?.data?.error;

    if (statusCode === 409 || errorType === "DUPLICATE_EMAIL" || errorType === "DUPLICATE_EMAIL_IN_ORG") {
      setFormError("⚠️ A user with this email already exists. Please use a different email address.");
    } else if (statusCode === 400) {
      setFormError(errorMessage || "Invalid data provided. Please check all fields.");
    } else if (statusCode === 401 || statusCode === 403) {
      setFormError("You don't have permission to add users.");
    } else if (statusCode === 500) {
      setFormError("Server error. Please try again later.");
    } else {
      setFormError(errorMessage || "Failed to create user. Please try again.");
    }
  } finally {
    setFormLoading(false);
  }
};

  // Edit User
  const openEditModal = (userData) => {
    setSelectedUser(userData);
    setFormData({
      name: userData.name,
      email: userData.email,
      password: "",
      role: userData.role
    });
    setFormError("");
    setFormSuccess("");
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if provided
      if (formData.password) {
        if (formData.password.length < 6) {
          setFormError("Password must be at least 6 characters");
          setFormLoading(false);
          return;
        }
        updateData.password = formData.password;
      }

      await API.put(`/auth/admin/users/${selectedUser.user_id}`, updateData);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "", role: "tester" });
      loadUsers();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to update user");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete User
  const openDeleteModal = (userData) => {
    setSelectedUser(userData);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    setFormLoading(true);
    try {
      await API.delete(`/auth/admin/users/${selectedUser.user_id}`);
      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setFormLoading(false);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setFormData({ name: "", email: "", password: "", role: "tester" });
    setFormError("");
    setFormSuccess("");
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
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
          <button onClick={loadUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <Users size={28} />
            User Management
          </h1>
          <p className={styles.subtitle}>
            Manage developers and testers in the system
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.addUserBtn} onClick={openAddModal}>
            <UserPlus size={20} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterWrapper}>
          <Filter size={20} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            <option value="developer">Developers</option>
            <option value="tester">Testers</option>
          </select>
        </div>

        <button onClick={loadUsers} className={styles.refreshButton}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Users size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.developerStat}`}>
          <Code2 size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {users.filter(u => u.role === 'developer').length}
            </span>
            <span className={styles.statLabel}>Developers</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.testerStat}`}>
          <ClipboardList size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {users.filter(u => u.role === 'tester').length}
            </span>
            <span className={styles.statLabel}>Testers</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.noData}>
                  <div className={styles.emptyState}>
                    <Users size={48} />
                    <p>No users found</p>
                    <button className={styles.addFirstUserBtn} onClick={openAddModal}>
                      <Plus size={18} />
                      Add Your First User
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((userData) => (
                <tr key={userData.user_id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.userName}>{userData.name}</span>
                    </div>
                  </td>
                  <td>{userData.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(userData.role)}`}>
                      {getRoleIcon(userData.role)}
                      {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    {new Date(userData.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditModal(userData)}
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => openDeleteModal(userData)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <UserPlus size={24} />
                Add New User
              </h2>
              <button className={styles.closeBtn} onClick={closeModals}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className={styles.form}>
              {formError && (
                <div className={styles.formError}>
                  <AlertTriangle size={16} />
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className={styles.formSuccess}>
                  <span>✓</span>
                  {formSuccess}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter password (min 6 characters)"
                  minLength={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="tester">Tester</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeModals} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                  {formLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <Edit2 size={24} />
                Edit User
              </h2>
              <button className={styles.closeBtn} onClick={closeModals}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditUser} className={styles.form}>
              {formError && (
                <div className={styles.formError}>
                  <AlertTriangle size={16} />
                  {formError}
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="tester">Tester</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeModals} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={formLoading}>
                  {formLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={`${styles.modal} ${styles.deleteModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteIcon}>
              <Trash2 size={48} />
            </div>
            <h2>Delete User</h2>
            <p>
              Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.deleteActions}>
              <button onClick={closeModals} className={styles.cancelBtn}>
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className={styles.confirmDeleteBtn}
                disabled={formLoading}
              >
                {formLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;