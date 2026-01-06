import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProjectList.module.css";

function ProjectList() {
  const { org_id } = useParams();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await API.get(`/projects/${org_id}`);
    setProjects(res.data);
  };

  return (
    <div className={styles.container}>
      <h2>Select Project</h2>

      {projects.map((p) => (
        <div
          key={p.project_id}
          className={styles.project}
          onClick={() =>
            navigate(`/tester/project/${p.project_id}`)
          }
        >
          {p.project_name}
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
