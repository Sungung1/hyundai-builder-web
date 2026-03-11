import { DAYS } from "@/lib/constants";
import type { BestTime } from "@/lib/types";
import { slotToTimeLabel } from "@/lib/time";

export function BestTimesPanel({ bestTimes }: { bestTimes: BestTime[] }) {
  return (
    <section className="rounded-[28px] border border-border/70 bg-card/90 p-5">
      <h2 className="text-lg font-semibold tracking-tight">추천 미팅 시간</h2>
      <div className="mt-4 space-y-3">
        {bestTimes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            참여자가 가능한 시간을 입력하면 추천 시간이 여기에 표시됩니다.
          </p>
        ) : (
          bestTimes.map((time) => (
            <div
              key={`${time.dayOfWeek}-${time.startSlot}-${time.endSlot}`}
              className="rounded-2xl border border-border/60 bg-background/60 p-4 transition hover:border-primary/30"
            >
              <p className="text-sm font-semibold">
                {DAYS[time.dayOfWeek]}
                {" "}
                {slotToTimeLabel(time.startSlot)}-{slotToTimeLabel(time.endSlot)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {time.score}명 가능
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
