import { DashboardConfig } from "@/hooks/useFAQData";
import { AlertTriangle } from "lucide-react";

export function DashboardSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="flex flex-col gap-4">
                <div className="h-5 w-36 bg-gray-100 rounded-lg" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-50 rounded-2xl border border-gray-100" />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="h-5 w-48 bg-gray-100 rounded-lg" />
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-50 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

interface MaintenanceModeProps {
    message: string;
}

export function MaintenanceMode({ message }: MaintenanceModeProps) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">メンテナンス中</h2>
                <p className="text-[15px] text-gray-500 leading-relaxed">{message}</p>
            </div>
        </div>
    );
}
