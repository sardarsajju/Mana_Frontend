import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import styles from "./AdminCreateProject.module.css";
import { useNavigate } from "react-router-dom";

function AdminCreateProject() {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Ensure org is selected
  useEffect(() => {
    const orgId = localStorage.getItem("org_id");
    if (!orgId) {
      navigate("/admin/select-organization");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const org_id = localStorage.getItem("org_id");

    if (!org_id) {
      alert("Organization not selected");
      setIsLoading(false);
      return;
    }

    try {
      await API.post("/projects/create", {
        project_name: projectName,
        org_id: org_id, // ✅ IMPORTANT
      });

      alert("Project created successfully");
      setProjectName("");
      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Create New Project</h2>
          <p>Project will be created under selected organization</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="projectName">Project Name</label>
            <input
              id="projectName"
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !projectName.trim()}
              className={styles.submitBtn}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProject;
