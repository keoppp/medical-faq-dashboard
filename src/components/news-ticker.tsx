import { NewsItem } from "@/hooks/useFAQData";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsTickerProps {
    news: NewsItem[];
}

export function NewsTicker({ news }: NewsTickerProps) {
    if (news.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
                最新のお知らせ
            </h2>

            <div className="flex flex-col divide-y divide-gray-100">
                {news.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                        {item.Type === 'alert' ? (
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="relative">
                                    <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 pulse-dot" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Info className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                            </div>
                        )}

                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {item.Date.replace(/-/g, '.')}
                            </span>
                            <p className={cn(
                                "text-[15px] leading-relaxed",
                                item.Type === 'alert'
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-600 font-normal"
                            )}>
                                {item.Content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
