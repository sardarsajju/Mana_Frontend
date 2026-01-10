// AdminProjects.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import styles from "./AdminProjects.module.css";
import {
  FolderKanban,
  Building2,
  ChevronRight,
  Search,
  AlertTriangle,
  RefreshCw,
  Folder
} from "lucide-react";

function AdminProjects() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get current admin user
  const [organizations, setOrganizations] = useState([]);
  const [projectsByOrg, setProjectsByOrg] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Only load if user is available
    if (user && user.user_id) {
      loadOrganizationsAndProjects();
    }
  }, [user]);

  const loadOrganizationsAndProjects = async () => {
    if (!user || !user.user_id) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // ✅ FIXED: Get only organizations created by this admin
      const orgsRes = await API.get(`/organizations/organization/admin/${user.user_id}`);
      const orgs = orgsRes.data;
      setOrganizations(orgs);

      // Get projects for each organization
      const projectsData = {};
      for (const org of orgs) {
        try {
          const projectsRes = await API.get(`/projects/org/${org.org_id}`);
          projectsData[org.org_id] = projectsRes.data;
        } catch (err) {
          console.error(`Error loading projects for org ${org.org_id}:`, err);
          projectsData[org.org_id] = [];
        }
      }
      setProjectsByOrg(projectsData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load your organizations and projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (orgId, projectId) => {
    navigate(`/admin/projects/${orgId}/${projectId}/bugs`);
  };

  const filteredOrganizations = organizations.filter(org => {
    if (!searchTerm) return true;
    
    const matchesOrgName = org.org_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProjects = projectsByOrg[org.org_id]?.some(project =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesOrgName || matchesProjects;
  });

  // Show loading while checking authentication
  if (!user || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading your projects...</p>
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
          <button onClick={loadOrganizationsAndProjects} className={styles.retryButton}>
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
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FolderKanban size={28} />
            Your Projects
          </h1>
          <p className={styles.subtitle}>
            View projects in your organizations
          </p>
        </div>
        <button onClick={loadOrganizationsAndProjects} className={styles.refreshButton}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search your projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Organizations and Projects */}
      <div className={styles.organizationsWrapper}>
        {filteredOrganizations.length === 0 ? (
          <div className={styles.noData}>
            <Folder size={48} />
            <p>
              {organizations.length === 0 
                ? "You haven't created any organizations yet" 
                : "No organizations or projects match your search"}
            </p>
            {organizations.length === 0 && (
              <button 
                onClick={() => navigate('/admin/create-organization')} 
                className={styles.createButton}
              >
                Create Your First Organization
              </button>
            )}
          </div>
        ) : (
          filteredOrganizations.map((org) => {
            const projects = projectsByOrg[org.org_id] || [];
            const filteredProjects = searchTerm
              ? projects.filter(p => p.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
              : projects;

            if (searchTerm && filteredProjects.length === 0 && 
                !org.org_name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return null;
            }

            return (
              <div key={org.org_id} className={styles.orgCard}>
                <div className={styles.orgHeader}>
                  <div className={styles.orgInfo}>
                    <Building2 size={24} />
                    <div>
                      <h2 className={styles.orgName}>{org.org_name}</h2>
                      <p className={styles.projectCount}>
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.projectsList}>
                  {(searchTerm ? filteredProjects : projects).length === 0 ? (
                    <div className={styles.noProjects}>
                      <p>No projects in this organization</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/organizations/${org.org_id}/create-project`);
                        }}
                        className={styles.addProjectBtn}
                      >
                        Add Project
                      </button>
                    </div>
                  ) : (
                    (searchTerm ? filteredProjects : projects).map((project) => (
                      <div
                        key={project.project_id}
                        className={styles.projectCard}
                        onClick={() => handleProjectClick(org.org_id, project.project_id)}
                      >
                        <div className={styles.projectIcon}>
                          <FolderKanban size={20} />
                        </div>
                        <div className={styles.projectInfo}>
                          <h3 className={styles.projectName}>{project.project_name}</h3>
                          {project.created_at && (
                            <p className={styles.projectMeta}>
                              Created {new Date(project.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminProjects;