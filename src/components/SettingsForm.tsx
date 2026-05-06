"use client";

import React, { useState } from "react";
import styles from "./SettingsForm.module.css";

interface SettingsFormProps {
  onSave?: (settings: AppSettings) => void;
  onCancel?: () => void;
}

interface AppSettings {
  vaultPath: string;
  autoSync: boolean;
  enableTags: boolean;
  defaultCategory: "To-Do" | "Reference";
}

export default function SettingsForm({
  onSave,
  onCancel,
}: SettingsFormProps) {
  const [settings, setSettings] = useState<AppSettings>({
    vaultPath: "/Users/user/Documents/ObsidianVault",
    autoSync: true,
    enableTags: true,
    defaultCategory: "To-Do",
  });

  const handleChange = (
    key: keyof AppSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(settings);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2 className={styles.title}>Settings</h2>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="vaultPath">
          Obsidian Vault Path
        </label>
        <input
          id="vaultPath"
          type="text"
          value={settings.vaultPath}
          onChange={(e) => handleChange("vaultPath", e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="defaultCategory">
          Default Category
        </label>
        <select
          id="defaultCategory"
          value={settings.defaultCategory}
          onChange={(e) =>
            handleChange("defaultCategory", e.target.value as "To-Do" | "Reference")
          }
          className={styles.select}
        >
          <option value="To-Do">To-Do</option>
          <option value="Reference">Reference</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={settings.autoSync}
            onChange={(e) => handleChange("autoSync", e.target.checked)}
          />
          <span>Auto-sync with Obsidian</span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={settings.enableTags}
            onChange={(e) => handleChange("enableTags", e.target.checked)}
          />
          <span>Enable automatic tags</span>
        </label>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.buttonSecondary}
        >
          Cancel
        </button>
        <button type="submit" className={styles.buttonPrimary}>
          Save
        </button>
      </div>
    </form>
  );
}
