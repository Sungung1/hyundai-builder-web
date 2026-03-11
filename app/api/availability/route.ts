import { NextResponse } from "next/server";
import { getMeetingAvailability } from "@/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "미팅 슬러그가 필요합니다." }, { status: 400 });
  }

  const availability = await getMeetingAvailability(slug);
  if (!availability) {
    return NextResponse.json({ error: "미팅을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(availability);
}
