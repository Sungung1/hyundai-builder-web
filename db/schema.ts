import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const meetings = sqliteTable(
  "meetings",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    timezone: text("timezone").notNull().default("UTC"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    slugIndex: uniqueIndex("meetings_slug_unique").on(table.slug)
  })
);

export const participants = sqliteTable(
  "participants",
  {
    id: text("id").primaryKey(),
    meetingId: text("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    token: text("token").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    meetingIndex: index("participants_meeting_idx").on(table.meetingId),
    tokenIndex: index("participants_token_idx").on(table.token)
  })
);

export const availability = sqliteTable(
  "availability",
  {
    id: text("id").primaryKey(),
    meetingId: text("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    slotIndex: integer("slot_index").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
  },
  (table) => ({
    uniqueSlot: uniqueIndex("availability_unique_slot").on(
      table.participantId,
      table.dayOfWeek,
      table.slotIndex
    ),
    meetingIndex: index("availability_meeting_idx").on(table.meetingId)
  })
);

