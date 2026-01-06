import React, { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./TesterDashboard.module.css";
import { 
  FolderOpen, 
  Bug, 
  ArrowRight, 
  ClipboardList,
  AlertCircle 
} from "lucide-react";

function TesterDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) {
      console.warn("User not loaded yet");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ FIXED: Use user.user_id
      const res = await API.get(`/projects/tester?tester=${user.user_id}`);
      setProjects(res.data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <ClipboardList size={32} />
        </div>
        <h1>Tester Dashboard</h1>
        <p className={styles.subtitle}>
          Welcome back, {user.name || "Tester"}! Select a project to report bugs.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FolderOpen size={48} />
          </div>
          <h3>No Projects Assigned</h3>
          <p>You haven't been assigned to any projects yet.</p>
          <p className={styles.emptySubtext}>
            Contact your administrator for project assignments.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Projects</span>
              <span className={styles.statValue}>{projects.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Active</span>
              <span className={styles.statValue}>{projects.length}</span>
            </div>
          </div>

          <div className={styles.cardGrid}>
            {projects.map((p) => (
              <div
                key={p.project_id}
                className={styles.projectCard}
                onClick={() => navigate(`/raise-bug/${p.project_id}`)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.projectIcon}>
                    <FolderOpen size={24} />
                  </div>
                  <div className={styles.cardBadge}>Active</div>
                </div>
                
                <div className={styles.cardBody}>
                  <h3 className={styles.projectName}>{p.project_name}</h3>
                  <p className={styles.projectId}>Project ID: #{p.project_id}</p>
                </div>

                <div className={styles.cardFooter}>
                  <button className={styles.reportBtn}>
                    <Bug size={16} />
                    Report Bug
                    <ArrowRight size={16} />
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

export default TesterDashboard;