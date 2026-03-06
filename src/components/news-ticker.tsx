import { NewsItem } from "@/hooks/useFAQData";
import { Megaphone, ChevronRight, X, CalendarClock, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsTickerProps {
    news?: NewsItem[];
}

export function NewsTicker({ news = [] }: NewsTickerProps) {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    if (news.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-[18px]">
                    <Megaphone className="w-5 h-5 text-teal-600" />
                    <h2>最新のお知らせ</h2>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <div className="flex flex-col divide-y divide-gray-50">
                    {news.map((item, index) => {
                        const isAlert = item.Category === '重要' || item.Type === 'alert';
                        const isInfo = item.Category === '運営' || item.Type === 'info';

                        return (
                            <div
                                key={item.id || `news-${index}`}
                                onClick={() => setSelectedNews(item)}
                                className="group flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50/80 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[13px] font-medium text-gray-400 tabular-nums">
                                        {new Date(item.Date).toLocaleDateString('ja-JP')}
                                    </span>
                                    {isAlert ? (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
                                            {item.Category || "重要"}
                                        </span>
                                    ) : isInfo ? (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                            {item.Category || "運営"}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-50 text-gray-500 border border-gray-200">
                                            {item.Category || "一般"}
                                        </span>
                                    )}
                                </div>

                                <span className="text-[14px] text-gray-800 font-medium line-clamp-1 group-hover:text-teal-700 transition-colors flex-1">
                                    {item.Title || item.Content}
                                </span>

                                <ChevronRight className="hidden sm:block w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* News Detail Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedNews(null)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
                            >
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                                        <CalendarClock className="w-4 h-4" />
                                        {new Date(selectedNews.Date).toLocaleDateString('ja-JP')}
                                        <span className="px-2 py-0.5 ml-2 rounded text-[11px] font-bold bg-white border border-gray-200 shadow-sm">
                                            {selectedNews.Category || "お知らせ"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200/50 text-gray-400 transition-colors"
                                    >
                                        <X className="w-4 h-4" strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <h3 className="text-[20px] font-bold text-gray-900 mb-6 leading-snug">
                                        {selectedNews.Title || "お知らせ詳細"}
                                    </h3>

                                    <div className="prose prose-sm text-gray-600 leading-relaxed max-w-none">
                                        {selectedNews.Content?.split('\n').map((line, i) => (
                                            <p key={i} className="mb-4 last:mb-0">{line}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end">
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="px-5 py-2.5 rounded-xl font-medium text-[14px] text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
