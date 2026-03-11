import { NextResponse } from "next/server";
import { saveParticipantAvailability } from "@/db/queries";
import type { DayIndex } from "@/lib/types";
import { saveAvailabilitySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = saveAvailabilitySchema.parse(await request.json());
    await saveParticipantAvailability({
      ...payload,
      slots: payload.slots.map((slot) => ({
        ...slot,
        dayOfWeek: slot.dayOfWeek as DayIndex
      }))
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "가능한 시간을 저장하지 못했습니다."
      },
      { status: 400 }
    );
  }
}
