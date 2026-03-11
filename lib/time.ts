import { DAYS, SLOT_INTERVAL_MINUTES, SLOT_START_HOUR, SLOTS_PER_DAY } from "@/lib/constants";
import type { DayIndex } from "@/lib/types";
import { formatTimeLabel } from "@/lib/utils";

export function slotToTimeLabel(slotIndex: number) {
  const totalMinutes = SLOT_START_HOUR * 60 + slotIndex * SLOT_INTERVAL_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return formatTimeLabel(hours, minutes);
}

export function getTimeLabels() {
  return Array.from({ length: SLOTS_PER_DAY }, (_, slotIndex) =>
    slotToTimeLabel(slotIndex)
  );
}

export function getCellKey(dayOfWeek: DayIndex, slotIndex: number) {
  return `${dayOfWeek}:${slotIndex}`;
}

export function parseCellKey(key: string) {
  const [dayOfWeek, slotIndex] = key.split(":").map(Number);
  return { dayOfWeek: dayOfWeek as DayIndex, slotIndex };
}

export function formatDaySlotRange(
  dayOfWeek: DayIndex,
  startSlot: number,
  endSlot: number
) {
  return `${DAYS[dayOfWeek]} ${slotToTimeLabel(startSlot)}-${slotToTimeLabel(endSlot)}`;
}

