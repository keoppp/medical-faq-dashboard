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
    Status?: string;
    Inquiry_Weight?: number;
}

export interface GuideItem {
    id: string | number;
    Category: string;
    Title: string;
    Content: string;
    Icon: string;
    Updated_At?: string;
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
    guides: GuideItem[];
    news: NewsItem[];
    config: DashboardConfig;
}

export function useFAQData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('API Error');

                const json = await response.json();

                if (json.faqs) {
                    json.faqs = json.faqs.filter(
                        (faq: FAQItem) => !faq.Status || faq.Status === "公開中"
                    );
                }

                setData({
                    ...json,
                    guides: json.guides || [] // Guideがundefinedの場合も空配列にする
                });
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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

    const logActivity = useCallback(async (
        branchName: string,
        faqId: string | number,
        action: "view" | "resolved" | "unresolved"
    ) => {
        try {
            await fetch('/api/activity-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ branchName, faqId, action })
            });
        } catch (e) {
            console.error("Failed to log activity", e);
        }
    }, []);

    // バックエンド側計算ロジック自体は保持
    const getInquiryScore = useCallback((faq: FAQItem): number => {
        const views = typeof faq.Weekly_Views === 'string' ? parseInt(faq.Weekly_Views, 10) : (faq.Weekly_Views || 0);
        const weight = faq.Inquiry_Weight || 0;
        return views * weight;
    }, []);

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
