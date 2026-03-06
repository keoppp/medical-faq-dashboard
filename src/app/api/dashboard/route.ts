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

// GASが未対応の場合のフォールバックデータ
const STATIC_GUIDES = [
    {
        id: "g1",
        Category: "システム連携",
        Title: "電子カルテ連携セットアップ",
        Icon: "BookOpen",
        Updated_At: "2026/03/01",
        Content: "# 電子カルテ連携セットアップ\n\n本ガイドでは、主要な電子カルテシステムとの連携手順を解説します。\n\n## 1. 動作要件\n- OS: Windows 10/11\n- ネットワーク: 有線LAN推奨\n\n## 2. APIキーの設定\n管理画面の「連携」タブより、発行されたAPIキーを入力してください。\n\n```javascript\n// 設定例\nconst apiKey = 'YOUR_API_KEY';\n```\n\n> 💡 **ヒント**: キー再発行時は古いキーが即座に無効になります。"
    },
    {
        id: "g2",
        Category: "セキュリティ",
        Title: "二段階認証の導入",
        Icon: "ShieldCheck",
        Updated_At: "2026/02/15",
        Content: "# 二段階認証の導入\n\nセキュリティ強化のため、全拠点での二段階認証（2FA）の設定が必須となりました。\n\n## 設定手順\n1. マイページ > セキュリティ設定にアクセス\n2. 「二段階認証を有効にする」をクリック\n3. 認証アプリ（Google Authenticator等）でQRコードを読み取る\n4. 表示された6桁のコードを入力し、保存\n\n不明な点は管理者にお問い合わせください。"
    },
];

export async function GET() {
    try {
        if (!GAS_URL) {
            return NextResponse.json({
                config: STATIC_CONFIG,
                news: STATIC_NEWS,
                guides: STATIC_GUIDES,
                faqs: [],
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
            console.error("[Dashboard] GAS returned non-JSON:", text.substring(0, 200));
            parsedData = [];
        }

        // GASレスポンスが新しい構造 { faqs: [], guides: [] } か、従来の配列 [] か判断
        let rawFaqs = [];
        let rawGuides = [];

        if (Array.isArray(parsedData)) {
            // 現在のFAQ配列のみのレスポンス
            rawFaqs = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
            // 新しい構造
            rawFaqs = parsedData.faqs || [];
            rawGuides = parsedData.guides || [];
        }

        // --- FAQ mapping ---
        let mappedFaqs: Record<string, unknown>[] = [];
        if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
            if (Array.isArray(rawFaqs[0])) {
                mappedFaqs = rawFaqs.map((row: string[]) => ({
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
                mappedFaqs = rawFaqs.map((item: Record<string, unknown>) => ({
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
        }

        // --- Guide mapping ---
        let mappedGuides: Record<string, unknown>[] = [];
        if (Array.isArray(rawGuides) && rawGuides.length > 0) {
            if (Array.isArray(rawGuides[0])) {
                mappedGuides = rawGuides.map((row: string[]) => ({
                    id: row[0] || "",
                    Category: row[1] || "未設定",
                    Title: row[2] || "",
                    Content: row[3] || "",
                    Icon: row[4] || "BookOpen",
                    Updated_At: row[5] || "",
                }));
            } else {
                mappedGuides = rawGuides.map((item: Record<string, unknown>) => ({
                    id: item.id || "",
                    Category: item.Category || "未設定",
                    Title: item.Title || "",
                    Content: item.Content || "",
                    Icon: item.Icon || "BookOpen",
                    Updated_At: item.Updated_At || "",
                }));
            }
        } else {
            // GAS側が未対応の場合はモックデータを返す
            mappedGuides = STATIC_GUIDES;
        }

        return NextResponse.json({
            config: STATIC_CONFIG,
            news: STATIC_NEWS,
            guides: mappedGuides,
            faqs: mappedFaqs,
        });

    } catch (error) {
        console.error("[Dashboard] Fetch error:", error);
        return NextResponse.json({
            config: STATIC_CONFIG,
            news: STATIC_NEWS,
            guides: STATIC_GUIDES,
            faqs: [],
        });
    }
}
