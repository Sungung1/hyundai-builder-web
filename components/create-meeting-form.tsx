"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { createMeetingRequest } from "@/api/client";

export function CreateMeetingForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const result = await createMeetingRequest({ title, description, timezone });
        router.push(`/meeting/${result.slug}`);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "미팅을 만들지 못했습니다."
        );
      }
    });
  }

  if (!mounted) {
    return null;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="fade-up rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-glow backdrop-blur xl:p-8"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" />
        몇 초 만에 미팅 공간 만들기
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="title">
            미팅 제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 주간 제품 회의"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            minLength={3}
            maxLength={80}
            required
          />
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-foreground"
            htmlFor="description"
          >
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="미팅 목적이나 공유할 내용을 입력하세요."
            className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            maxLength={240}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="timezone">
            시간대
          </label>
          <input
            id="timezone"
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        미팅 만들기
      </button>
    </form>
  );
}
