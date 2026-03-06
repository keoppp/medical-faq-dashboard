import { ManualItem } from "@/hooks/useFAQData";
import { BookOpen, ShieldCheck, FileWarning, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ManualLibraryProps {
    manuals: ManualItem[];
}

const iconConfig: Record<string, { icon: typeof BookOpen; bg: string; color: string }> = {
    BookOpen: { icon: BookOpen, bg: "bg-blue-50", color: "text-blue-600" },
    ShieldCheck: { icon: ShieldCheck, bg: "bg-emerald-50", color: "text-emerald-600" },
    FileWarning: { icon: FileWarning, bg: "bg-amber-50", color: "text-amber-600" },
};

export function ManualLibrary({ manuals }: ManualLibraryProps) {
    if (manuals.length === 0) return null;

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                マニュアル・ガイド
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {manuals.map((manual, i) => {
                    const cfg = iconConfig[manual.Icon] || iconConfig.BookOpen;
                    const Icon = cfg.icon;
                    return (
                        <motion.a
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            key={manual.id}
                            href={manual.Url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${cfg.color}`} strokeWidth={1.5} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug group-hover:text-teal-700 transition-colors">
                                    {manual.Title}
                                </h3>
                                <p className="text-[13px] text-gray-400">ガイドを見る</p>
                            </div>

                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-teal-600 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span>開く</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                            </div>
                        </motion.a>
                    );
                })}
            </div>
        </div>
    );
}
