import { FAQItem, DashboardConfig } from "@/hooks/useFAQData";
import { ChevronRight, TrendingUp, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQListProps {
    faqs: FAQItem[];
    config: DashboardConfig | undefined;
    onFaqClick: (faq: FAQItem) => void;
    isTopRanking?: boolean;
    isHighInquiryRisk?: (faq: FAQItem) => boolean;
}

const isRecentlyUpdated = (updatedAtStr: string | undefined, configDays: number) => {
    if (!updatedAtStr) return false;
    const updatedAt = new Date(updatedAtStr).getTime();
    const now = new Date().getTime();
    return (now - updatedAt) / (1000 * 60 * 60 * 24) <= configDays;
};

export function FAQList({ faqs, config, onFaqClick, isTopRanking = false, isHighInquiryRisk }: FAQListProps) {
    if (faqs.length === 0) return null;

    return (
        <div className="flex flex-col divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
                {faqs.map((faq, index) => {
                    const isFresh = config ? isRecentlyUpdated(faq.Updated_At, config.Top10ResetDays) : false;
                    const views = typeof faq.Weekly_Views === 'string' ? parseInt(faq.Weekly_Views, 10) : faq.Weekly_Views;
                    const highRisk = isHighInquiryRisk ? isHighInquiryRisk(faq) : false;

                    return (
                        <motion.div
                            layout="position"
                            key={faq.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
                        >
                            <div
                                onClick={() => onFaqClick(faq)}
                                className="group flex items-center gap-5 py-5 cursor-pointer transition-colors duration-200 hover:bg-gray-50 -mx-4 px-4 rounded-xl"
                            >
                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[12px] font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                                            {faq.Category}
                                        </span>
                                        {isFresh && isTopRanking && (
                                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" strokeWidth={2} />
                                                急上昇
                                            </span>
                                        )}
                                        {highRisk && (
                                            <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Phone className="w-3 h-3" strokeWidth={2} />
                                                受電注意
                                            </span>
                                        )}
                                        <span className="text-[12px] text-gray-300 ml-auto">
                                            {views} 閲覧
                                        </span>
                                    </div>

                                    <h3 className="text-[16px] font-medium text-gray-900 leading-relaxed group-hover:underline underline-offset-4 decoration-gray-300">
                                        {faq.Question}
                                    </h3>

                                    {faq.Updated_At && (
                                        <span className="text-[12px] text-gray-400">
                                            {new Date(faq.Updated_At).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            {' '}に更新
                                        </span>
                                    )}
                                </div>

                                {/* Arrow */}
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 transition-all shrink-0 group-hover:translate-x-1" strokeWidth={1.5} />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
