// TesterBugList.jsx - Updated with navigation
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./TesterBugList.module.css";
import { 
  Bug, 
  MessageCircle, 
  AlertCircle, 
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  FolderOpen,
  Eye,
  Calendar,
  User
} from "lucide-react";

function TesterBugList() {
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadBugs();
    }
  }, [user]);

  const loadBugs = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const res = await API.get(`/bugs/tester?tester=${user.user_id}`);
      setBugs(res.data);
    } catch (error) {
      console.error("Error loading bugs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'open':
        return <AlertCircle size={14} />;
      case 'in-progress':
        return <Clock size={14} />;
      case 'resolved':
        return <CheckCircle size={14} />;
      case 'closed':
        return <XCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open':
        return styles.statusOpen;
      case 'in-progress':
        return styles.statusProgress;
      case 'resolved':
        return styles.statusResolved;
      case 'closed':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  if (!user || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading your bugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Bug size={28} />
        </div>
        <h1>Your Reported Bugs</h1>
        <p className={styles.subtitle}>
          Welcome, {user.name}! Track and manage your bug reports
        </p>
      </div>

      {bugs.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FolderOpen size={48} />
          </div>
          <h3>No Bugs Reported</h3>
          <p>You haven't reported any bugs yet.</p>
          <button 
            className={styles.primaryBtn}
            onClick={() => navigate('/tester/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Bugs</span>
              <span className={styles.statValue}>{bugs.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Open</span>
              <span className={styles.statValue}>
                {bugs.filter(b => b.status === 'open').length}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>In Progress</span>
              <span className={styles.statValue}>
                {bugs.filter(b => b.status === 'in-progress').length}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Resolved</span>
              <span className={styles.statValue}>
                {bugs.filter(b => b.status === 'resolved').length}
              </span>
            </div>
          </div>

          {/* Table Header */}
          <div className={styles.tableHeader}>
            <div className={styles.colId}>Bug ID</div>
            <div className={styles.colTitle}>Title</div>
            <div className={styles.colAssignee}>Assigned To</div>
            <div className={styles.colDate}>Created</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colActions}>Actions</div>
          </div>

          <div className={styles.bugGrid}>
            {bugs.map((bug) => (
              <div 
                key={bug.bug_id} 
                className={styles.bugCard}
                onClick={() => navigate(`/tester/bug/${bug.bug_id}`)}
              >
                {/* Bug ID */}
                <div className={styles.colId}>
                  <span className={styles.bugId}>
                    <Bug size={12} />
                    #{bug.bug_id}
                  </span>
                  {bug.is_read === 0 && (
                    <span className={styles.newBadge}>
                      <Bell size={10} />
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className={styles.colTitle}>
                  <span className={styles.bugTitle}>{bug.title}</span>
                </div>

                {/* Assignee */}
                <div className={styles.colAssignee}>
                  {bug.developer_name ? (
                    <>
                      <User size={14} className={styles.userIcon} />
                      <span>{bug.developer_name}</span>
                    </>
                  ) : (
                    <span className={styles.unassigned}>Unassigned</span>
                  )}
                </div>

                {/* Date */}
                <div className={styles.colDate}>
                  <Calendar size={14} className={styles.dateIcon} />
                  <span>{new Date(bug.created_at).toLocaleDateString()}</span>
                </div>

                {/* Status */}
                <div className={styles.colStatus}>
                  <span className={`${styles.status} ${getStatusColor(bug.status)}`}>
                    {getStatusIcon(bug.status)}
                    {bug.status}
                  </span>
                </div>

                {/* Actions */}
                <div className={styles.colActions}>
                  <button
                    className={styles.viewBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tester/bug/${bug.bug_id}`);
                    }}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={bug.is_read === 0 ? styles.newMsgBtn : styles.chatBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/bug/${bug.bug_id}/chat`);
                    }}
                    title="Open Chat"
                  >
                    {bug.is_read === 0 ? <Bell size={16} /> : <MessageCircle size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className={styles.resultsInfo}>
            Showing {bugs.length} bug{bugs.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default TesterBugList;