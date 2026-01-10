// AdminProjectBugs.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import styles from "./AdminProjectBugs.module.css";
import RichTextViewer from "../Components/RichTextViewer";
import {
  Bug,
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle,
  User,
  Calendar,
  AlertCircle,
  Eye,
  FolderOpen,
  TrendingUp
} from "lucide-react";

function AdminProjectBugs() {
  const { orgId, projectId } = useParams();
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadProjectAndBugs();
  }, [orgId, projectId]);

  const loadProjectAndBugs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projectRes = await API.get(`/projects/details/${projectId}`);
      setProjectInfo(projectRes.data);

      const bugsRes = await API.get(`/bugs/admin/project/${orgId}/${projectId}`);
      setBugs(bugsRes.data);
    } catch (error) {
      console.error("Error loading bugs:", error);
      setError("Failed to load project bugs");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <AlertCircle size={14} />;
      case "in-progress":
        return <Clock size={14} />;
      case "resolved":
        return <CheckCircle size={14} />;
      default:
        return <Bug size={14} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
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

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      !searchTerm ||
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || bug.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(b => b.status?.toLowerCase() === "open").length;
  const inProgressBugs = bugs.filter(b => b.status?.toLowerCase() === "in-progress").length;
  const resolvedBugs = bugs.filter(b => b.status?.toLowerCase() === "resolved").length;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading bugs...</p>
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
          <button onClick={loadProjectAndBugs} className={styles.retryButton}>
            <RefreshCw size={20} />
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
        <button onClick={() => navigate("/admin/projects")} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        <div className={styles.headerInfo}>
          <div className={styles.headerIcon}>
            <Bug size={24} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              {projectInfo?.project_name || "Project"} - Bugs
            </h1>
            <p className={styles.subtitle}>
              Manage and track all bugs for this project
            </p>
          </div>
        </div>

        <button onClick={loadProjectAndBugs} className={styles.refreshButton}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className={styles.mainContent}>
        {/* Left Side - Bug List */}
        <div className={styles.leftSection}>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search bugs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterWrapper}>
              <Filter size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Bug List Table */}
          <div className={styles.bugTableWrapper}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
              <div className={styles.colId}>Bug ID</div>
              <div className={styles.colTitle}>Bug Title</div>
              <div className={styles.colReporter}>Reported By</div>
              <div className={styles.colAssignee}>Assigned To</div>
              <div className={styles.colDate}>Created At</div>
              <div className={styles.colStatus}>Status</div>
            </div>

            {/* Bug List */}
            {filteredBugs.length === 0 ? (
              <div className={styles.emptyState}>
                <FolderOpen size={40} />
                <h3>No Bugs Found</h3>
                <p>No bugs match your search criteria.</p>
              </div>
            ) : (
              <div className={styles.bugList}>
                {filteredBugs.map((bug) => (
                  <div
                    key={bug.bug_id}
                    className={styles.bugRow}
                    onClick={() => navigate(`/admin/bugs/${bug.bug_id}`)}
                  >
                    {/* Bug ID */}
                    <div className={styles.colId}>
                      <span className={styles.bugIdBadge}>
                        <Bug size={12} />
                        #{bug.bug_id}
                      </span>
                    </div>

                    {/* Title */}
                    <div className={styles.colTitle}>
                      <span className={styles.bugTitle}>{bug.title}</span>
                    </div>

                    {/* Reporter */}
                    <div className={styles.colReporter}>
                      <User size={14} className={styles.userIcon} />
                      <span>{bug.tester_name || "Unknown"}</span>
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
                      <span className={`${styles.statusBadge} ${getStatusClass(bug.status)}`}>
                        {getStatusIcon(bug.status)}
                        {bug.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className={styles.resultsInfo}>
            Showing {filteredBugs.length} of {totalBugs} bugs
          </div>
        </div>

        {/* Right Side - Bug Statistics */}
        <div className={styles.rightSection}>
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <TrendingUp size={20} />
              <h3>Bug Statistics</h3>
            </div>

            <div className={styles.statsBody}>
              {/* Total */}
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <Bug size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Total Bugs</span>
                  <span className={styles.statValue}>{totalBugs}</span>
                </div>
              </div>

              {/* Open */}
              <div className={`${styles.statItem} ${styles.statOpen}`}>
                <div className={styles.statIcon}>
                  <AlertCircle size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Open</span>
                  <span className={styles.statValue}>{openBugs}</span>
                </div>
                <div className={styles.statPercent}>
                  {totalBugs > 0 ? Math.round((openBugs / totalBugs) * 100) : 0}%
                </div>
              </div>

              {/* In Progress */}
              <div className={`${styles.statItem} ${styles.statInProgress}`}>
                <div className={styles.statIcon}>
                  <Clock size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>In Progress</span>
                  <span className={styles.statValue}>{inProgressBugs}</span>
                </div>
                <div className={styles.statPercent}>
                  {totalBugs > 0 ? Math.round((inProgressBugs / totalBugs) * 100) : 0}%
                </div>
              </div>

              {/* Resolved */}
              <div className={`${styles.statItem} ${styles.statResolved}`}>
                <div className={styles.statIcon}>
                  <CheckCircle size={20} />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Resolved</span>
                  <span className={styles.statValue}>{resolvedBugs}</span>
                </div>
                <div className={styles.statPercent}>
                  {totalBugs > 0 ? Math.round((resolvedBugs / totalBugs) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                <span>Resolution Progress</span>
                <span>{totalBugs > 0 ? Math.round((resolvedBugs / totalBugs) * 100) : 0}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${totalBugs > 0 ? (resolvedBugs / totalBugs) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProjectBugs;