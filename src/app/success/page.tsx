    "use client";

    import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

    export default function SuccessPage() {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Mock note preview — replace with actual data from your API route
    // e.g. pass via router state or localStorage after the push succeeds
    const note = {
        title: "Gas prices note",
        type: "Reference",
        tags: ["#finance", "#reference"],
        preview: "Gas prices have been rising due to seasonal demand. Worth monitoring over Q3.",
        filename: "2026-05-07-gas-prices-note.md",
    };

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!visible) return;
        const interval = setInterval(() => {
        setCountdown((c) => {
            if (c <= 1) {
            clearInterval(interval);
            router.push("/capture");
            }
            return c - 1;
        });
        }, 1000);
        return () => clearInterval(interval);
    }, [visible, router]);

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
            .fs-root { font-family: 'Space Grotesk', sans-serif; }

            .pop-in {
            animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            @keyframes popIn {
            from { opacity: 0; transform: scale(0.7); }
            to   { opacity: 1; transform: scale(1); }
            }

            .slide-up {
            animation: slideUp 0.4s ease forwards;
            }
            @keyframes slideUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
            }

            .fade-in {
            animation: fadeIn 0.4s ease forwards;
            }
            @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
            }

            .tag-pill {
            display: inline-block;
            background: #F5F5F5;
            color: #333;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.05em;
            padding: 4px 10px;
            border-radius: 999px;
            }

            .progress-bar {
            height: 2px;
            background: #EBEBEB;
            border-radius: 999px;
            overflow: hidden;
            }
            .progress-fill {
            height: 100%;
            background: #111;
            border-radius: 999px;
            animation: drain 5s linear forwards;
            }
            @keyframes drain {
            from { width: 100%; }
            to   { width: 0%; }
            }

            .now-btn {
            transition: color 0.15s ease;
            }
            .now-btn:hover { color: #555; }
        `}</style>

        <main className="fs-root w-full h-screen bg-[#FFFFFF] flex flex-col overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center justify-between px-8 pt-12">
            <p className="text-[9px] font-semibold tracking-[.28em] text-[#CCC] uppercase">
                FlowState
            </p>
            <button
                onClick={() => router.push("/capture")}
                className="now-btn text-[11px] text-[#CCC] font-medium tracking-wide"
            >
                back to capture
            </button>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

            {/* Check mark */}
            {visible && (
                <div
                className="pop-in w-20 h-20 rounded-full bg-[#111] flex items-center justify-center"
                style={{ animationDelay: "0ms" }}
                >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                </div>
            )}

            {/* Title */}
            {visible && (
                <div
                className="slide-up text-center flex flex-col gap-1"
                style={{ animationDelay: "100ms", opacity: 0 }}
                >
                <h1 className="text-[26px] font-bold text-[#111] tracking-[-0.02em] leading-snug">
                    filed.
                </h1>
                <p className="text-[#BBB] text-sm font-medium">
                    your thought is in the vault.
                </p>
                </div>
            )}

            {/* Note preview card */}
            {visible && (
                <div
                className="slide-up w-full rounded-2xl border border-[#F0F0F0] bg-[#FAFAFA] p-5 flex flex-col gap-3"
                style={{ animationDelay: "200ms", opacity: 0 }}
                >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold text-[#111] leading-snug">
                    {note.title}
                    </p>
                    <span className="tag-pill shrink-0">{note.type}</span>
                </div>

                {/* Preview text */}
                <p className="text-[12px] text-[#444] leading-relaxed">
                    {note.preview}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                    {note.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                </div>

                {/* Filename */}
                <div className="border-t border-[#EBEBEB] pt-3 flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <p className="text-[10px] text-[#CCC] font-mono tracking-wide">
                    {note.filename}
                    </p>
                </div>
                </div>
            )}
            </div>

            {/* Bottom — countdown + redirect */}
            {visible && (
            <div
                className="fade-in px-8 pb-12 flex flex-col gap-3"
                style={{ animationDelay: "400ms", opacity: 0 }}
            >
                {/* Progress bar */}
                <div className="progress-bar">
                <div className="progress-fill" />
                </div>

                <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#CCC]">
                    back to capture in {countdown}s
                </p>
                <button
                    className="now-btn text-[11px] text-[#BBB] font-semibold"
                    onClick={() => router.push("/capture")}
                >
                    go now →
                </button>
                </div>
            </div>
            )}

        </main>
        </>
    );
    }