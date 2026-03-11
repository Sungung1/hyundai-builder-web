import type { ParticipantSummary } from "@/lib/types";

export function ParticipantsPanel({
  participants,
  currentParticipantId
}: {
  participants: ParticipantSummary[];
  currentParticipantId?: string;
}) {
  return (
    <section className="rounded-[28px] border border-border/70 bg-card/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">참여자</h2>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {participants.length}명 참여
        </span>
      </div>
      <div className="space-y-3">
        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 참여한 사람이 없습니다.</p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 transition hover:border-primary/30"
            >
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: participant.color }}
              />
              <span className="text-sm font-medium">
                {participant.name}
                {participant.id === currentParticipantId ? " (나)" : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
