export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AvailabilityCell = {
  dayOfWeek: DayIndex;
  slotIndex: number;
  participantId?: string;
};

export type ParticipantSummary = {
  id: string;
  name: string;
  color: string;
};

export type MeetingSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  timezone: string;
  createdAt: string;
};

export type AvailabilityPoint = {
  dayOfWeek: DayIndex;
  slotIndex: number;
  count: number;
};

export type BestTime = {
  dayOfWeek: DayIndex;
  startSlot: number;
  endSlot: number;
  score: number;
  label: string;
};

export type AvailabilityResponse = {
  meeting: MeetingSummary;
  participants: ParticipantSummary[];
  availabilityByParticipant: Record<string, string[]>;
  heatmap: AvailabilityPoint[];
  maxCount: number;
};

export type JoinMeetingResponse = {
  participant: ParticipantSummary & {
    token: string;
  };
};

