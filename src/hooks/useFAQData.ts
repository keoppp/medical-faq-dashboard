import { useState, useEffect, useCallback } from 'react';

// === Entities ===
export interface FAQItem {
    id: string | number;
    Question: string;
    Answer: string;
    Category: string;
    Search_Tags: string;
    Weekly_Views: number | string;
    Updated_At?: string;
    Status?: string;           // "公開中" | "非公開"
    Inquiry_Weight?: number;   // 受電重み係数
}

export interface ManualItem {
    id: string;
    Title: string;
    Icon: string;
    Url: string;
}

export interface NewsItem {
    id: string;
    Date: string;
    Content: string;
    Type: 'info' | 'alert' | 'update';
}

export interface DashboardConfig {
    Top10ResetDays: number;
    EmergencyPhone: string;
    MaintenanceMessage: string;
    SupportEmail: string;
}

export interface DashboardData {
    faqs: FAQItem[];
    manuals: ManualItem[];
    news: NewsItem[];
    config: DashboardConfig;
}

/**
 * 楽テル連携や別APIソースへの切り替えを意識したデータ抽象フック
 * 
 * 疎結合設計:
 * - UIコンポーネントはこのフックだけを経由してデータを取得する
 * - データソースをGASから楽テルAPIに切り替える場合、
 *   このフック内部の fetch 先を書き換えるだけでUIは修正不要
 * 
 * 受電予測スコア:
 * - Score = Weekly_Views × Inquiry_Weight
 * - Score ≥ 500 のFAQに「受電注意」バッジを表示
 */
export function useFAQData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 将来: 楽テルAPI へ差し替える場合はこの /api/dashboard 側で吸収する
                // const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
                // const response = await fetch(`${gasUrl}?action=dashboard`);
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('API Error');

                const json = await response.json();

                // Status フィルタ: "公開中" のみ表示
                if (json.faqs) {
                    json.faqs = json.faqs.filter(
                        (faq: FAQItem) => !faq.Status || faq.Status === "公開中"
                    );
                }

                setData(json);
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // 閲覧数のインクリメント (Optimistic UI)
    const incrementViewCount = useCallback(async (faqId: string | number) => {
        setData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                faqs: prev.faqs.map(f => {
                    if (f.id === faqId) {
                        const currentViews = typeof f.Weekly_Views === 'string' ? parseInt(f.Weekly_Views, 10) : (f.Weekly_Views || 0);
                        return { ...f, Weekly_Views: currentViews + 1 };
                    }
                    return f;
                })
            }
        });

        try {
            fetch('/api/increment-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: faqId })
            });
        } catch (e) {
            console.error("Failed to increment view count", e);
        }
    }, []);

    /**
     * アクティビティログ記録
     * FAQ閲覧、解決/未解決ボタン押下時に呼ぶ
     * @param branchName 拠点名 (AuthContextから取得)
     * @param faqId FAQ ID
     * @param action "view" | "resolved" | "unresolved"
     */
    const logActivity = useCallback(async (
        branchName: string,
        faqId: string | number,
        action: "view" | "resolved" | "unresolved"
    ) => {
        try {
            // 将来: GAS ActivityLogs シートへ直接POST
            // const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
            // await fetch(`${gasUrl}?action=log`, { ... });
            await fetch('/api/activity-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branchName, faqId, action })
            });
        } catch (e) {
            console.error("Failed to log activity", e);
        }
    }, []);

    /**
     * 受電予測スコアを計算
     * Score = Weekly_Views × Inquiry_Weight
     */
    const getInquiryScore = useCallback((faq: FAQItem): number => {
        const views = typeof faq.Weekly_Views === 'string' ? parseInt(faq.Weekly_Views, 10) : (faq.Weekly_Views || 0);
        const weight = faq.Inquiry_Weight || 0;
        return views * weight;
    }, []);

    /**
     * 受電注意判定 (Score ≥ 500)
     */
    const isHighInquiryRisk = useCallback((faq: FAQItem): boolean => {
        return getInquiryScore(faq) >= 500;
    }, [getInquiryScore]);

    return {
        data,
        isLoading,
        isError,
        incrementViewCount,
        logActivity,
        getInquiryScore,
        isHighInquiryRisk,
    };
}
