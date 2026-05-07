"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const STEPS = [
    {
        key: "githubToken",
        label: "step 1 of 2",
        question: "your github\naccess token.",
        hint: "needs repo scope",
        link: { text: "generate one here →", url: "https://github.com/settings/tokens" },
        placeholder: "ghp_xxxxxxxxxxxx",
        type: "password",
    },
    {
        key: "repoName",
        label: "step 2 of 2",
        question: "your github\nrepository.",
        hint: "format: username/repo-name",
        placeholder: "username/my-vault",
        type: "text",
    },
];

interface GitHubRepo {
    id: string;
    token: string;
    repoName: string;
    addedAt: number;
}

const validateRepo = async (token: string, repo: string) => {
    const [owner, name] = repo.split('/');
    if (!owner || !name) return false;
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
            headers: { Authorization: `token ${token}` }
        });
        return res.ok;
    } catch {
        return false;
    }
};

export default function SettingsPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"manage" | "add">("manage"); // manage existing repos or add new one
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({ githubToken: "", repoName: "" });
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [activeRepoId, setActiveRepoId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Load repos from localStorage on mount
    useEffect(() => {
        const savedRepos = localStorage.getItem("fs_repos");
        const savedActiveId = localStorage.getItem("fs_active_repo_id");
        
        if (savedRepos) {
            const parsed = JSON.parse(savedRepos) as GitHubRepo[];
            setRepos(parsed);
            setActiveRepoId(savedActiveId || parsed[0]?.id || "");
        }
        setLoading(false);
    }, []);

    const current = STEPS[step];
    const value = values[current.key as keyof typeof values];
    const isLast = step === STEPS.length - 1;

    const handleNext = async () => {
        if (!value.trim()) return;

        if (current.key === "repoName") {
            const valid = await validateRepo(values.githubToken, value);
            if (!valid) {
                setError("Repository not found. Please ensure your repo is public or your token has 'repo' permissions.");
                return;
            }
            setError("");
        }

        if (isLast) {
            setSaving(true);
            const newRepo: GitHubRepo = {
                id: Date.now().toString(),
                token: values.githubToken,
                repoName: values.repoName,
                addedAt: Date.now(),
            };
            
            const updatedRepos = [...repos, newRepo];
            setRepos(updatedRepos);
            localStorage.setItem("fs_repos", JSON.stringify(updatedRepos));
            localStorage.setItem("fs_active_repo_id", newRepo.id);
            setActiveRepoId(newRepo.id);
            
            await new Promise((r) => setTimeout(r, 500));
            setMode("manage");
            setStep(0);
            setValues({ githubToken: "", repoName: "" });
            setSaving(false);
        } else {
            setShow(false);
            setStep((s) => s + 1);
        }
    };

    const handleDeleteRepo = (id: string) => {
        const updated = repos.filter(r => r.id !== id);
        setRepos(updated);
        localStorage.setItem("fs_repos", JSON.stringify(updated));
        
        if (activeRepoId === id) {
            const newActiveId = updated[0]?.id || "";
            setActiveRepoId(newActiveId);
            localStorage.setItem("fs_active_repo_id", newActiveId);
        }
    };

    const handleSelectRepo = (id: string) => {
        setActiveRepoId(id);
        localStorage.setItem("fs_active_repo_id", id);
    };

    const handleBackFromAdd = () => {
        setMode("manage");
        setStep(0);
        setValues({ githubToken: "", repoName: "" });
        setError("");
    };

    const handleChange = (val: string) => {
        setValues((v) => ({ ...v, [current.key]: val }));
    };

    // Dot progress indicator
    const dots = STEPS.map((_, i) => (
        <span
            key={i}
            style={{
                display: "inline-block",
                width: i === step ? "20px" : "6px",
                height: "6px",
                borderRadius: "999px",
                background: i === step ? "#111" : "#555",
                transition: "all 0.3s ease",
            }}
        />
    ));

    return (
        <>
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
            .fs-root { font-family: 'Space Grotesk', sans-serif; }

            .fs-input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1.5px solid #CCC;
            border-radius: 0;
            padding: 12px 36px 12px 0;
            font-size: 16px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 500;
            color: #111;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
            caret-color: #111;
            }
            .fs-input:focus { border-bottom-color: #111; }
            .fs-input::placeholder { color: #333; font-weight: 400; }

            .btn-primary {
            transition: opacity 0.15s ease, transform 0.1s ease;
            }
            .btn-primary:active { transform: scale(0.97); opacity: 0.85; }
            .btn-primary:disabled { opacity: 0.25; cursor: not-allowed; }

            .eye-toggle {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #333;
            font-size: 14px;
            padding: 4px;
            transition: color 0.15s;
            }
            .eye-toggle:hover { color: #333; }

            .back-btn { transition: color 0.15s ease; }
            .back-btn:hover { color: #444; }

            .slide-in {
            animation: slideIn 0.25s ease forwards;
            }
            @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
            }
        `}</style>

            <main className="fs-root w-full min-h-screen bg-[#FFFFFF] flex flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">loading...</p>
                    </div>
                ) : mode === "manage" ? (
                    <>
                        {/* Top nav */}
                        <div className="flex items-center justify-between px-2 sm:px-4 pt-8 sm:pt-12">
                            <button
                                onClick={() => router.back()}
                                className="back-btn text-xs text-[#777] font-medium tracking-wide"
                            >
                                ← back
                            </button>
                            <p className="text-[8px] sm:text-[9px] font-semibold tracking-[.28em] text-[#777] uppercase">
                                FlowState
                            </p>
                            <div style={{ width: 40 }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center px-2 sm:px-4 pb-4 sm:pb-8 overflow-y-auto">
                            <p className="text-[8px] sm:text-[10px] font-semibold tracking-[.2em] text-[#777] uppercase mb-2 sm:mb-3">
                                repositories
                            </p>

                            {repos.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-[14px] text-[#333] mb-4">no repositories added yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-6">
                                    {repos.map((repo) => (
                                        <div className="p-3 sm:p-4 border border-[#E0E0E0] rounded-lg cursor-pointer transition-all"
                                            style={{
                                                backgroundColor: activeRepoId === repo.id ? "#F5F5F5" : "#FFFFFF",
                                                borderColor: activeRepoId === repo.id ? "#111" : "#E0E0E0",
                                            }}
                                            onClick={() => handleSelectRepo(repo.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-[12px] sm:text-[14px] font-semibold text-[#111]">{repo.repoName}</p>
                                                    <p className="text-[9px] sm:text-[11px] text-[#666] mt-1">
                                                        Added {new Date(repo.addedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {activeRepoId === repo.id && (
                                                    <span className="text-[10px] sm:text-[12px] font-semibold text-[#007AFF] ml-2">active</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRepo(repo.id);
                                                }}
                                                className="mt-2 sm:mt-3 text-[9px] sm:text-[11px] text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="px-2 sm:px-4 pb-8 sm:pb-12">
                            <button
                                className="btn-primary w-full py-3 sm:py-3.5 bg-[#111] text-white rounded-2xl text-sm sm:text-base font-semibold tracking-wide"
                                onClick={() => {
                                    setMode("add");
                                    setStep(0);
                                }}
                            >
                                + add repository
                            </button>
                            <button
                                className="btn-primary w-full py-3 sm:py-3.5 mt-2 bg-[#007AFF] text-white rounded-2xl text-sm sm:text-base font-semibold tracking-wide"
                                onClick={() => {
                                    if (activeRepoId) router.push("/capture");
                                }}
                                disabled={!activeRepoId}
                            >
                                continue →
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Top nav */}
                        <div className="flex items-center justify-between px-2 sm:px-4 pt-8 sm:pt-12">
                            <button
                                onClick={handleBackFromAdd}
                                className="back-btn text-xs text-[#777] font-medium tracking-wide"
                            >
                                ← back
                            </button>
                            <p className="text-[8px] sm:text-[9px] font-semibold tracking-[.28em] text-[#777] uppercase">
                                FlowState
                            </p>
                            <div style={{ width: 40 }} />
                        </div>

                        {/* Progress dots */}
                        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                            {dots}
                        </div>

                        {/* Content — vertically centered */}
                        <div className="flex-1 flex flex-col justify-center px-2 sm:px-4 pb-4 sm:pb-8">

                            {/* Step label */}
                            <p key={`label-${step}`} className="slide-in text-[8px] sm:text-[10px] font-semibold tracking-[.2em] text-[#777] uppercase mb-2 sm:mb-3">
                                {current.label}
                            </p>

                            {/* Question */}
                            <h1
                                key={`q-${step}`}
                                className="slide-in text-[24px] sm:text-[28px] font-bold text-[#111] leading-tight tracking-[-0.02em] mb-6 sm:mb-8 whitespace-pre-line"
                            >
                                {current.question.split("\n")[0]}
                                <br />
                                <span className="text-[#777]">{current.question.split("\n")[1]}</span>
                            </h1>

                            {/* Input */}
                            <div key={`input-${step}`} className="slide-in relative mb-3">
                                <input
                                    className="fs-input"
                                    type={current.type === "password" && !show ? "password" : "text"}
                                    placeholder={current.placeholder}
                                    value={value}
                                    onChange={(e) => handleChange(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                    autoFocus
                                />
                                {current.type === "password" && (
                                    <button className="eye-toggle" onClick={() => setShow((s) => !s)} tabIndex={-1}>
                                        {show ? "hide" : "show"}
                                    </button>
                                )}
                            </div>

                            {/* Hint */}
                            <p key={`hint-${step}`} className="slide-in text-[10px] sm:text-[11px] text-[#333] mb-1">
                                {current.hint}
                                {current.link && (
                                    <>
                                        {" · "}
                                        <a
                                            href={current.link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#666] underline"
                                        >
                                            {current.link.text}
                                        </a>
                                    </>
                                )}
                            </p>

                            {/* Error */}
                            {error && (
                                <p className="text-red-500 text-xs mb-1">{error}</p>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="px-2 sm:px-4 pb-8 sm:pb-12">
                            <button
                                className="btn-primary w-full py-3 sm:py-3.5 bg-[#111] text-white rounded-2xl text-sm sm:text-base font-semibold tracking-wide"
                                onClick={handleNext}
                                disabled={!value.trim() || saving}
                            >
                                {saving ? "saving..." : isLast ? "add this repo →" : "continue →"}
                            </button>
                        </div>
                    </>
                )}
            </main>
        </>
    );
}