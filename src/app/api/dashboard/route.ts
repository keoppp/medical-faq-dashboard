import { NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

const STATIC_CONFIG = {
    Top10ResetDays: 7,
    EmergencyPhone: "03-1234-5678",
    MaintenanceMessage: "現在システムメンテナンス中です。お急ぎの場合は緊急連絡先までお電話ください。",
    SupportEmail: "kento170315@icloud.com"
};

const STATIC_NEWS = [
    { id: "n1", Date: "2026-04-01", Content: "【重要】令和8年度 診療報酬改定に伴うシステムアップデート完了のお知らせ", Type: "alert" },
    { id: "n2", Date: "2026-03-15", Content: "新機能：コンテキスト連携問い合わせフォームが稼働開始しました", Type: "info" }
];

const STATIC_MANUALS = [
    { id: "m1", Title: "電子カルテ操作マニュアル", Icon: "BookOpen", Url: "#" },
    { id: "m2", Title: "オンライン資格確認手順", Icon: "ShieldCheck", Url: "#" },
    { id: "m3", Title: "レセプト返戻対応ガイド", Icon: "FileWarning", Url: "#" }
];

export async function GET() {
    try {
        if (!GAS_URL) {
            return NextResponse.json({
                config: STATIC_CONFIG,
                news: STATIC_NEWS,
                manuals: STATIC_MANUALS,
                faqs: [],
            });
        }

        const gasResponse = await fetch(GAS_URL, {
            method: 'GET',
            redirect: 'follow',
            next: { revalidate: 60 },
        });

        const text = await gasResponse.text();

        let faqs;
        try {
            faqs = JSON.parse(text);
        } catch {
            console.error("[Dashboard] GAS returned non-JSON:", text.substring(0, 200));
            faqs = [];
        }

        let mappedFaqs: Record<string, unknown>[];
        if (Array.isArray(faqs) && faqs.length > 0) {
            if (Array.isArray(faqs[0])) {
                mappedFaqs = faqs.map((row: string[]) => ({
                    id: row[0] || "",
                    Status: row[1] || "公開中",
                    Category: row[2] || "",
                    Question: row[3] || "",
                    Answer: row[4] || "",
                    Search_Tags: row[5] || "",
                    Weekly_Views: parseInt(String(row[6] || "0"), 10),
                    Updated_At: row[7] || "",
                    Inquiry_Weight: parseFloat(String(row[8] || "0")),
                }));
            } else {
                mappedFaqs = faqs.map((item: Record<string, unknown>) => ({
                    id: item.id || "",
                    Status: item.Status || "公開中",
                    Category: item.Category || "",
                    Question: item.Question || "",
                    Answer: item.Answer || "",
                    Search_Tags: item.Search_Tags || "",
                    Weekly_Views: parseInt(String(item.Weekly_Views || "0"), 10),
                    Updated_At: item.Updated_At || "",
                    Inquiry_Weight: parseFloat(String(item.Inquiry_Weight || "0")),
                }));
            }
        } else {
            mappedFaqs = [];
        }

        return NextResponse.json({
            config: STATIC_CONFIG,
            news: STATIC_NEWS,
            manuals: STATIC_MANUALS,
            faqs: mappedFaqs,
        });

    } catch (error) {
        console.error("[Dashboard] Fetch error:", error);
        return NextResponse.json({
            config: STATIC_CONFIG,
            news: STATIC_NEWS,
            manuals: STATIC_MANUALS,
            faqs: [],
        });
    }
}
