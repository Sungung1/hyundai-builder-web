import { BEST_TIME_LIMIT, DAYS, SLOTS_PER_DAY } from "@/lib/constants";
import type { AvailabilityPoint, BestTime, DayIndex } from "@/lib/types";
import { formatDaySlotRange, getCellKey } from "@/lib/time";

export function buildHeatmap(
  participantAvailability: Record<string, string[]>
): { heatmap: AvailabilityPoint[]; maxCount: number } {
  const counts = new Map<string, number>();

  for (const entries of Object.values(participantAvailability)) {
    for (const key of entries) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  let maxCount = 0;
  const heatmap: AvailabilityPoint[] = [];

  for (let day = 0; day < DAYS.length; day += 1) {
    for (let slot = 0; slot < SLOTS_PER_DAY; slot += 1) {
      const count = counts.get(getCellKey(day as DayIndex, slot)) ?? 0;
      maxCount = Math.max(maxCount, count);
      heatmap.push({
        dayOfWeek: day as DayIndex,
        slotIndex: slot,
        count
      });
    }
  }

  return { heatmap, maxCount };
}

export function getBestTimes(
  participantAvailability: Record<string, string[]>
): BestTime[] {
  const { heatmap } = buildHeatmap(participantAvailability);
  const grid = new Map(heatmap.map((entry) => [getCellKey(entry.dayOfWeek, entry.slotIndex), entry.count]));
  const bestTimes: BestTime[] = [];

  for (let day = 0; day < DAYS.length; day += 1) {
    let start = -1;
    let score = 0;

    for (let slot = 0; slot <= SLOTS_PER_DAY; slot += 1) {
      const count =
        slot < SLOTS_PER_DAY
          ? grid.get(getCellKey(day as DayIndex, slot)) ?? 0
          : 0;

      if (count > 0 && start === -1) {
        start = slot;
        score = count;
        continue;
      }

      if (count > 0 && count === score) {
        continue;
      }

      if (start !== -1) {
        bestTimes.push({
          dayOfWeek: day as DayIndex,
          startSlot: start,
          endSlot: slot,
          score,
          label: formatDaySlotRange(day as DayIndex, start, slot)
        });
      }

      if (count > 0) {
        start = slot;
        score = count;
      } else {
        start = -1;
        score = 0;
      }
    }
  }

  return bestTimes
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const aDuration = a.endSlot - a.startSlot;
      const bDuration = b.endSlot - b.startSlot;
      if (bDuration !== aDuration) {
        return bDuration - aDuration;
      }

      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }

      return a.startSlot - b.startSlot;
    })
    .slice(0, BEST_TIME_LIMIT);
}

