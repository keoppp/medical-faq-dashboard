import { GuideItem } from "@/hooks/useFAQData";
import { BookOpen, ShieldCheck, FileWarning, ArrowRight, Video, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ManualLibraryProps {
    guides?: GuideItem[];
}

const iconComponentMap: Record<string, React.ElementType> = {
    BookOpen,
    ShieldCheck,
    FileWarning,
    Video,
    Link2,
};

export function ManualLibrary({ guides = [] }: ManualLibraryProps) {
    if (guides.length === 0) return null;

    return (
        <div>
            <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                    マニュアル・ガイド
                </h2>
            </div>

            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 -mx-6 px-6 lg:-mx-12 lg:px-12 scrollbar-hide">
                {guides.map((guide, i) => {
                    const IconComponent = iconComponentMap[guide.Icon] || BookOpen;

                    return (
                        <Link key={guide.id} href={`/guides/${guide.id}`} className="shrink-0 w-[260px] sm:w-[320px] snap-start">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="group relative bg-white border border-gray-100 rounded-[24px] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 h-full flex flex-col items-start cursor-pointer hover:-translate-y-0.5 overflow-hidden"
                            >
                                {/* Decorative background shape */}
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-50/50 group-hover:scale-110 transition-transform duration-500 ease-out" />

                                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors relative z-10 shrink-0">
                                    <IconComponent className="w-6 h-6 text-teal-600" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-[17px] font-semibold text-gray-900 leading-snug mb-2 relative z-10 line-clamp-2">
                                    {guide.Title}
                                </h3>

                                <span className="text-[12px] font-medium text-teal-700 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full mt-auto relative z-10 border border-teal-100">
                                    {guide.Category}
                                </span>

                                <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
