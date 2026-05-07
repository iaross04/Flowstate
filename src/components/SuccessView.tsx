"use client";

import React from "react";
import styles from "./SuccessView.module.css";

interface SuccessViewProps {
  summary: string;
  path: string;
  category: string;
  onDismiss?: () => void;
}

export default function SuccessView({
  summary,
  path,
  category,
  onDismiss,
}: SuccessViewProps) {
  const icon = category === "To-Do" ? "✓" : "📌";

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.icon}>{icon}</div>
        <h2 className={styles.title}>Note synced to GitHub. Open your Obsidian vault to view.</h2>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.pathBadge}>{path}</div>
        {onDismiss && (
          <button className={styles.button} onClick={onDismiss}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
