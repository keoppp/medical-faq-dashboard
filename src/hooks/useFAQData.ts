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
    id: string | number;
    Date: string;
    Content: string;
    Type: 'info' | 'alert' | 'update' | string;
    Category?: string; // 重要、運営など
    Title?: string;
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
    const [data, setData] = useState<DashboardData>({
        faqs: [],
        guides: [],
        news: [],
        config: {
            Top10ResetDays: 7,
            EmergencyPhone: "03-1234-5678",
            MaintenanceMessage: "現在システムメンテナンス中です。",
            SupportEmail: "kento170315@icloud.com"
        }
    });
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
                    faqs: json.faqs || [],
                    guides: json.guides || [],
                    news: json.news || [],
                    config: json.config
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

    return {
        data,
        isLoading,
        isError,
        incrementViewCount,
        logActivity,
    };
}
