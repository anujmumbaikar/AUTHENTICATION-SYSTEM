import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest) {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({error: "User ID is required"}, {status: 400});
        }
        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const body = await req.json();
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: body
        });
        return NextResponse.json({ message: "successfully updated", user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}