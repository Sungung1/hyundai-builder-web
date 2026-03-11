import type { AvailabilityResponse, BestTime, JoinMeetingResponse } from "@/lib/types";

type JsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function requestJson<T>(url: string, options?: JsonOptions): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    },
    body: options?.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed." }));
    throw new Error(error.error ?? "Request failed.");
  }

  return response.json() as Promise<T>;
}

export function createMeetingRequest(payload: {
  title: string;
  description: string;
  timezone: string;
}) {
  return requestJson<{ slug: string }>("/api/createMeeting", {
    method: "POST",
    body: payload
  });
}

export function joinMeetingRequest(payload: { slug: string; name: string }) {
  return requestJson<JoinMeetingResponse>("/api/joinMeeting", {
    method: "POST",
    body: payload
  });
}

export function saveAvailabilityRequest(payload: {
  slug: string;
  participantId: string;
  token: string;
  slots: Array<{ dayOfWeek: number; slotIndex: number }>;
}) {
  return requestJson<{ ok: true }>("/api/saveAvailability", {
    method: "POST",
    body: payload
  });
}

export function getAvailabilityRequest(slug: string) {
  return requestJson<AvailabilityResponse>(`/api/availability?slug=${slug}`);
}

export function getBestTimesRequest(slug: string) {
  return requestJson<{ bestTimes: BestTime[] }>(`/api/bestTimes?slug=${slug}`);
}
