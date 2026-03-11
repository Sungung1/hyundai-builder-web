"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, LoaderCircle, RefreshCw } from "lucide-react";
import {
  getAvailabilityRequest,
  getBestTimesRequest,
  joinMeetingRequest,
  saveAvailabilityRequest
} from "@/api/client";
import { AvailabilityGrid } from "@/components/availability-grid";
import { BestTimesPanel } from "@/components/best-times-panel";
import { ParticipantsPanel } from "@/components/participants-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { LIVE_REFRESH_MS } from "@/lib/constants";
import { useMeetingStore } from "@/lib/store/meeting-store";
import type {
  AvailabilityResponse,
  BestTime,
  DayIndex,
  MeetingSummary
} from "@/lib/types";
import { getCellKey, parseCellKey } from "@/lib/time";

type MeetingShellProps = {
  initialData: AvailabilityResponse;
  initialBestTimes: BestTime[];
};

export function MeetingShell({ initialData, initialBestTimes }: MeetingShellProps) {
  const [mounted, setMounted] = useState(false);
  const [availability, setAvailability] = useState(initialData);
  const [bestTimes, setBestTimes] = useState(initialBestTimes);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const session = useMeetingStore((state) => state.sessions[initialData.meeting.slug]);
  const setSession = useMeetingStore((state) => state.setSession);

  const serverSelected = useMemo(() => {
    if (!session?.participantId) {
      return [];
    }

    return availability.availabilityByParticipant[session.participantId] ?? [];
  }, [availability.availabilityByParticipant, session?.participantId]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(serverSelected);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isDirty) {
      setSelectedKeys(serverSelected);
    }
  }, [isDirty, serverSelected]);

  const selected = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  useEffect(() => {
    let isMounted = true;

    async function refresh() {
      if (isDirty || isSaving) {
        return;
      }

      try {
        const [nextAvailability, nextBestTimes] = await Promise.all([
          getAvailabilityRequest(initialData.meeting.slug),
          getBestTimesRequest(initialData.meeting.slug)
        ]);

        if (!isMounted) {
          return;
        }

        setAvailability(nextAvailability);
        setBestTimes(nextBestTimes.bestTimes);
      } catch {
        // Silent background retry.
      }
    }

    const interval = window.setInterval(refresh, LIVE_REFRESH_MS);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [initialData.meeting.slug, isDirty, isSaving]);

  useEffect(() => {
    if (!session || !isDirty) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsSaving(true);

      try {
        await saveAvailabilityRequest({
          slug: initialData.meeting.slug,
          participantId: session.participantId,
          token: session.token,
          slots: selectedKeys.map((key) => parseCellKey(key))
        });

        const [nextAvailability, nextBestTimes] = await Promise.all([
          getAvailabilityRequest(initialData.meeting.slug),
          getBestTimesRequest(initialData.meeting.slug)
        ]);

        setAvailability(nextAvailability);
        setBestTimes(nextBestTimes.bestTimes);
        setIsDirty(false);
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "가능한 시간을 저장하지 못했습니다.");
      } finally {
        setIsSaving(false);
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [initialData.meeting.slug, isDirty, selectedKeys, session]);

  async function onJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsJoining(true);

    try {
      const response = await joinMeetingRequest({
        slug: initialData.meeting.slug,
        name
      });

      setSession(initialData.meeting.slug, {
        participantId: response.participant.id,
        token: response.participant.token,
        name: response.participant.name,
        color: response.participant.color
      });

      const nextAvailability = await getAvailabilityRequest(initialData.meeting.slug);
      setAvailability(nextAvailability);
      setSelectedKeys(nextAvailability.availabilityByParticipant[response.participant.id] ?? []);
    } catch (joinError) {
      setError(joinError instanceof Error ? joinError.message : "미팅에 참여하지 못했습니다.");
    } finally {
      setIsJoining(false);
    }
  }

  function updateAvailabilityCells(
    cells: Array<{ dayOfWeek: DayIndex; slotIndex: number }>,
    value: boolean
  ) {
    if (!session) {
      setError("가능한 시간을 선택하려면 먼저 미팅에 참여하세요.");
      return;
    }

    const current = new Set(selected);
    for (const cell of cells) {
      const key = getCellKey(cell.dayOfWeek, cell.slotIndex);
      if (value) {
        current.add(key);
      } else {
        current.delete(key);
      }
    }

    const nextAvailabilityByParticipant = {
      ...availability.availabilityByParticipant,
      [session.participantId]: Array.from(current)
    };

    setSelectedKeys(Array.from(current));
    setIsDirty(true);
    setAvailability((previous) => ({
      ...previous,
      availabilityByParticipant: nextAvailabilityByParticipant
    }));
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/" className="text-sm font-semibold text-muted-foreground">
              MeetSync
            </Link>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {availability.meeting.title}
            </h1>
            {availability.meeting.description ? (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {availability.meeting.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">시간대 {availability.meeting.timezone}</span>
              <span className="rounded-full bg-muted px-3 py-1">월 화 수 목 금 토 일</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <Copy className="h-4 w-4" />
              링크 복사
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.55fr_0.45fr]">
          <div className="space-y-6">
            {!session ? (
              <JoinCard
                meeting={availability.meeting}
                name={name}
                error={error}
                isJoining={isJoining}
                onNameChange={setName}
                onSubmit={onJoin}
              />
            ) : (
              <div className="rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">현재 참여자</p>
                    <p className="text-lg font-semibold" style={{ color: session.color }}>
                      {session.name}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {isSaving ? (
                      <>
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        변경 사항 저장 중
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        {isDirty ? "변경 사항 반영 대기 중" : "8초마다 자동 새로고침"}
                      </>
                    )}
                  </div>
                </div>
                {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
              </div>
            )}

            <AvailabilityGrid
              selected={selected}
              heatmap={availability.heatmap}
              maxCount={availability.maxCount}
              participantColor={session?.color}
              disabled={!session}
              onToggleRange={updateAvailabilityCells}
            />
          </div>

          <div className="space-y-6">
            <ParticipantsPanel
              participants={availability.participants}
              currentParticipantId={session?.participantId}
            />
            <BestTimesPanel bestTimes={bestTimes} />
          </div>
        </div>
      </div>
    </main>
  );
}

function JoinCard({
  meeting,
  name,
  error,
  isJoining,
  onNameChange,
  onSubmit
}: {
  meeting: MeetingSummary;
  name: string;
  error: string;
  isJoining: boolean;
  onNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <section className="rounded-[28px] border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">미팅 참여</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          아래 주간 시간표에서 가능한 시간을 선택하세요.
        </p>
      </div>
      <form className="flex flex-col gap-3 md:flex-row" onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="이름 입력"
          className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          minLength={2}
          maxLength={40}
          required
        />
        <button
          type="submit"
          disabled={isJoining}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
        >
          {isJoining ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          미팅 참여
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
    </section>
  );
}
