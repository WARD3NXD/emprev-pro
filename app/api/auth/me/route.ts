// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const token = auth.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null }, { status: 200 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("me error", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
