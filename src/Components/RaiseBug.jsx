// Enhanced RaiseBug.jsx with lucide-react
import React, { useState, useContext, useEffect, useCallback } from "react";
import API from "../api/axiosConfig";
import styles from "../Components/RaiseBug.module.css";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Bug, 
  Bold, 
  Italic, 
  Palette, 
  Image as ImageIcon, 
  Users,
  Send,
  AlertCircle,
  ArrowLeft,
  Paperclip,
  X,
  FileText,
  Loader2
} from "lucide-react";

// TipTap
import { EditorContent, useEditor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Node, mergeAttributes } from "@tiptap/core";

// Custom Image Component with Delete Button
const ImageComponent = ({ node, deleteNode, selected }) => {
  return (
    <NodeViewWrapper className={styles.imageWrapper}>
      <div className={`${styles.imageContainer} ${selected ? styles.selected : ''}`}>
        <button 
          type="button"
          className={styles.deleteImageBtn}
          onClick={deleteNode}
          title="Remove image"
        >
          <X size={14} />
        </button>
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || 'Bug image'} 
          className={styles.editorImage}
        />
      </div>
    </NodeViewWrapper>
  );
};

// Custom Image Extension with React Node View
const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});

// Custom File Attachment Node
// Custom File Attachment Node - UPDATED
const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  atom: true,
  
  addAttributes() {
    return {
      url: { default: null },
      fileName: { default: null },
      fileSize: { default: null },
      fileType: { default: null },
    };
  },
  
  parseHTML() {
    return [{
      tag: 'div[data-file-attachment]',
      getAttrs: (dom) => ({
        url: dom.getAttribute('data-url'),
        fileName: dom.getAttribute('data-filename'),
        fileSize: parseInt(dom.getAttribute('data-filesize') || '0'),
        fileType: dom.getAttribute('data-filetype'),
      }),
    }];
  },
  
  // ✅ FIX: Properly serialize attributes to HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-file-attachment': '',
        'data-url': HTMLAttributes.url,
        'data-filename': HTMLAttributes.fileName,
        'data-filesize': HTMLAttributes.fileSize,
        'data-filetype': HTMLAttributes.fileType,
        class: 'file-attachment',
      },
      [
        'a',
        {
          href: HTMLAttributes.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'file-attachment-link',
        },
        `📎 ${HTMLAttributes.fileName}`,
      ],
    ];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(FileAttachmentComponent);
  },
});

// File Attachment Component
const FileAttachmentComponent = ({ node, deleteNode, selected }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <NodeViewWrapper className={styles.fileWrapper}>
      <div className={`${styles.fileContainer} ${selected ? styles.selected : ''}`}>
        <button 
          type="button"
          className={styles.deleteFileBtn}
          onClick={deleteNode}
          title="Remove file"
        >
          <X size={14} />
        </button>
        <a 
          href={node.attrs.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.fileLink}
        >
          <FileText size={20} />
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{node.attrs.fileName}</span>
            <span className={styles.fileSize}>{formatFileSize(node.attrs.fileSize)}</span>
          </div>
        </a>
      </div>
    </NodeViewWrapper>
  );
};

