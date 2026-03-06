import { Search, PhoneCall } from "lucide-react";
import { DashboardConfig } from "@/hooks/useFAQData";

export function EmptyState({ config }: { config: DashboardConfig | undefined }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 w-full text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <Search className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
            </div>

            <h3 className="text-[18px] font-bold tracking-tight text-gray-900 mb-2">結果が見つかりません</h3>
            <p className="text-gray-500 text-[14px] max-w-sm leading-relaxed mb-8">
                検索条件に一致するナレッジがありませんでした。キーワードを変えてお試しください。
            </p>

            {config?.EmergencyPhone && (
                <a
                    href={`tel:${config.EmergencyPhone}`}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                >
                    <PhoneCall className="w-4 h-4" strokeWidth={1.5} />
                    電話サポート
                    <span className="text-gray-400 border-l border-gray-700 pl-2 ml-1 font-mono">
                        {config.EmergencyPhone}
                    </span>
                </a>
            )}
        </div>
    );
}
