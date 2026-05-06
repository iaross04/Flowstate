"use client";

import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ResultDisplay from "./ResultDisplay";
import styles from "./ChatInterface.module.css";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  result?: LibrarianResult;
  timestamp: Date;
}

interface LibrarianResult {
  category: "To-Do" | "Reference";
  path: string;
  content: string;
  summary: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to process message");
      }

      const result: LibrarianResult = await response.json();

      // Add AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: result.summary,
        result: result,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorText =
        error instanceof Error ? error.message : "Sorry, there was an error processing your message.";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Flowstate</h1>
        <p className={styles.subtitle}>Smart Note Capture</p>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✨</div>
            <h2 className={styles.emptyTitle}>Start capturing ideas</h2>
            <p className={styles.emptyText}>
              Type anything and I'll organize it for your Obsidian vault
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className={styles.loadingMessage}>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a note or task..."
            className={styles.input}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={styles.sendButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10L18 2L10 18L8.5 12.5L3.5 11L2 10Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
