export const DAYS = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일"
] as const;

export const SLOT_START_HOUR = 8;
export const SLOT_END_HOUR = 22;
export const SLOT_INTERVAL_MINUTES = 30;
export const SLOTS_PER_DAY =
  ((SLOT_END_HOUR - SLOT_START_HOUR) * 60) / SLOT_INTERVAL_MINUTES;

export const LIVE_REFRESH_MS = 8000;
export const BEST_TIME_LIMIT = 5;
