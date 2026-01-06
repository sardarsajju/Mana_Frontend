// Components/RichTextViewer.jsx
import React from 'react';
import styles from './RichTextViewer.module.css';
import { FileText, Download } from 'lucide-react';

function RichTextViewer({ content }) {
  if (!content) {
    return <p className={styles.empty}>No description provided</p>;
  }

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Process HTML to enhance file attachments
  const processContent = (html) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Find all file attachments and enhance them
    const fileAttachments = tempDiv.querySelectorAll('[data-file-attachment]');
    fileAttachments.forEach((el) => {
      const url = el.getAttribute('data-url');
      const fileName = el.getAttribute('data-filename');
      const fileSize = el.getAttribute('data-filesize');
      
      if (url && fileName) {
        el.innerHTML = `
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="rich-file-link">
            <span class="rich-file-icon">📎</span>
            <span class="rich-file-info">
              <span class="rich-file-name">${fileName}</span>
              <span class="rich-file-size">${formatFileSize(parseInt(fileSize))}</span>
            </span>
            <span class="rich-file-download">⬇️</span>
          </a>
        `;
      }
    });

    return tempDiv.innerHTML;
  };

  return (
    <div 
      className={styles.richTextViewer}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  );
}

export default RichTextViewer;