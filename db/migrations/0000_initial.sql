CREATE TABLE `meetings` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `timezone` text DEFAULT 'UTC' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE UNIQUE INDEX `meetings_slug_unique` ON `meetings` (`slug`);

CREATE TABLE `participants` (
  `id` text PRIMARY KEY NOT NULL,
  `meeting_id` text NOT NULL,
  `name` text NOT NULL,
  `color` text NOT NULL,
  `token` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE cascade
);

CREATE INDEX `participants_meeting_idx` ON `participants` (`meeting_id`);
CREATE INDEX `participants_token_idx` ON `participants` (`token`);

CREATE TABLE `availability` (
  `id` text PRIMARY KEY NOT NULL,
  `meeting_id` text NOT NULL,
  `participant_id` text NOT NULL,
  `day_of_week` integer NOT NULL,
  `slot_index` integer NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE cascade,
  FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX `availability_unique_slot`
  ON `availability` (`participant_id`, `day_of_week`, `slot_index`);
CREATE INDEX `availability_meeting_idx` ON `availability` (`meeting_id`);

