import { and, eq } from "drizzle-orm";
import { availability, meetings, participants } from "@/db/schema";
import { getDb } from "@/lib/cloudflare";
import { buildHeatmap, getBestTimes } from "@/lib/availability";
import { pickParticipantColor } from "@/lib/colors";
import type {
  AvailabilityResponse,
  DayIndex,
  JoinMeetingResponse,
  MeetingSummary
} from "@/lib/types";
import { createSlug, createToken } from "@/lib/utils";

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function createMeeting(input: {
  title: string;
  description: string;
  timezone: string;
}) {
  const db = getDb();
  const timestamp = new Date();

  let slug = createSlug();
  while (await getMeetingBySlug(slug)) {
    slug = createSlug();
  }

  const meeting = {
    id: createId("meeting"),
    slug,
    title: input.title,
    description: input.description || null,
    timezone: input.timezone,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await db.insert(meetings).values(meeting);
  return meeting;
}

export async function getMeetingBySlug(slug: string): Promise<MeetingSummary | null> {
  const db = getDb();
  const [result] = await db.select().from(meetings).where(eq(meetings.slug, slug)).limit(1);

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    slug: result.slug,
    title: result.title,
    description: result.description,
    timezone: result.timezone,
    createdAt: result.createdAt.toISOString()
  };
}

export async function joinMeeting(input: {
  slug: string;
  name: string;
}): Promise<JoinMeetingResponse & { meetingId: string }> {
  const db = getDb();
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.slug, input.slug))
    .limit(1);

  if (!meeting) {
    throw new Error("미팅을 찾을 수 없습니다.");
  }

  const [existing] = await db
    .select()
    .from(participants)
    .where(and(eq(participants.meetingId, meeting.id), eq(participants.name, input.name)))
    .limit(1);

  if (existing) {
    throw new Error("같은 이름의 참여자가 이미 이 미팅에 있습니다.");
  }

  const timestamp = new Date();
  const participant = {
    id: createId("participant"),
    meetingId: meeting.id,
    name: input.name,
    color: pickParticipantColor((await countParticipants(meeting.id)) + 1),
    token: createToken(),
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await db.insert(participants).values(participant);

  return {
    meetingId: meeting.id,
    participant: {
      id: participant.id,
      name: participant.name,
      color: participant.color,
      token: participant.token
    }
  };
}

async function countParticipants(meetingId: string) {
  const db = getDb();
  const items = await db.select().from(participants).where(eq(participants.meetingId, meetingId));
  return items.length;
}

export async function saveParticipantAvailability(input: {
  slug: string;
  participantId: string;
  token: string;
  slots: Array<{ dayOfWeek: DayIndex; slotIndex: number }>;
}) {
  const db = getDb();
  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.slug, input.slug))
    .limit(1);

  if (!meeting) {
    throw new Error("미팅을 찾을 수 없습니다.");
  }

  const [participant] = await db
    .select()
    .from(participants)
    .where(
      and(
        eq(participants.id, input.participantId),
        eq(participants.meetingId, meeting.id),
        eq(participants.token, input.token)
      )
    )
    .limit(1);

  if (!participant) {
    throw new Error("참여자 세션이 올바르지 않습니다.");
  }

  await db.delete(availability).where(eq(availability.participantId, participant.id));

  if (input.slots.length > 0) {
    const now = new Date();
    await db.insert(availability).values(
      input.slots.map((slot) => ({
        id: createId("slot"),
        meetingId: meeting.id,
        participantId: participant.id,
        dayOfWeek: slot.dayOfWeek,
        slotIndex: slot.slotIndex,
        createdAt: now,
        updatedAt: now
      }))
    );
  }

  await db
    .update(participants)
    .set({ updatedAt: new Date() })
    .where(eq(participants.id, participant.id));
}

export async function getMeetingAvailability(slug: string): Promise<AvailabilityResponse | null> {
  const db = getDb();
  const [meeting] = await db.select().from(meetings).where(eq(meetings.slug, slug)).limit(1);

  if (!meeting) {
    return null;
  }

  const participantRows = await db
    .select()
    .from(participants)
    .where(eq(participants.meetingId, meeting.id));

  const availabilityRows = await db
    .select()
    .from(availability)
    .where(eq(availability.meetingId, meeting.id));

  const availabilityByParticipant = availabilityRows.reduce<Record<string, string[]>>(
    (accumulator, row) => {
      accumulator[row.participantId] ??= [];
      accumulator[row.participantId].push(`${row.dayOfWeek}:${row.slotIndex}`);
      return accumulator;
    },
    {}
  );

  const { heatmap, maxCount } = buildHeatmap(availabilityByParticipant);

  return {
    meeting: {
      id: meeting.id,
      slug: meeting.slug,
      title: meeting.title,
      description: meeting.description,
      timezone: meeting.timezone,
      createdAt: meeting.createdAt.toISOString()
    },
    participants: participantRows.map((participant) => ({
      id: participant.id,
      name: participant.name,
      color: participant.color
    })),
    availabilityByParticipant,
    heatmap,
    maxCount
  };
}

export async function getMeetingBestTimes(slug: string) {
  const availabilityResponse = await getMeetingAvailability(slug);

  if (!availabilityResponse) {
    return null;
  }

  return getBestTimes(availabilityResponse.availabilityByParticipant);
}
