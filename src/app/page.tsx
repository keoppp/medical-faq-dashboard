"use client";

import { useState, useMemo } from "react";
import { useFAQData, FAQItem } from "@/hooks/useFAQData";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { FAQList } from "@/components/faq-list";
import { NewsTicker } from "@/components/news-ticker";
import { ManualLibrary } from "@/components/manual-library";
import { AnswerDrawer } from "@/components/answer-drawer";
import { EmptyState } from "@/components/empty-state";
import { DashboardSkeleton, MaintenanceMode } from "@/components/dashboard-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, LogOut, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data, isLoading, isError, incrementViewCount, logActivity, isHighInquiryRisk } = useFAQData();
    const { branchName, logout } = useAuth();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);

    const categories = useMemo(() => {
        if (!data?.faqs) return ["All"];
        const cats = data.faqs.map(f => f.Category);
        return ["All", ...Array.from(new Set(cats))];
    }, [data?.faqs]);

    const filteredFaqs = useMemo(() => {
        if (!data?.faqs) return [];
        let result = data.faqs;
        if (selectedCategory !== "All") {
            result = result.filter(faq => faq.Category === selectedCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(faq =>
                faq.Question.toLowerCase().includes(q) ||
                faq.Search_Tags.toLowerCase().includes(q) ||
                faq.Category.toLowerCase().includes(q)
            );
        }
        return result;
    }, [data?.faqs, selectedCategory, searchQuery]);

    const getTop10Faqs = () => {
        if (!data?.faqs) return [];
        return [...data.faqs]
            .sort((a, b) => {
                const vA = typeof a.Weekly_Views === 'string' ? parseInt(a.Weekly_Views, 10) : (a.Weekly_Views || 0);
                const vB = typeof b.Weekly_Views === 'string' ? parseInt(b.Weekly_Views, 10) : (b.Weekly_Views || 0);
                return vB - vA;
            })
            .slice(0, 10);
    };

    const handleFaqClick = (faq: FAQItem) => {
        setSelectedFaq(faq);
        incrementViewCount(faq.id);
        // Log view activity
        if (branchName) {
            logActivity(branchName, faq.id, "view");
        }
    };

    const handleResolved = (faqId: string | number, action: "resolved" | "unresolved") => {
        if (branchName) {
            logActivity(branchName, faqId, action);
        }
    };

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    if (isError) {
        return (
            <div className="h-screen bg-background">
                <MaintenanceMode message={data?.config?.MaintenanceMessage || "System unavailable."} />
            </div>
        );
    }

    if (!isLoading && !data) return null;

    const isBentoGridState = searchQuery === "" && selectedCategory === "All";
    const top10 = getTop10Faqs();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-foreground selection:bg-rose-100">
            <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <main className="flex-1 flex flex-col min-w-0 h-screen relative">
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-b from-teal-50 via-white to-white pt-10 pb-8 px-6 lg:px-12">
                        <div className="max-w-[720px] mx-auto text-center">
                            {/* Branch Header */}
                            <div className="flex items-center justify-between mb-6 max-w-[560px] mx-auto">
                                <div className="inline-flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center">
                                        <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                                    </div>
                                    <span className="text-[13px] font-semibold text-gray-400 tracking-wide">FAQデモ</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {branchName && (
                                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                                            <Building2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                            <span className="font-medium">{branchName} としてログイン中</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
                                    >
                                        <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        <span>ログアウト</span>
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-[32px] lg:text-[38px] font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                                お困りのことは<br className="sm:hidden" />ありますか？
                            </h1>

                            <div className="max-w-[560px] mx-auto">
                                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 lg:px-12 pb-16">
                        <div className="max-w-[1080px] mx-auto">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <DashboardSkeleton />
                                    </motion.div>
                                ) : (
                                    <motion.div key="content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                                        {isBentoGridState ? (
                                            <div className="flex flex-col gap-12">
                                                <ManualLibrary manuals={data!.manuals} />
                                                <NewsTicker news={data!.news} />
                                                <div>
                                                    <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1">
                                                        よく見られている記事
                                                    </h2>
                                                    <p className="text-[14px] text-gray-400 mb-6">
                                                        過去 {data!.config.Top10ResetDays} 日間でアクセスが多いナレッジです
                                                    </p>

                                                    <FAQList
                                                        faqs={top10}
                                                        config={data!.config}
                                                        onFaqClick={handleFaqClick}
                                                        isTopRanking={true}
                                                        isHighInquiryRisk={isHighInquiryRisk}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-3 mb-8">
                                                    <motion.h2 key={selectedCategory} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-[22px] font-bold tracking-tight text-gray-900">
                                                        {selectedCategory === "All" ? "すべてのナレッジ" : selectedCategory}
                                                    </motion.h2>
                                                    <span className="text-[14px] text-gray-400">
                                                        {filteredFaqs.length} 件
                                                    </span>
                                                </div>

                                                {filteredFaqs.length > 0 ? (
                                                    <FAQList
                                                        faqs={filteredFaqs}
                                                        config={data!.config}
                                                        onFaqClick={handleFaqClick}
                                                        isHighInquiryRisk={isHighInquiryRisk}
                                                    />
                                                ) : (
                                                    <EmptyState config={data?.config} />
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <AnswerDrawer
                faq={selectedFaq}
                isOpen={!!selectedFaq}
                onClose={() => setSelectedFaq(null)}
                currentSearchTerm={searchQuery}
                config={data?.config}
                branchName={branchName}
                onResolved={handleResolved}
            />
        </div>
    );
}
