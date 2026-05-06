"use client";

import React, { useState } from "react";
import styles from "./ResultDisplay.module.css";

interface LibrarianResult {
  category: "To-Do" | "Reference";
  path: string;
  content: string;
  summary: string;
}

interface ResultDisplayProps {
  result: LibrarianResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: string) => {
    return category === "To-Do" ? "#FF9500" : "#34C759";
  };

  const getCategoryLabel = (category: string) => {
    return category === "To-Do" ? "✓ Task" : "📌 Reference";
  };

  return (
    <div className={styles.resultContainer}>
      <button
        className={styles.resultHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.categoryBadge}>
          <span
            className={styles.categoryDot}
            style={{ backgroundColor: getCategoryColor(result.category) }}
          />
          <span className={styles.categoryLabel}>
            {getCategoryLabel(result.category)}
          </span>
        </div>
        <div className={styles.pathInfo}>
          <span className={styles.pathText}>{result.path}</span>
        </div>
        <div className={styles.expandIcon}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <path
              d="M3 6L8 11L13 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className={styles.resultContent}>
          {/* Metadata Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📋 Metadata</h4>
            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Category</span>
                <span className={styles.metadataValue}>{result.category}</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Path</span>
                <span className={styles.metadataValue} title={result.path}>
                  {result.path}
                </span>
              </div>
            </div>
          </div>

          {/* Content Preview Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📝 Preview</h4>
            <div className={styles.contentPreview}>
              <code>{result.content.substring(0, 200)}...</code>
            </div>
          </div>

          {/* JSON Raw Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>⚙️ Raw JSON</h4>
            <div className={styles.jsonContainer}>
              <code className={styles.json}>
                {JSON.stringify(result, null, 2)}
              </code>
            </div>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(result, null, 2));
              }}
            >
              Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
