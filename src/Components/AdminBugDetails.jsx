// AdminBugDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import styles from "./AdminBugDetail.module.css";
import RichTextViewer from "../Components/RichTextViewer";
import {
  ArrowLeft,
  Bug,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Building2,
  FolderKanban,
  MessageSquare,
  Paperclip,
  Code2,
  ClipboardList,
  Shield,
  AlertTriangle,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";

function AdminBugDetail() {
  const { bugId } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBugDetails();
  }, [bugId]);

  const loadBugDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get bug details
      const bugRes = await API.get(`/bugs/${bugId}`);
      setBug(bugRes.data);

      // Get comments
      try {
        const commentsRes = await API.get(`/bugs/comments/${bugId}`);
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error("Error loading comments:", err);
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading bug details:", error);
      setError("Failed to load bug details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return styles.statusOpen;
      case "in-progress":
        return styles.statusInProgress;
      case "resolved":
        return styles.statusResolved;
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <Clock size={20} />;
      case "in-progress":
        return <TrendingUp size={20} />;
      case "resolved":
        return <CheckCircle size={20} />;
      default:
        return <Bug size={20} />;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return styles.priorityLow;
      case "medium":
        return styles.priorityMedium;
      case "high":
        return styles.priorityHigh;
      case "critical":
        return styles.priorityCritical;
      default:
        return "";
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case "minor":
        return styles.severityMinor;
      case "major":
        return styles.severityMajor;
      case "critical":
        return styles.severityCritical;
      default:
        return "";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield size={16} />;
      case "developer":
        return <Code2 size={16} />;
      case "tester":
        return <ClipboardList size={16} />;
      default:
        return <User size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading bug details...</p>
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
          <button onClick={loadBugDetails} className={styles.retryButton}>
            <RefreshCw size={20} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <Bug size={48} />
          <p>Bug not found</p>
          <button onClick={() => navigate(-1)} className={styles.retryButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back
        </button>
        <button onClick={loadBugDetails} className={styles.refreshButton}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      <div className={styles.contentWrapper}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Bug Title */}
          <div className={styles.titleSection}>
            <div className={styles.titleHeader}>
              <div className={styles.bugIconWrapper}>
                <Bug size={32} />
              </div>
              <div>
                <h1 className={styles.bugTitle}>{bug.title}</h1>
                <div className={styles.bugMeta}>
                  <span className={styles.bugId}>#{bug.bug_id}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.dateInfo}>
                    <Calendar size={14} />
                    Reported on {new Date(bug.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project and Organization Info */}
          <div className={styles.projectInfo}>
            <div className={styles.infoItem}>
              <Building2 size={18} />
              <div>
                <span className={styles.infoLabel}>Organization</span>
                <span className={styles.infoValue}>{bug.org_name || 'N/A'}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FolderKanban size={18} />
              <div>
                <span className={styles.infoLabel}>Project</span>
                <span className={styles.infoValue}>{bug.project_name || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MessageSquare size={20} />
              Description
            </h2>
            <div className={styles.description}>
              {bug.description ? (
                <RichTextViewer content={bug.description} />
              ) : (
                <p className={styles.noContent}>No description provided</p>
              )}
            </div>
          </div>

          {/* Steps to Reproduce */}
          {bug.steps_to_reproduce && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <ClipboardList size={20} />
                Steps to Reproduce
              </h2>
              <div className={styles.stepsContent}>
                <RichTextViewer content={bug.steps_to_reproduce} />
              </div>
            </div>
          )}

          {/* Expected vs Actual Results */}
          <div className={styles.resultsSection}>
            {bug.expected_result && (
              <div className={`${styles.resultBox} ${styles.expectedBox}`}>
                <h3 className={styles.resultTitle}>
                  <CheckCircle size={18} />
                  Expected Result
                </h3>
                <div className={styles.resultText}>
                  <RichTextViewer content={bug.expected_result} />
                </div>
              </div>
            )}
            {bug.actual_result && (
              <div className={`${styles.resultBox} ${styles.actualBox}`}>
                <h3 className={styles.resultTitle}>
                  <AlertCircle size={18} />
                  Actual Result
                </h3>
                <div className={styles.resultText}>
                  <RichTextViewer content={bug.actual_result} />
                </div>
              </div>
            )}
          </div>

          {/* Screenshot */}
          {bug.screenshot && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <ImageIcon size={20} />
                Screenshot
              </h2>
              <div className={styles.screenshotWrapper}>
                <img 
                  src={`http://localhost:5000/uploads/${bug.screenshot}`} 
                  alt="Bug screenshot" 
                  className={styles.screenshot}
                  onClick={() => window.open(`http://localhost:5000/uploads/${bug.screenshot}`, '_blank')}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className={styles.screenshotError} style={{ display: 'none' }}>
                  <ImageIcon size={32} />
                  <p>Screenshot not available</p>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MessageSquare size={20} />
              Comments ({comments.length})
            </h2>
            <div className={styles.commentsWrapper}>
              {comments.length === 0 ? (
                <div className={styles.noComments}>
                  <MessageSquare size={32} />
                  <p>No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.comment_id} className={styles.comment}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <div className={styles.authorAvatar}>
                          {comment.sender_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className={styles.authorName}>
                            {comment.sender_name || 'Unknown User'}
                            <span className={`${styles.roleBadge} ${styles[`role${comment.sender_role}`]}`}>
                              {getRoleIcon(comment.sender_role)}
                              {comment.sender_role}
                            </span>
                          </div>
                          <div className={styles.commentDate}>
                            {new Date(comment.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.commentContent}>
                      <RichTextViewer content={comment.message} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Status Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Status Information</h3>
            <div className={styles.cardContent}>
              <div className={styles.cardItem}>
                <span className={styles.cardLabel}>Current Status</span>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(bug.status)}`}>
                  {getStatusIcon(bug.status)}
                  {bug.status}
                </span>
              </div>
              {bug.priority && (
                <div className={styles.cardItem}>
                  <span className={styles.cardLabel}>Priority</span>
                  <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(bug.priority)}`}>
                    {bug.priority}
                  </span>
                </div>
              )}
              {bug.severity && (
                <div className={styles.cardItem}>
                  <span className={styles.cardLabel}>Severity</span>
                  <span className={`${styles.severityBadge} ${getSeverityBadgeClass(bug.severity)}`}>
                    {bug.severity}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* People Involved Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>People Involved</h3>
            <div className={styles.cardContent}>
              {/* Tester/Reporter */}
              <div className={styles.personCard}>
                <div className={styles.personHeader}>
                  <ClipboardList size={18} className={styles.roleIconLarge} />
                  <span className={styles.personRole}>Reported By</span>
                </div>
                <div className={styles.personInfo}>
                  <div className={styles.personAvatar}>
                    {bug.tester_name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                  <div className={styles.personDetails}>
                    <div className={styles.personName}>
                      {bug.tester_name || 'Unknown Tester'}
                    </div>
                    {bug.tester_email && (
                      <div className={styles.personEmail}>{bug.tester_email}</div>
                    )}
                    <div className={styles.personLabel}>Tester</div>
                  </div>
                </div>
              </div>

              {/* Developer/Assignee */}
              <div className={styles.personCard}>
                <div className={styles.personHeader}>
                  <Code2 size={18} className={styles.roleIconLarge} />
                  <span className={styles.personRole}>Assigned To</span>
                </div>
                {bug.assigned_to ? (
                  <div className={styles.personInfo}>
                    <div className={styles.personAvatar}>
                      {bug.developer_name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div className={styles.personDetails}>
                      <div className={styles.personName}>
                        {bug.developer_name || 'Developer'}
                      </div>
                      {bug.developer_email && (
                        <div className={styles.personEmail}>{bug.developer_email}</div>
                      )}
                      <div className={styles.personLabel}>Developer</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.unassigned}>
                    <User size={24} />
                    <span>Unassigned</span>
                    <small>Available to all developers</small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Timeline</h3>
            <div className={styles.cardContent}>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineIcon}>
                    <Bug size={16} />
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTitle}>Bug Reported</div>
                    <div className={styles.timelineDate}>
                      {new Date(bug.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                {bug.updated_at && bug.updated_at !== bug.created_at && (
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>
                      <RefreshCw size={16} />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>Last Updated</div>
                      <div className={styles.timelineDate}>
                        {new Date(bug.updated_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          {(bug.browser || bug.os || bug.version) && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Environment</h3>
              <div className={styles.cardContent}>
                {bug.browser && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoRowLabel}>Browser</span>
                    <span className={styles.infoRowValue}>{bug.browser}</span>
                  </div>
                )}
                {bug.os && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoRowLabel}>OS</span>
                    <span className={styles.infoRowValue}>{bug.os}</span>
                  </div>
                )}
                {bug.version && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoRowLabel}>Version</span>
                    <span className={styles.infoRowValue}>{bug.version}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBugDetail;