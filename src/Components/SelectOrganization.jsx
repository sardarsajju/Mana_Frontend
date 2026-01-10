import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Navbar from "./Navbar"; // Import the regular Navbar
import {
  Building2,
  Plus,
  ChevronRight,
  Loader2,
  FolderOpen,
} from "lucide-react";
import "../Components/SelectOrganization.css";

function SelectOrganization() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredOrg, setHoveredOrg] = useState(null);
  
  const navigate = useNavigate();

  const adminId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name") || "Admin";

  useEffect(() => {
    localStorage.removeItem("org_id");
    localStorage.removeItem("org_name");

    API.get(`/bugs/organization/admin/${adminId}`)
      .then((res) => {
        setOrgs(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  const handleOrgClick = (org) => {
    // Directly set organization and navigate to dashboard
    localStorage.setItem("org_id", org.org_id);
    localStorage.setItem("org_name", org.org_name);
    localStorage.setItem("user_role", "admin");
    
    console.log("Selected organization:", org);
    
    // Navigate to admin dashboard
    navigate("/admin/dashboard");
  };

  return (
    <div className="select-org-page">
      {/* Navbar - will automatically show minimal version */}
      <Navbar />

      {/* Background Elements */}
      <div className="background-gradient"></div>
      <div className="background-pattern"></div>

      {/* Main Content */}
      <main className="select-org-main">
        <div className="select-org-container">
          {/* Title Section */}
          <div className="select-org-title-section">
            <div className="title-icon">
              <Building2 size={32} />
            </div>
            <h1 className="select-org-title">Select Organization</h1>
            <p className="select-org-subtitle">
              Choose an organization to manage or create a new one
            </p>
          </div>

          {/* Content Section */}
          <div className="select-org-content">
            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner">
                  <Loader2 size={40} className="spinner-icon" />
                </div>
                <p className="loading-text">Loading organizations...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && orgs.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FolderOpen size={64} />
                </div>
                <h3 className="empty-title">No Organizations Found</h3>
                <p className="empty-description">
                  You haven't created any organizations yet. Get started by creating your first one.
                </p>
                <button
                  className="create-org-btn primary"
                  onClick={() => navigate("/admin/create-organization")}
                >
                  <Plus size={20} />
                  <span>Create Your First Organization</span>
                </button>
              </div>
            )}

            {/* Organizations List */}
            {!loading && orgs.length > 0 && (
              <div className="orgs-section">
                <div className="orgs-header">
                  <span className="orgs-count">
                    {orgs.length} Organization{orgs.length > 1 ? "s" : ""} 
                  </span>
                </div>

                <div className="orgs-list">
                  {orgs.map((org, index) => (
                    <div
                      key={org.org_id}
                      className={`org-card ${
                        hoveredOrg === org.org_id ? "hovered" : ""
                      }`}
                      onClick={() => handleOrgClick(org)}
                      onMouseEnter={() => setHoveredOrg(org.org_id)}
                      onMouseLeave={() => setHoveredOrg(null)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="org-card-icon">
                        <Building2 size={24} />
                      </div>
                      <div className="org-card-content">
                        <h3 className="org-name">{org.org_name}</h3>
                        <p className="org-id">ID: {org.org_id}</p>
                      </div>
                      <div className="org-card-arrow">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="orgs-footer">
                  <button
                    className="create-org-btn secondary"
                    onClick={() => navigate("/admin/create-organization")}
                  >
                    <Plus size={18} />
                    <span>Create New Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SelectOrganization;