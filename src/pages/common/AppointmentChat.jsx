

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./AppointmentChat.module.css";
import ChatMessage from "./ChatMessage";

function AppointmentChat() {
  const { appointmentId } = useParams();
  const user = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const senderRole = user.role; // "doctor" | "patient"
  const senderId = user.login_id;

  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5005/api/chat/${appointmentId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // polling
    return () => clearInterval(interval);
  }, [appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post("http://localhost:5005/api/chat/send", {
        appointment_id: appointmentId,
        sender_role: senderRole,
        sender_id: senderId,
        message: text,
      });

      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment Chat</h2>

      {/* CHAT MESSAGES */}
<div className={styles.messages}>
  {messages.length === 0 ? (
    <div className={styles.emptyState}>
      <p className={styles.emptyTitle}>No messages yet</p>
      <p className={styles.emptySubtitle}>
        This is a private chat between doctor and patient for this appointment.
        <br />
        Start the conversation by sending a message below.
      </p>
    </div>
  ) : (
    messages.map((msg, index) => (
      <ChatMessage
        key={index}
        msg={msg}
        currentRole={senderRole}
      />
    ))
  )}

  <div ref={messagesEndRef} />
</div>


      {/* INPUT BAR */}
      <div className={styles.inputBar}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} disabled={!text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default AppointmentChat;
