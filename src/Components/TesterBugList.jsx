// Updated TesterBugList.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../Components/TesterBugList.module.css";
import RichTextViewer from "../Components/RichTextViewer";
import { 
  Bug, 
  MessageCircle, 
  AlertCircle, 
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Bell,
  FolderOpen
} from "lucide-react";

function TesterBugList() {
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Only load if user exists
    if (user) {
      loadBugs();
    }
  }, [user]);  // ✅ Add user as dependency

  const loadBugs = async () => {
    if (!user) return;  // ✅ Guard clause
    
    setIsLoading(true);
    try {
      // ✅ FIXED: Use user.user_id instead of user.id
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
        return <AlertCircle size={16} />;
      case 'in-progress':  // ✅ Fixed: use hyphen to match DB enum
        return <Clock size={16} />;
      case 'resolved':
        return <CheckCircle size={16} />;
      case 'closed':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open':
        return styles.statusOpen;
      case 'in-progress':  // ✅ Fixed: use hyphen to match DB enum
        return styles.statusProgress;
      case 'resolved':
        return styles.statusResolved;
      case 'closed':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  // ✅ Show loading while user is being fetched
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
          <Bug size={32} />
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
              <span className={styles.statLabel}>Resolved</span>
              <span className={styles.statValue}>
                {bugs.filter(b => b.status === 'resolved').length}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Unread</span>
              <span className={styles.statValue}>
                {bugs.filter(b => b.is_read === 0).length}
              </span>
            </div>
          </div>

          <div className={styles.bugGrid}>
            {bugs.map((bug) => (
              <div key={bug.bug_id} className={styles.bugCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.bugId}>
                    <Bug size={16} />
                    <span>Bug #{bug.bug_id}</span>
                  </div>
                  {bug.is_read === 0 && (
                    <span className={styles.newBadge}>
                      <Bell size={14} />
                      New
                    </span>
                  )}
                </div>

                <h3 className={styles.bugTitle}>{bug.title}</h3>
                
                <div className={styles.bugDescription}>
                  <RichTextViewer content={bug.description} />
                </div>

                {bug.screenshot && (
                  <div className={styles.screenshotWrapper}>
                    <ImageIcon size={16} />
                    <img
                      src={`http://localhost:5000/uploads/${bug.screenshot}`}
                      className={styles.screenshot}
                      alt="Bug Screenshot"
                      onClick={() => window.open(`http://localhost:5000/uploads/${bug.screenshot}`, '_blank')}
                    />
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <div className={`${styles.status} ${getStatusColor(bug.status)}`}>
                    {getStatusIcon(bug.status)}
                    <span>{bug.status}</span>
                  </div>
                  
                  <button
                    className={bug.is_read === 0 ? styles.newMsgBtn : styles.chatBtn}
                    onClick={() => navigate(`/bug/${bug.bug_id}/chat`)}
                  >
                    {bug.is_read === 0 ? (
                      <>
                        <Bell size={16} />
                        New Message
                      </>
                    ) : (
                      <>
                        <MessageCircle size={16} />
                        Open Chat
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TesterBugList;