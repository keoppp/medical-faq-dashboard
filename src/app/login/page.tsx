"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { Activity, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggedIn } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Already logged in → redirect
    useEffect(() => {
        if (isLoggedIn) router.replace("/");
    }, [isLoggedIn, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success && data.branchName) {
                login(data.branchName);
                router.replace("/");
            } else {
                setError(data.message || "認証に失敗しました。");
            }
        } catch {
            setError("通信エラーが発生しました。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[400px]"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mb-4"
                        style={{ boxShadow: '0 8px 32px rgba(20,184,166,0.3)' }}
                    >
                        <Activity className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-white text-[20px] font-bold tracking-tight">Premium Medical Dashboard</h1>
                    <p className="text-slate-400 text-[13px] mt-1">拠点パスワードでログイン</p>
                </div>

                {/* Glass card */}
                <div className="bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-8"
                    style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Password input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
                                拠点パスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" strokeWidth={1.5} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="パスワードを入力"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-[14px] placeholder:text-slate-600 outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 transition-all"
                                    autoFocus
                                    required
                                />
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1">
                                パスワード認証で拠点名が自動的に判定されます
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !password}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[14px] font-semibold transition-all hover:from-teal-600 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ boxShadow: '0 4px 20px rgba(20,184,166,0.25)' }}
                        >
                            {isSubmitting ? "認証中..." : "ログイン"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
