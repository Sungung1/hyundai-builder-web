import { z } from "zod";
import { DAYS, SLOTS_PER_DAY } from "@/lib/constants";

export const createMeetingSchema = z.object({
  title: z.string().trim().min(3, "미팅 제목은 3자 이상이어야 합니다.").max(80, "미팅 제목은 80자 이하로 입력하세요."),
  description: z
    .string()
    .trim()
    .max(240, "설명은 240자 이하로 입력하세요.")
    .optional()
    .transform((value) => value || ""),
  timezone: z
    .string()
    .trim()
    .min(2, "시간대를 입력하세요.")
    .max(80, "시간대는 80자 이하로 입력하세요.")
    .default("UTC")
});

export const joinMeetingSchema = z.object({
  slug: z.string().trim().min(4, "올바른 미팅 링크가 필요합니다.").max(32),
  name: z.string().trim().min(2, "이름은 2자 이상이어야 합니다.").max(40, "이름은 40자 이하로 입력하세요.")
});

export const saveAvailabilitySchema = z.object({
  slug: z.string().trim().min(4, "올바른 미팅 링크가 필요합니다.").max(32),
  participantId: z.string().trim().min(8, "참여자 정보가 올바르지 않습니다."),
  token: z.string().trim().min(8, "인증 정보가 올바르지 않습니다."),
  slots: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(DAYS.length - 1),
        slotIndex: z.number().int().min(0).max(SLOTS_PER_DAY - 1)
      })
    )
    .max(DAYS.length * SLOTS_PER_DAY, "가능한 시간 데이터가 너무 많습니다.")
});
