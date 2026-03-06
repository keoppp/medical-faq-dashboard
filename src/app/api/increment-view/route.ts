import { NextRequest, NextResponse } from "next/server";

// In-memory store for view counts (resets on server restart)
// In production, this would be persisted to a database or GAS.
const viewCounts: Record<string, number> = {};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id || typeof id !== "string") {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        viewCounts[id] = (viewCounts[id] || 0) + 1;

        return NextResponse.json({ success: true, id, count: viewCounts[id] });
    } catch (error) {
        console.error("increment-view error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
