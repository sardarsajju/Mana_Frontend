// Enhanced BugChat.jsx - FIXED VERSION
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import styles from "./BugChat.module.css";
import { 
  Send, 
  ArrowLeft, 
  Bug, 
  User, 
  Code2, 
  MessageSquare,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";

function BugChat() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bugInfo, setBugInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // ✅ Only run if user exists
    if (user) {
      loadBugInfo();
      markAsRead();
      loadComments();
    }
  }, [user, id]);  // ✅ Add dependencies

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [comments]);

  const loadBugInfo = async () => {
    if (!user) return;
    
    try {
      // ✅ FIXED: Use the overview endpoint that exists
      const res = await API.get(`/bugs/overview/${id}?user_id=${user.user_id}&role=${user.role}`);
      setBugInfo(res.data);
    } catch (error) {
      console.error("Error loading bug info:", error);
    }
  };

  const markAsRead = async () => {
    if (!user) return;
    
    try {
      // ✅ FIXED: Use user.user_id
      await API.post("/bugs/mark-read", {
        bug_id: id,
        user_id: user.user_id,
        role: user.role,
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const loadComments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const res = await API.get(`/bugs/comments/${id}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    const tempMessage = message;
    setMessage("");
    
    try {
      // ✅ FIXED: Use user.user_id
      await API.post("/bugs/comment", {
        bug_id: id,
        sender_id: user.user_id,
        role: user.role,
        message: tempMessage,
      });
      loadComments();
    } catch (error) {
      setMessage(tempMessage);
      alert("Failed to send message");
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const groupedComments = groupMessagesByDate(comments);

  const getRoleIcon = (role) => {
    return role === 'developer' ? <Code2 size={14} /> : <User size={14} />;
  };

  // ✅ Show loading while user is being fetched
  if (!user || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatCard}>
        <div className={styles.chatHeader}>
          <button 
            className={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <div className={styles.bugInfo}>
            <div className={styles.bugIcon}>
              <Bug size={20} />
            </div>
            <div className={styles.bugDetails}>
              <h2>Bug #{id}</h2>
              {bugInfo && <p>{bugInfo.title}</p>}
            </div>
          </div>
          <div className={styles.status}>
            {bugInfo?.status || 'Open'}
          </div>
        </div>

        <div className={styles.chatBox} ref={chatRef}>
          {Object.entries(groupedComments).map(([date, msgs]) => (
            <React.Fragment key={date}>
              <div className={styles.dateDivider}>
                <span>{date === new Date().toLocaleDateString() ? 'Today' : date}</span>
              </div>
              {msgs.map((c, index) => (
                <div
                  key={c.comment_id || `${date}-${index}`}  
                  className={
                    c.sender_role === user.role 
                      ? styles.myMessage 
                      : styles.otherMessage
                  }
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.name}>
                      {getRoleIcon(c.sender_role)}
                      {c.sender_name}
                    </span>
                    <span className={styles.role}>{c.sender_role}</span>
                  </div>
                  <div className={styles.msgBubble}>
                    <div className={styles.msg}>{c.message}</div>
                    <div className={styles.msgFooter}>
                      <span className={styles.time}>
                        <Clock size={10} />
                        {new Date(c.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {/* {c.sender_role === user.role && (
                        <span className={styles.readStatus}>
                          <CheckCheck size={14} />
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}

          {isTyping && (
            <div className={styles.typingWrapper}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className={styles.typingText}>Someone is typing...</span>
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!message.trim()}
            className={styles.sendBtn}
          >
            <Send size={20} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BugChat;