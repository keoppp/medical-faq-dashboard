"use client";

import { Grid, BrainCircuit, Map, Sparkles, Folder, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    className?: string;
}

const generateIconForCategory = (cat: string) => {
    const cls = "w-[18px] h-[18px]";
    const sw = 1.5;
    if (cat === "All") return <Grid className={cls} strokeWidth={sw} />;
    if (cat.includes("システム") || cat.includes("アプリ")) return <BrainCircuit className={cls} strokeWidth={sw} />;
    if (cat.includes("受付") || cat.includes("会計")) return <Map className={cls} strokeWidth={sw} />;
    if (cat.includes("診察") || cat.includes("予約")) return <Sparkles className={cls} strokeWidth={sw} />;
    return <Folder className={cls} strokeWidth={sw} />;
};

export function Sidebar({ categories, selectedCategory, onSelectCategory, className }: SidebarProps) {
    return (
        <aside className={cn(
            "bg-white flex flex-col w-[240px] h-screen shrink-0 relative z-30 border-r border-gray-100",
            className
        )}>
            {/* Nav items */}
            <div className="flex-1 overflow-y-auto pt-8 pb-6 px-3 space-y-0.5">
                <div className="px-3 mb-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    カテゴリで探す
                </div>

                {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] transition-all duration-200 relative outline-none",
                                isActive
                                    ? "bg-gray-100 text-gray-900 font-semibold"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-normal"
                            )}
                        >
                            <span className={cn(
                                "transition-colors",
                                isActive ? "text-teal-600" : "text-gray-400"
                            )}>
                                {generateIconForCategory(cat)}
                            </span>
                            <span className="truncate">{cat}</span>
                        </button>
                    );
                })}
            </div>

            {/* Support link */}
            <div className="px-3 pb-6 shrink-0">
                <div className="border-t border-gray-100 pt-4">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-normal text-gray-400 hover:text-gray-700 transition-colors rounded-xl hover:bg-gray-50">
                        <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        <span>お問い合わせ</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
