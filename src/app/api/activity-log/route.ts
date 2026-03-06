import { NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export async function POST(request: Request) {
    try {
        const { branchName, faqId, action } = await request.json();

        if (!branchName || !faqId || !action) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!GAS_URL) {
            console.warn("[ActivityLog] GAS URL not configured, skipping log");
            return NextResponse.json({ success: true });
        }

        const gasResponse = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "log",
                branchName,
                faqId: String(faqId),
                action,
            }),
            redirect: 'follow',
        });

        const text = await gasResponse.text();
        console.log("[ActivityLog] GAS response:", text);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ActivityLog] Error:", error);
        return NextResponse.json(
            { success: false, message: "Log recording failed" },
            { status: 500 }
        );
    }
}
