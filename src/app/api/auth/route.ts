import { NextResponse } from 'next/server';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, branchName: null, message: "パスワードを入力してください。" },
                { status: 400 }
            );
        }

        if (!GAS_URL) {
            return NextResponse.json(
                { success: false, branchName: null, message: "API URLが未設定です。" },
                { status: 500 }
            );
        }

        const gasResponse = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: "auth", password }),
            redirect: 'follow',
        });

        const text = await gasResponse.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error("[Auth] GAS returned non-JSON:", text.substring(0, 200));
            return NextResponse.json(
                { success: false, branchName: null, message: "認証サーバーに接続できません。" },
                { status: 502 }
            );
        }

        if (data.success) {
            return NextResponse.json({ success: true, branchName: data.branchName });
        } else {
            return NextResponse.json(
                { success: false, branchName: null, message: "パスワードが正しくありません。" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("[Auth] Error:", error);
        return NextResponse.json(
            { success: false, branchName: null, message: "認証処理でエラーが発生しました。" },
            { status: 500 }
        );
    }
}
