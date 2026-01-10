import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import styles from "../Components/BugList.module.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RichTextViewer from "../Components/RichTextViewer";
import {
  Bug,
  MessageCircle,
  Filter,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Code2,
  Image as ImageIcon,
  FolderOpen,
  Search,
  X
} from "lucide-react";

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Only load if user exists
    if (user) {
      loadBugs();
    }
  }, [user, filter]);  // ✅ Add user as dependency

  const loadBugs = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // ✅ FIXED: Use user.user_id instead of user.id
      const res = await API.get(`/bugs/all?dev=${user.user_id}&filter=${filter}`);
      console.log("Bugs loaded:", res.data);  // Debug
      setBugs(res.data);
    } catch (error) {
      console.error("Error loading bugs:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status, e) => {
    e.stopPropagation();
    try {
      // ✅ FIXED: Use user.user_id
      await API.put(`/bugs/update/${id}`, {
        status,
        developer_id: user.user_id
      });
      loadBugs();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle size={16} />;
      case "in-progress":
        return <Clock size={16} />;
      case "resolved":
        return <CheckCircle size={16} />;
      default:
        return <Bug size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return styles.statusOpen;
      case "in-progress":
        return styles.statusProgress;
      case "resolved":
        return styles.statusResolved;
      default:
        return "";
    }
  };

  // Filter bugs based on search term
  const filteredBugs = bugs.filter((bug) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      bug.title.toLowerCase().includes(searchLower) ||
      bug.description.toLowerCase().includes(searchLower) ||
      bug.tester_name.toLowerCase().includes(searchLower) ||
      bug.status.toLowerCase().includes(searchLower) ||
      `bug #${bug.bug_id}`.includes(searchLower)
    );
  });

  // ✅ Show loading while user is being fetched
  if (!user || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading bugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Code2 size={32} />
        </div>
        <h1>Developer Dashboard</h1>
        <p className={styles.subtitle}>
          Welcome, {user.name}! Manage and resolve reported bugs
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.filterWrapper}>
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Bugs</option>
            <option value="assigned">Assigned to Me</option>
          </select>
        </div>
        
        {/* Search Input */}
        <div className={styles.searchWrapper}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchTerm("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>Total</span>
            <strong>{bugs.length}</strong>
          </div>
          <div className={styles.statItem}>
            <span>Open</span>
            <strong>{bugs.filter(b => b.status === "open").length}</strong>
          </div>
          <div className={styles.statItem}>
            <span>In Progress</span>
            <strong>{bugs.filter(b => b.status === "in-progress").length}</strong>
          </div>
          <div className={styles.statItem}>
            <span>Resolved</span>
            <strong>{bugs.filter(b => b.status === "resolved").length}</strong>
          </div>
        </div>
      </div>

      {/* Bug Grid */}
      {bugs.length === 0 ? (
        <div className={styles.emptyState}>
          <FolderOpen size={48} />
          <h3>No Bugs Found</h3>
          <p>No bugs have been assigned to your projects yet.</p>
        </div>
      ) : filteredBugs.length === 0 ? (
        <div className={styles.emptyState}>
          <Search size={48} />
          <h3>No Matching Bugs</h3>
          <p>No bugs match your search criteria. Try a different search term.</p>
          <button 
            className={styles.clearSearchBtn} 
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className={styles.bugGrid}>
          {filteredBugs.map((bug) => (
            <div
              key={bug.bug_id}
              className={styles.bugCard}
              onClick={() => navigate(`/bug/${bug.bug_id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* Header */}
              <div className={styles.cardHeader}>
                <div className={styles.bugMeta}>
                  <span className={styles.bugId}>
                    <Bug size={16} /> Bug #{bug.bug_id}
                  </span>

                  {bug.is_read === 0 && (
                    <span className={styles.newBadge}>
                      <Bell size={14} /> New
                    </span>
                  )}
                </div>

                <div className={`${styles.statusBadge} ${getStatusClass(bug.status)}`}>
                  {getStatusIcon(bug.status)}
                  <span>{bug.status}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className={styles.bugTitle}>{bug.title}</h3>

              {/* Description */}
              <div className={styles.bugDescription}>
                <RichTextViewer content={bug.description} />
              </div>

              {/* Screenshot */}
              {bug.screenshot && (
                <div className={styles.screenshotWrapper}>
                  <ImageIcon size={16} />
                  <img
                    src={`http://localhost:5000/uploads/${bug.screenshot}`}
                    alt="Bug Screenshot"
                    className={styles.screenshot}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `http://localhost:5000/uploads/${bug.screenshot}`,
                        "_blank"
                      );
                    }}
                  />
                </div>
              )}

              {/* Tester */}
              <div className={styles.testerInfo}>
                <User size={16} />
                <span>Reported by <strong>{bug.tester_name}</strong></span>
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                <button
                  className={bug.is_read === 0 ? styles.newMsgBtn : styles.chatBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/bug/${bug.bug_id}/chat`);
                  }}
                >
                  <MessageCircle size={16} />
                  {bug.is_read === 0 ? "New Message" : "Open Chat"}
                </button>

                <div
                  className={styles.statusSelect}
                  onClick={(e) => e.stopPropagation()}
                >
                  <label>Status:</label>
                  <select
                    value={bug.status}
                    onChange={(e) =>
                      updateStatus(bug.bug_id, e.target.value, e)
                    }
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BugList;