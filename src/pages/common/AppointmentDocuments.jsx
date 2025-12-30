// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import styles from "./AppointmentDocuments.module.css";

// function AppointmentDocuments() {
//     const { appointmentId } = useParams();
//     const user = useSelector(state => state.user);

//     const [files, setFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [uploading, setUploading] = useState(false);

//     const canUpload = user.role === "doctor" || user.role === "patient";

//     const fetchFiles = async () => {
//         try {
//             const res = await axios.get(
//                 `http://localhost:5005/api/files/${appointmentId}`
//             );
//             setFiles(res.data);
//         } catch (err) {
//             console.error("Fetch documents error", err);
//         }
//     };

//     useEffect(() => {
//         fetchFiles();
//     }, [appointmentId]);

//     const uploadFile = async () => {
//         if (!selectedFile) return;

//         const formData = new FormData();
//         formData.append("file", selectedFile);
//         formData.append("appointment_id", appointmentId);
//         formData.append("uploaded_by", user.role); // ✅ MATCHES DB
//         formData.append("uploader_id", user.login_id);
//         formData.append(
//             "file_type",
//             user.role === "doctor" ? "prescriptions" : "reports"
//         );
//         console.log("whats role", user.role);


//         try {
//             setUploading(true);

//             await axios.post(
//                 `http://localhost:5005/api/files/upload/${user.role === "doctor" ? "prescription" : "report"
//                 }`,
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );


//             setSelectedFile(null);
//             fetchFiles();
//             alert("File uploaded successfully");
//         } catch (err) {
//             console.error(err);
//             alert("Upload failed");
//         } finally {
//             setUploading(false);
//         }
//     };


//     return (
//         <div className={styles.container}>
//             <h2>Appointment Documents</h2>

//             {canUpload && (
//                 <div className={styles.uploadBox}>
//                     <input
//                         type="file"
//                         onChange={e => setSelectedFile(e.target.files[0])}
//                     />
//                     <button
//                         onClick={uploadFile}
//                         disabled={!selectedFile || uploading}
//                     >
//                         {uploading ? "Uploading..." : "Upload"}
//                     </button>
//                 </div>
//             )}

//             <div className={styles.list}>
//                 {files.length === 0 ? (
//                     <p>No documents uploaded</p>
//                 ) : (
//                     files.map(doc => (
//                         <div key={doc.file_id} className={styles.card}>
//                             <p className={styles.name}>{doc.file_name}</p>
//                             <p className={styles.meta}>
//                                 Uploaded by: {doc.uploaded_by}
//                             </p>

//                             <a
//                                 href={`http://localhost:5005/${doc.file_path}`}
//                                 target="_blank"
//                                 rel="noreferrer"
//                             >
//                                 Download
//                             </a>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// export default AppointmentDocuments;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./AppointmentDocuments.module.css";

function AppointmentDocuments() {
  const { appointmentId } = useParams();
  const user = useSelector(state => state.user);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const canUpload = user.role === "doctor" || user.role === "patient";

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5005/api/files/${appointmentId}`
      );
      setFiles(res.data);
    } catch (err) {
      console.error("Fetch documents error", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [appointmentId]);

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("appointment_id", appointmentId);
    formData.append("uploaded_by", user.role);
    formData.append("uploader_id", user.login_id);
    formData.append(
      "file_type",
      user.role === "doctor" ? "prescription" : "report"
    );
 
    try {
      setUploading(true);

      await axios.post(
        "http://localhost:5005/api/files/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment Documents</h2>

      {/* ⬆️ Upload Section */}
      {canUpload && (
        <div className={styles.uploadCard}>
          <input
            type="file"
            onChange={e => setSelectedFile(e.target.files[0])}
          />
          <button
            onClick={uploadFile}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      )}

      {/* 📂 Files List */}
      <div className={styles.list}>
        {files.length === 0 ? (
          <div className={styles.empty}>
            No documents uploaded yet
          </div>
        ) : (
          files.map(doc => (
            <div key={doc.file_id} className={styles.card}>
              <div>
                <p className={styles.name}>{doc.file_name}</p>
                <p className={styles.meta}>
                  Uploaded by: <b>{doc.uploaded_by}</b>
                </p>
              </div>

              <div className={styles.actions}>
                <span
                  className={`${styles.badge} ${
                    doc.file_type === "prescription"
                      ? styles.prescription
                      : styles.report
                  }`}
                >
                  {doc.file_type}
                </span>

                <a
                  href={`http://localhost:5005/${doc.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AppointmentDocuments;
