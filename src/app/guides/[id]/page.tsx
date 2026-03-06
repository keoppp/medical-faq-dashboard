"use client";

import { useFAQData, GuideItem } from "@/hooks/useFAQData";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Mail, Search, CalendarClock, Folder, UserCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default function GuidePage() {
    const params = useParams();
    const router = useRouter();
    const { branchName } = useAuth();
    const { data, isLoading, isError } = useFAQData();
    const [guide, setGuide] = useState<GuideItem | null>(null);

    const guideId = params?.id as string;

    useEffect(() => {
        if (data?.guides && guideId) {
            const found = data.guides.find(g => String(g.id) === String(guideId));
            setGuide(found || null);
        }
    }, [data, guideId]);

    if (isError) {
        return <div className="p-10 text-center text-red-500">エラーが発生しました。</div>;
    }

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-10">
                <DashboardSkeleton />
            </div>
        );
    }

    if (!guide && data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-white">
                <h1 className="text-2xl font-bold mb-4">ガイドが見つかりません</h1>
                <Link href="/" className="text-teal-600 hover:underline">ダッシュボードへ戻る</Link>
            </div>
        );
    }

    if (!guide) return null;

    const supportEmail = data?.config?.SupportEmail || "kento170315@icloud.com";

    // Mailto context
    const emailSubject = `【ガイド問い合わせ】${guide.id}: ${guide.Title}`;
    const emailBody = [
        "以下のガイドを参照しましたが不明点があります。",
        "",
        "━━━ コンテキスト情報 ━━━",
        `送信元拠点: ${branchName || "不明"}`,
        `ガイド ID: ${guide.id}`,
        `タイトル: ${guide.Title}`,
        `カテゴリ: ${guide.Category}`,
        `送信日時: ${new Date().toLocaleString("ja-JP")}`,
        "━━━━━━━━━━━━━━━━━",
        "",
        "【ご相談内容】",
        "",
        "",
    ].join("\r\n");

    const mailToUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // 簡易的な目次抽出（Markdownの # または ## を抽出）
    const extractToc = (md: string) => {
        const regex = /^(#{1,3})\s+(.+)$/gm;
        const toc = [];
        let match;
        while ((match = regex.exec(md)) !== null) {
            toc.push({ level: match[1].length, text: match[2] });
        }
        return toc;
    };

    const toc = extractToc(guide.Content);

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-teal-100 flex flex-col">
            {/* Header Navbar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                        <Link href="/" className="hover:text-gray-900 transition-colors">ダッシュボード</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900 truncate max-w-[200px]">{guide.Title}</span>
                    </div>
                </div>
                {branchName && (
                    <div className="text-[12px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        {branchName} としてログイン中
                    </div>
                )}
            </header>

            <div className="flex-1 max-w-[1200px] w-full mx-auto flex flex-col lg:flex-row gap-12 px-6 lg:px-10 py-12">

                {/* Left: Table of Contents */}
                <aside className="hidden lg:block w-[240px] shrink-0 relative">
                    <div className="sticky top-[100px]">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">目次</h4>
                        <nav className="flex flex-col gap-2.5 border-l border-gray-100 pl-4">
                            {toc.map((item, i) => (
                                <a
                                    key={i}
                                    href={`#${item.text.replace(/\s+/g, '-').toLowerCase()}`}
                                    className={`text-[13px] hover:text-teal-600 transition-colors line-clamp-2 ${item.level === 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                                >
                                    {item.text}
                                </a>
                            ))}
                            {toc.length === 0 && (
                                <span className="text-[13px] text-gray-400">目次はありません</span>
                            )}
                        </nav>
                    </div>
                </aside>

                {/* Center: Main Content */}
                <main className="flex-1 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[700px]"
                    >
                        {/* Title & Meta for Mobile */}
                        <div className="mb-10 lg:mb-16">
                            <h1 className="text-[32px] sm:text-[40px] font-extrabold leading-[1.2] tracking-tight text-gray-900 mb-6">
                                {guide.Title}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-500 text-[13px] border-b border-gray-100 pb-8 lg:hidden">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                    <Folder className="w-3.5 h-3.5" />
                                    <span>{guide.Category}</span>
                                </div>
                                {guide.Updated_At && (
                                    <div className="flex items-center gap-1.5">
                                        <CalendarClock className="w-3.5 h-3.5" />
                                        <span>{new Date(guide.Updated_At).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Markdown Content */}
                        <article className="prose prose-slate prose-img:rounded-xl prose-img:border prose-img:border-gray-100 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 id={props.children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props} />,
                                    h2: ({ node, ...props }) => <h2 id={props.children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props} />,
                                    h3: ({ node, ...props }) => <h3 id={props.children?.toString().replace(/\s+/g, '-').toLowerCase()} {...props} />,
                                }}
                            >
                                {guide.Content}
                            </ReactMarkdown>
                        </article>

                        {/* Bottom: UX Flows (Next Actions) */}
                        <div className="mt-20 pt-10 border-t border-gray-100">
                            <h3 className="text-[18px] font-bold text-gray-900 mb-6 tracking-tight">ネクストアクション</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Flow 1: Search FAQ */}
                                <Link href="/" className="group flex flex-col p-5 rounded-2xl border border-gray-200 hover:border-teal-200 hover:bg-teal-50/30 transition-all">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
                                        <Search className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
                                    </div>
                                    <span className="text-[15px] font-semibold text-gray-900 group-hover:text-teal-700">FAQで再検索する</span>
                                </Link>

                                {/* Flow 2: Mail Support */}
                                <a href={mailToUrl} className="group flex flex-col p-5 rounded-2xl border border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                                        <Mail className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
                                    </div>
                                    <span className="text-[15px] font-semibold text-gray-900 group-hover:text-emerald-700">管理者へ直接問い合わせる</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Right: Metadata */}
                <aside className="hidden lg:block w-[240px] shrink-0">
                    <div className="sticky top-[100px] flex flex-col gap-6 p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div>
                            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">カテゴリ</span>
                            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 shadow-sm">
                                <Folder className="w-3.5 h-3.5 text-gray-400" />
                                {guide.Category}
                            </div>
                        </div>

                        <div>
                            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">更新日</span>
                            <div className="flex items-center gap-1.5 text-[14px] text-gray-700">
                                <CalendarClock className="w-4 h-4 text-gray-400" />
                                {guide.Updated_At ? new Date(guide.Updated_At).toLocaleDateString('ja-JP') : '未設定'}
                            </div>
                        </div>

                        <div>
                            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">作成者</span>
                            <div className="flex items-center gap-2 text-[14px] text-gray-700">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <UserCheck className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="font-medium">本部システム部</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
