import { NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

const STATIC_CONFIG = {
    Top10ResetDays: 7,
    EmergencyPhone: "03-1234-5678",
    MaintenanceMessage: "現在システムメンテナンス中です。お急ぎの場合は緊急連絡先までお電話ください。",
    SupportEmail: "kento170315@icloud.com"
};

export async function GET() {
    try {
        if (!GAS_URL) {
            return NextResponse.json({
                config: STATIC_CONFIG,
                faqs: [],
                guides: [],
                news: [],
            });
        }

        const gasResponse = await fetch(GAS_URL, {
            method: 'GET',
            redirect: 'follow',
            next: { revalidate: 60 },
        });

        const text = await gasResponse.text();
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        } catch {
            parsedData = null;
        }

        // 期待する構造は { faqs: [...], guides: [...], news: [...] } などのオブジェクト
        let resultFaqs = [];
        let resultGuides = [];
        let resultNews = [];

        if (Array.isArray(parsedData)) {
            // もしGAS側がまだ配列だけ返してきている場合はFAQとして処理
            resultFaqs = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
            // オブジェクト形式 (新仕様)
            if (Array.isArray(parsedData.faqs)) resultFaqs = parsedData.faqs;
            if (Array.isArray(parsedData.guides)) resultGuides = parsedData.guides;
            if (Array.isArray(parsedData.news)) resultNews = parsedData.news;
        }

        return NextResponse.json({
            config: STATIC_CONFIG,
            faqs: resultFaqs,
            guides: resultGuides,
            news: resultNews,
        });

    } catch (error) {
        console.error("[Dashboard] Fetch error:", error);
        return NextResponse.json({
            config: STATIC_CONFIG,
            faqs: [],
            guides: [],
            news: [],
        });
    }
}
