// BugOverview.jsx - Fixed Version

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import RichTextViewer from "../Components/RichTextViewer";
import styles from "./BugOverview.module.css";
import {
    Bug,
    ArrowLeft,
    User,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageCircle,
    Image as ImageIcon,
    FileText,
    Download,
    FolderOpen,
    X,
    ChevronLeft,
    ChevronRight,
    Eye
} from "lucide-react";

function BugOverview() {
    const { bug_id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // ✅ FIXED: Changed from bugData to bug directly
    const [bug, setBug] = useState(null);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [activeImageId, setActiveImageId] = useState(null);

    useEffect(() => {
        if (user) {
            loadBugOverview();
        }
    }, [bug_id, user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeImageId !== null) {
                const activeImageItem = document.querySelector(`[data-image-id="${activeImageId}"]`);
                
                if (activeImageItem && !activeImageItem.contains(event.target)) {
                    setActiveImageId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeImageId]);

    const loadBugOverview = async () => {
        if (!user) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await API.get(`/bugs/overview/${bug_id}?user_id=${user.user_id}&role=${user.role}`);
            
            console.log("API Response:", res.data);
            
            // ✅ FIXED: Handle the response correctly
            // Backend returns bug object directly, not { bug, images, files }
            if (res.data) {
                setBug(res.data);
                // If your backend also returns images/files, handle them here
                // setImages(res.data.images || []);
                // setFiles(res.data.files || []);
            }

            // Mark as read
            try {
                await API.post("/bugs/mark-read", {
                    bug_id,
                    user_id: user.user_id,
                    role: user.role
                });
            } catch (markErr) {
                console.warn("Could not mark as read:", markErr);
            }
        } catch (err) {
            console.error("Error loading bug:", err);
            setError("Failed to load bug details");
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (status) => {
        try {
            await API.put(`/bugs/update/${bug_id}`, {
                status,
                developer_id: user.user_id
            });
            loadBugOverview();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "open":
                return <AlertCircle size={18} />;
            case "in-progress":
                return <Clock size={18} />;
            case "resolved":
                return <CheckCircle size={18} />;
            default:
                return <Bug size={18} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'zip':
            case 'rar':
                return '📦';
            default:
                return '📎';
        }
    };

    const handleImageClick = (imageId, e) => {
        e.stopPropagation();
        setActiveImageId(activeImageId === imageId ? null : imageId);
    };

    const openImageModal = (image, index, e) => {
        e.stopPropagation();
        setSelectedImage(image);
        setImageIndex(index);
        setActiveImageId(null);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const navigateImage = (direction) => {
        const newIndex = imageIndex + direction;
        if (newIndex >= 0 && newIndex < images.length) {
            setImageIndex(newIndex);
            setSelectedImage(images[newIndex]);
        }
    };

    const handleDownload = async (fileName, originalName, e) => {
        if (e) e.stopPropagation();
        
        try {
            const response = await fetch(`http://localhost:5000/api/bugs/download/${fileName}`);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = originalName || fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setActiveImageId(null);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    const handlePreview = (fileName, e) => {
        if (e) e.stopPropagation();
        window.open(`http://localhost:5000/uploads/${fileName}`, '_blank');
    };

    const closeOverlay = (e) => {
        e.stopPropagation();
        setActiveImageId(null);
    };

    // ✅ Loading state
    if (!user || isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p>Loading bug details...</p>
                </div>
            </div>
        );
    }

    // ✅ Error state
    if (error || !bug) {
        return (
            <div className={styles.container}>
                <div className={styles.errorWrapper}>
                    <AlertCircle size={48} />
                    <h3>Error</h3>
                    <p>{error || "Bug not found"}</p>
                    <button onClick={() => navigate(-1)} className={styles.backBtn}>
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Now 'bug' is directly available, not bugData.bug
    return (
        <div className={styles.container}>
            {/* Navigation Header */}
            <div className={styles.navHeader}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back to List
                </button>
                <button
                    onClick={() => navigate(`/bug/${bug_id}/chat`)}
                    className={styles.chatBtn}
                >
                    <MessageCircle size={20} />
                    Open Chat
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.detailsColumn}>
                    {/* Bug Header Card */}
                    <div className={styles.headerCard}>
                        <div className={styles.bugHeader}>
                            <div className={styles.bugIdBadge}>
                                <Bug size={20} />
                                <span>Bug #{bug.bug_id}</span>
                            </div>
                            <div className={`${styles.statusBadge} ${getStatusClass(bug.status)}`}>
                                {getStatusIcon(bug.status)}
                                <span>{bug.status}</span>
                            </div>
                        </div>

                        <h1 className={styles.bugTitle}>{bug.title}</h1>

                        <div className={styles.metaGrid}>
                            <div className={styles.metaItem}>
                                <User size={16} />
                                <div>
                                    <span className={styles.metaLabel}>Reported by</span>
                                    <span className={styles.metaValue}>{bug.tester_name}</span>
                                </div>
                            </div>
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <div>
                                    <span className={styles.metaLabel}>Created</span>
                                    <span className={styles.metaValue}>{formatDate(bug.created_at)}</span>
                                </div>
                            </div>
                            {bug.project_name && (
                                <div className={styles.metaItem}>
                                    <FolderOpen size={16} />
                                    <div>
                                        <span className={styles.metaLabel}>Project</span>
                                        <span className={styles.metaValue}>{bug.project_name}</span>
                                    </div>
                                </div>
                            )}
                            {bug.developer_name && (
                                <div className={styles.metaItem}>
                                    <User size={16} />
                                    <div>
                                        <span className={styles.metaLabel}>Assigned to</span>
                                        <span className={styles.metaValue}>{bug.developer_name}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user.role === "developer" && (
                            <div className={styles.statusUpdate}>
                                <label>Update Status:</label>
                                <select
                                    value={bug.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    className={styles.statusSelect}
                                >
                                    <option value="open">Open</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Description Card */}
                    <div className={styles.descriptionCard}>
                        <h2 className={styles.sectionTitle}>
                            <FileText size={20} />
                            Description
                        </h2>
                        <div className={styles.descriptionContent}>
                            <RichTextViewer content={bug.description} />
                        </div>
                    </div>

                    {/* Images Section - Only show if images exist */}
                    {images && images.length > 0 && (
                        <div className={styles.imagesCard}>
                            <h2 className={styles.sectionTitle}>
                                <ImageIcon size={20} />
                                Screenshots ({images.length})
                            </h2>
                            <p className={styles.imageHint}>
                                <Eye size={14} />
                                Click on an image to see options
                            </p>

                            <div className={styles.imageGrid}>
                                {images.map((image, index) => (
                                    <div 
                                        key={image.id} 
                                        data-image-id={image.id}
                                        className={`${styles.imageItem} ${activeImageId === image.id ? styles.imageItemActive : ''}`}
                                        onClick={(e) => handleImageClick(image.id, e)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={`http://localhost:5000/uploads/${image.file_name}`}
                                                alt={image.original_name}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            
                                            {activeImageId === image.id && (
                                                <div className={styles.imageOverlay}>
                                                    <button
                                                        className={styles.closeOverlayBtn}
                                                        onClick={closeOverlay}
                                                        title="Close"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                    
                                                    <div className={styles.overlayActions}>
                                                        <button
                                                            className={styles.actionBtn}
                                                            onClick={(e) => openImageModal(image, index, e)}
                                                            title="Preview"
                                                        >
                                                            <Eye size={22} />
                                                            <span>Preview</span>
                                                        </button>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.downloadActionBtn}`}
                                                            onClick={(e) => handleDownload(image.file_name, image.original_name, e)}
                                                            title="Download"
                                                        >
                                                            <Download size={22} />
                                                            <span>Download</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className={styles.imageName}>{image.original_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files Section - Only show if files exist */}
                    {files && files.length > 0 && (
                        <div className={styles.filesCard}>
                            <h2 className={styles.sectionTitle}>
                                <FileText size={20} />
                                Attachments ({files.length})
                            </h2>
                            <div className={styles.filesList}>
                                {files.map((file) => (
                                    <div key={file.id} className={styles.fileItem}>
                                        <div className={styles.fileIcon}>
                                            {getFileIcon(file.original_name)}
                                        </div>
                                        <div className={styles.fileInfo}>
                                            <span className={styles.fileName}>{file.original_name}</span>
                                            <span className={styles.fileSize}>
                                                {formatFileSize(file.file_size)}
                                            </span>
                                        </div>
                                        <div className={styles.fileActions}>
                                            <button
                                                className={styles.fileActionBtn}
                                                onClick={(e) => handlePreview(file.file_name, e)}
                                                title="Preview"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className={styles.fileActionBtn}
                                                onClick={(e) => handleDownload(file.file_name, file.original_name, e)}
                                                title="Download"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className={styles.imageModal} onClick={closeImageModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeModal} onClick={closeImageModal}>
                            <X size={24} />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navBtn} ${styles.prevBtn}`}
                                    onClick={() => navigateImage(-1)}
                                    disabled={imageIndex === 0}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    className={`${styles.navBtn} ${styles.nextBtn}`}
                                    onClick={() => navigateImage(1)}
                                    disabled={imageIndex === images.length - 1}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        <img
                            src={`http://localhost:5000/uploads/${selectedImage.file_name}`}
                            alt={selectedImage.original_name}
                            className={styles.modalImage}
                        />

                        <div className={styles.modalFooter}>
                            <span>{selectedImage.original_name}</span>
                            <span>{imageIndex + 1} / {images.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BugOverview;