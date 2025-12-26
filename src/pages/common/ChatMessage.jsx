import styles from "./ChatMessage.module.css";

function ChatMessage({ msg, currentRole }) {
  const isMine = msg.sender_role === currentRole;

  return (
    <div
      className={`${styles.messageRow} ${
        isMine ? styles.mine : styles.their
      }`}
    >
      <div className={styles.bubble}>
        {msg.message}
        <span className={styles.time}>
          {new Date(msg.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
