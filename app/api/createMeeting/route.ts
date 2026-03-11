import { NextResponse } from "next/server";
import { createMeeting } from "@/db/queries";
import { createMeetingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = createMeetingSchema.parse(await request.json());
    const meeting = await createMeeting(payload);

    return NextResponse.json({ slug: meeting.slug });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "미팅을 만들지 못했습니다."
      },
      { status: 400 }
    );
  }
}
