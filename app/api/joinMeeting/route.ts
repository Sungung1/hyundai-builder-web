import { NextResponse } from "next/server";
import { joinMeeting } from "@/db/queries";
import { joinMeetingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = joinMeetingSchema.parse(await request.json());
    const result = await joinMeeting(payload);

    return NextResponse.json({ participant: result.participant });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "미팅에 참여하지 못했습니다."
      },
      { status: 400 }
    );
  }
}
