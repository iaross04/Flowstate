"use client";

import React from "react";
import ResultDisplay from "./ResultDisplay";
import styles from "./ChatMessage.module.css";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  result?: {
    category: "To-Do" | "Reference";
    path: string;
    content: string;
    summary: string;
  };
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {

  return (
    <div className={`${styles.messageWrapper} ${styles[message.type]}`}>
      <div className={styles.messageBubble}>
        <p className={styles.messageText}>{message.text}</p>
      </div>
      {message.result && <ResultDisplay result={message.result} />}
    </div>
  );
}
