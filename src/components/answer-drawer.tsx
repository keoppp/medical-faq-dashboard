"use client";

import { FAQItem, DashboardConfig } from "@/hooks/useFAQData";
import { Copy, Mail, ArrowRight, Tag, CalendarClock, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AnswerDrawerProps {
    faq: FAQItem | null;
    isOpen: boolean;
    onClose: () => void;
    currentSearchTerm: string;
    config?: DashboardConfig;
    branchName?: string | null;
    onResolved?: (faqId: string | number, action: "resolved" | "unresolved") => void;
}

export function AnswerDrawer({ faq, isOpen, onClose, currentSearchTerm, config, branchName, onResolved }: AnswerDrawerProps) {
    const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

    const handleClose = () => {
        setFeedbackGiven(null);
        onClose();
    };

    if (!faq) return null;

    const supportEmail = config?.SupportEmail || "kento170315@icloud.com";

    // コンテキスト情報を含むメール本文
    const emailSubject = `【FAQ問い合わせ】${faq.id}: ${faq.Question}`;
    const emailBody = [
        "以下のFAQを参照しましたが解決しませんでした。",
        "",
        "━━━ コンテキスト情報 ━━━",
        `送信元拠点: ${branchName || "不明"}`,
        `FAQ ID: ${faq.id}`,
        `質問内容: ${faq.Question}`,
        `カテゴリ: ${faq.Category}`,
        `検索キーワード: 「${currentSearchTerm || "なし"}」`,
        `送信日時: ${new Date().toLocaleString("ja-JP")}`,
        "━━━━━━━━━━━━━━━━━",
        "",
        "【ご相談内容】",
        "",
        "",
    ].join("\r\n");

    const mailToUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const handleFeedback = (action: "resolved" | "unresolved") => {
        setFeedbackGiven(action);
        onResolved?.(faq.id, action);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 z-40"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 35 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[580px] bg-white z-50 flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Close */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                            <button
                                onClick={handleClose}
                                className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Header */}
                        <div className="px-8 pb-6 shrink-0">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[12px] font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                                    {faq.Category}
                                </span>
                                <span className="text-[12px] text-gray-400">
                                    {faq.id}
                                </span>
                            </div>

                            <h2 className="text-[24px] font-bold leading-snug tracking-tight text-gray-900">
                                {faq.Question}
                            </h2>
                        </div>

                        <div className="mx-8 h-px bg-gray-100" />

                        {/* Answer */}
                        <div className="flex-1 overflow-y-auto px-8 py-8">
                            {faq.Answer.split('\n').map((line, i) => (
                                <p key={i} className="text-[16px] leading-[1.9] text-gray-700 mb-5 last:mb-0">
                                    {line}
                                </p>
                            ))}

                            {/* 解決フィードバック */}
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                {feedbackGiven ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-4"
                                    >
                                        <p className="text-[15px] font-semibold text-gray-900 mb-1">
                                            {feedbackGiven === "resolved" ? "ありがとうございます！" : "ご不便をおかけしています"}
                                        </p>
                                        <p className="text-[13px] text-gray-400">
                                            {feedbackGiven === "resolved"
                                                ? "フィードバックを記録しました。"
                                                : "下記よりサポートチームにお問い合わせください。"
                                            }
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-[15px] font-semibold text-gray-900">
                                            この内容で解決しましたか？
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleFeedback("resolved")}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                            >
                                                <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                                                はい（解決）
                                            </button>
                                            <button
                                                onClick={() => handleFeedback("unresolved")}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
                                            >
                                                <ThumbsDown className="w-4 h-4" strokeWidth={1.5} />
                                                いいえ（問い合わせへ）
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-gray-100 shrink-0 space-y-4 bg-gray-50/50">
                            <div className="flex items-center justify-between text-[12px] text-gray-400">
                                <div className="flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    <span className="truncate max-w-[200px]">{faq.Search_Tags}</span>
                                </div>
                                {faq.Updated_At && (
                                    <div className="flex items-center gap-1.5">
                                        <CalendarClock className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span>{new Date(faq.Updated_At).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <Copy className="w-4 h-4" strokeWidth={1.5} />
                                    コピー
                                </button>

                                <a
                                    href={mailToUrl}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 transition-all"
                                >
                                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                                    この件について問い合わせる
                                    <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