function RaiseBug() {
  const [title, setTitle] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Track current color for active state
  const [currentColor, setCurrentColor] = useState("#000000");
  const [isColorActive, setIsColorActive] = useState(false);

  const { project_id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // TipTap Editor with Custom Extensions
  const editor = useEditor({
    extensions: [
      StarterKit, 
      TextStyle, 
      Color, 
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      FileAttachment,
    ],
    content: "",
    onSelectionUpdate: ({ editor }) => {
      // Update color active state based on current selection
      const color = editor.getAttributes('textStyle').color;
      if (color) {
        setCurrentColor(color);
        setIsColorActive(true);
      } else {
        setIsColorActive(false);
      }
    },
    onUpdate: ({ editor }) => {
      // Update color active state on content update
      const color = editor.getAttributes('textStyle').color;
      if (color) {
        setCurrentColor(color);
        setIsColorActive(true);
      } else {
        setIsColorActive(false);
      }
    },
  });

  useEffect(() => {
    loadProjectDevelopers();
  }, [project_id]);

  const loadProjectDevelopers = async () => {
    try {
      const res = await API.get(`/projects/${project_id}/developers`);
      setDevelopers(res.data);
    } catch (error) {
      console.error("Error loading developers:", error);
    }
  };

  // Handle color change
  const handleColorChange = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    setIsColorActive(true);
    editor?.chain().focus().setColor(color).run();
  };

  // Toggle color off (reset to default)
  const handleColorToggle = () => {
    if (isColorActive) {
      editor?.chain().focus().unsetColor().run();
      setIsColorActive(false);
      setCurrentColor("#000000");
    }
  };

  // Handle Multiple Image Upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !editor) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await API.post("/upload/editor-image", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              ((i + progressEvent.loaded / progressEvent.total) / files.length) * 100
            );
            setUploadProgress(progress);
          },
        });

        editor.chain().focus().setImage({ src: res.data.url }).run();
      }
    } catch (error) {
      alert("Failed to upload image(s)");
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Handle Multiple File Upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !editor) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 10MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await API.post("/upload/editor-file", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              ((i + progressEvent.loaded / progressEvent.total) / files.length) * 100
            );
            setUploadProgress(progress);
          },
        });

        editor.chain().focus().insertContent({
          type: 'fileAttachment',
          attrs: {
            url: res.data.url,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          },
        }).run();
      }
    } catch (error) {
      alert("Failed to upload file(s)");
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Drag and Drop Handler
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const otherFiles = files.filter(f => !f.type.startsWith('image/'));

    if (imageFiles.length) {
      const fakeEvent = { target: { files: imageFiles, value: '' } };
      await handleImageUpload(fakeEvent);
    }

    if (otherFiles.length) {
      const fakeEvent = { target: { files: otherFiles, value: '' } };
      await handleFileUpload(fakeEvent);
    }
  }, [editor]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!editor || !editor.getText().trim()) {
    alert("Please enter bug description");
    return;
  }

  // ✅ Add validation
  if (!title.trim()) {
    alert("Please enter a bug title");
    return;
  }

  setIsSubmitting(true);

  try {
    const payload = {
      created_by: user.user_id,
      project_id: Number(project_id),  // ✅ Convert to number
      title: title.trim(),
      description: editor.getHTML(),
      assigned_to: assignedTo === "all" ? null : Number(assignedTo),  // ✅ Convert to number
    };

    console.log("Payload being sent:", payload);  // ✅ Debug

    await API.post("/bugs/raise", payload);

    alert("Bug Raised Successfully!");
    setTitle("");
    setAssignedTo("all");
    editor.commands.clearContent();
    navigate("/tester/dashboard");
  } catch (error) {
    console.error("Failed to submit bug:", error);
    console.error("Error response:", error.response?.data);  // ✅ Show backend error
    alert(`Failed to submit bug: ${error.response?.data?.error || error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};
  // Check if editor is ready
  if (!editor) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <Loader2 size={32} className={styles.spin} />
          <span>Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button 
            className={styles.backBtn}
            onClick={() => navigate("/tester/dashboard")}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <Bug size={32} />
            </div>
            <h2>Report a Bug</h2>
            <p className={styles.subtitle}>Project ID: #{project_id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Bug Title */}
          <div className={styles.inputGroup}>
            <label htmlFor="title">
              <AlertCircle size={16} />
              Bug Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a descriptive title for the bug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Editor Section */}
          <div className={styles.editorSection}>
            <label>Bug Description</label>
            
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                {/* Bold Button */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`${styles.toolbarBtn} ${editor.isActive('bold') ? styles.active : ''}`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={18} />
                </button>

                {/* Italic Button */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`${styles.toolbarBtn} ${editor.isActive('italic') ? styles.active : ''}`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={18} />
                </button>

                {/* Color Picker */}
                <div 
                  className={`${styles.colorPicker} ${isColorActive ? styles.active : ''}`}
                  title="Text Color"
                >
                  <Palette size={18} />
                  <input
                    type="color"
                    value={currentColor}
                    onChange={handleColorChange}
                  />
                  {isColorActive && (
                    <span 
                      className={styles.colorIndicator}
                      style={{ backgroundColor: currentColor }}
                    ></span>
                  )}
                  {isColorActive && (
                    <button
                      type="button"
                      className={styles.colorResetBtn}
                      onClick={handleColorToggle}
                      title="Reset color"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className={styles.separator}></div>

                {/* Image Upload */}
                <label className={styles.uploadBtn} title="Add Images">
                  <ImageIcon size={18} />
                  <span>Images</span>
                  <input 
                    type="file" 
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    hidden
                  />
                </label>

                {/* File Upload */}
                <label className={styles.uploadBtn} title="Add Files">
                  <Paperclip size={18} />
                  <span>Files</span>
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt,.log,.json,.xml,.csv"
                    multiple
                    hidden
                  />
                </label>
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className={styles.uploadingIndicator}>
                  <Loader2 size={16} className={styles.spin} />
                  <span>Uploading... {uploadProgress}%</span>
                </div>
              )}
            </div>

            {/* Editor with Scrollable Container */}
            <div 
              className={styles.editorContainer}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <EditorContent editor={editor} className={styles.editor} />
            </div>

            <div className={styles.editorFooter}>
              <span>Supports images (PNG, JPG, GIF) and files (PDF, DOC, TXT)</span>
              <span>Max: 5MB for images, 10MB for files</span>
            </div>
          </div>

          {/* Assign Developer */}
          <div className={styles.inputGroup}>
            <label htmlFor="assignDev">
              <Users size={16} />
              Assign to Developer
            </label>
            <select
              id="assignDev"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={styles.dropdown}
            >
              <option value="all">All Developers</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Bug Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseBug;