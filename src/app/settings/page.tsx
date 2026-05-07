"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({ githubToken: "", repoName: "" });
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
            localStorage.setItem("fs_github_token", values.githubToken);
            localStorage.setItem("fs_repo_name", values.repoName);
            await new Promise((r) => setTimeout(r, 500));
            router.push("/capture");
        } else {
            setShow(false);
            setStep((s) => s + 1);
        }
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
                background: i === step ? "#111" : "#DDD",
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
            border-bottom: 1.5px solid #EBEBEB;
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
            .fs-input::placeholder { color: #CCC; font-weight: 400; }

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
            color: #CCC;
            font-size: 14px;
            padding: 4px;
            transition: color 0.15s;
            }
            .eye-toggle:hover { color: #888; }

            .back-btn { transition: color 0.15s ease; }
            .back-btn:hover { color: #999; }

            .slide-in {
            animation: slideIn 0.25s ease forwards;
            }
            @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
            }
        `}</style>

            <main className="fs-root w-full h-screen bg-[#FFFFFF] flex flex-col overflow-hidden">

                {/* Top nav */}
                <div className="flex items-center justify-between px-8 pt-12">
                    <button
                        onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
                        className="back-btn text-xs text-[#BBB] font-medium tracking-wide"
                    >
                        ← back
                    </button>
                    <p className="text-[9px] font-semibold tracking-[.28em] text-[#BBB] uppercase">
                        FlowState
                    </p>
                    <div style={{ width: 40 }} />
                </div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {dots}
                </div>

                {/* Content — vertically centered */}
                <div className="flex-1 flex flex-col justify-center px-8 pb-4">

                    {/* Step label */}
                    <p key={`label-${step}`} className="slide-in text-[10px] font-semibold tracking-[.2em] text-[#BBB] uppercase mb-3">
                        {current.label}
                    </p>

                    {/* Question */}
                    <h1
                        key={`q-${step}`}
                        className="slide-in text-[28px] font-bold text-[#111] leading-tight tracking-[-0.02em] mb-8 whitespace-pre-line"
                    >
                        {current.question.split("\n")[0]}
                        <br />
                        <span className="text-[#BBB]">{current.question.split("\n")[1]}</span>
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
                    <p key={`hint-${step}`} className="slide-in text-[11px] text-[#CCC] mb-1">
                        {current.hint}
                        {current.link && (
                            <>
                                {" · "}
                                <a
                                    href={current.link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#AAA] underline"
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
                <div className="px-8 pb-12">
                    <button
                        className="btn-primary w-full py-3.5 bg-[#111] text-white rounded-2xl text-sm font-semibold tracking-wide"
                        onClick={handleNext}
                        disabled={!value.trim() || saving}
                    >
                        {saving ? "saving..." : isLast ? "finish setup →" : "continue →"}
                    </button>
                </div>

            </main>
        </>
    );
}