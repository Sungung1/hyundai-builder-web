"use client";

import { useEffect, useMemo, useState } from "react";
import { DAYS } from "@/lib/constants";
import { hexToRgb } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { getCellKey, getTimeLabels } from "@/lib/time";
import type { AvailabilityPoint, DayIndex } from "@/lib/types";

type GridProps = {
  selected: Set<string>;
  heatmap: AvailabilityPoint[];
  maxCount: number;
  participantColor?: string;
  disabled?: boolean;
  onToggleRange: (cells: Array<{ dayOfWeek: DayIndex; slotIndex: number }>, value: boolean) => void;
};

export function AvailabilityGrid({
  selected,
  heatmap,
  maxCount,
  participantColor = "#11A9D3",
  disabled,
  onToggleRange
}: GridProps) {
  const [mounted, setMounted] = useState(false);
  const timeLabels = useMemo(() => getTimeLabels(), []);
  const heatmapMap = useMemo(
    () => new Map(heatmap.map((entry) => [getCellKey(entry.dayOfWeek, entry.slotIndex), entry.count])),
    [heatmap]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

  useEffect(() => {
    setMounted(true);

    function stopDragging() {
      setIsDragging(false);
    }

    window.addEventListener("pointerup", stopDragging);
    return () => window.removeEventListener("pointerup", stopDragging);
  }, []);

  if (!mounted) {
    return null;
  }

  function applyCell(dayOfWeek: DayIndex, slotIndex: number, nextValue: boolean) {
    onToggleRange([{ dayOfWeek, slotIndex }], nextValue);
  }

  function getBackground(dayOfWeek: DayIndex, slotIndex: number) {
    const key = getCellKey(dayOfWeek, slotIndex);
    const count = heatmapMap.get(key) ?? 0;
    const isSelected = selected.has(key);

    if (isSelected) {
      return participantColor;
    }

    if (!count || !maxCount) {
      return "transparent";
    }

    const opacity = Math.max(0.1, count / maxCount);
    const rgb = hexToRgb(participantColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(0.5, opacity * 0.45)})`;
  }

  return (
    <section className="rounded-[28px] border border-border/70 bg-card/90 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">주간 시간표</h2>
          <p className="text-sm text-muted-foreground">
            아래 주간 시간표에서 가능한 시간을 선택하세요.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>08:00-22:00</p>
          <p>30분 단위</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[760px] gap-2 md:min-w-[900px]"
          style={{ gridTemplateColumns: "90px repeat(7, minmax(0, 1fr))" }}
        >
          <div />
          {DAYS.map((day) => (
            <div
              key={day}
              className="sticky top-0 rounded-2xl bg-muted/80 px-3 py-2 text-center text-sm font-semibold"
            >
              {day}
            </div>
          ))}

          {timeLabels.map((label, slotIndex) => (
            <GridRow
              key={label}
              label={label}
              slotIndex={slotIndex}
              selected={selected}
              disabled={disabled}
              isDragging={isDragging}
              dragValue={dragValue}
              getBackground={getBackground}
              onDragStart={(dayOfWeek, nextValue) => {
                setIsDragging(true);
                setDragValue(nextValue);
                applyCell(dayOfWeek, slotIndex, nextValue);
              }}
              onDragEnter={(dayOfWeek) => {
                if (isDragging) {
                  applyCell(dayOfWeek, slotIndex, dragValue);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GridRow({
  label,
  slotIndex,
  selected,
  disabled,
  isDragging,
  dragValue,
  getBackground,
  onDragStart,
  onDragEnter
}: {
  label: string;
  slotIndex: number;
  selected: Set<string>;
  disabled?: boolean;
  isDragging: boolean;
  dragValue: boolean;
  getBackground: (dayOfWeek: DayIndex, slotIndex: number) => string;
  onDragStart: (dayOfWeek: DayIndex, nextValue: boolean) => void;
  onDragEnter: (dayOfWeek: DayIndex) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-end pr-3 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      {DAYS.map((_, dayIndex) => {
        const dayOfWeek = dayIndex as DayIndex;
        const key = getCellKey(dayOfWeek, slotIndex);
        const isSelected = selected.has(key);

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onPointerDown={() => onDragStart(dayOfWeek, !isSelected)}
            onPointerEnter={() => {
              if (isDragging) {
                onDragEnter(dayOfWeek);
              }
            }}
            className={cn(
              "h-8 rounded-xl border border-border/50 transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "hover:border-primary/50 hover:shadow-sm",
              disabled && "cursor-not-allowed opacity-60"
            )}
            style={{
              background: getBackground(dayOfWeek, slotIndex),
              boxShadow: isSelected
                ? "inset 0 0 0 1px rgba(255,255,255,0.55)"
                : undefined,
              opacity: isDragging && dragValue === false && isSelected ? 0.95 : 1
            }}
            aria-label={`${DAYS[dayIndex]} ${label}`}
          />
        );
      })}
    </>
  );
}
