"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type MeetingSession = {
  participantId: string;
  token: string;
  name: string;
  color: string;
};

type MeetingStore = {
  sessions: Record<string, MeetingSession>;
  setSession: (slug: string, session: MeetingSession) => void;
  clearSession: (slug: string) => void;
};

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set) => ({
      sessions: {},
      setSession: (slug, session) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [slug]: session
          }
        })),
      clearSession: (slug) =>
        set((state) => {
          const sessions = { ...state.sessions };
          delete sessions[slug];
          return { sessions };
        })
    }),
    {
      name: "meetsync-sessions"
    }
  )
);

