CREATE TABLE `exchanges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_by` text NOT NULL,
	`invite_code` text,
	`shared` integer DEFAULT 0 NOT NULL,
	`sample_seed` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exchanges_invite_code_unique` ON `exchanges` (`invite_code`);--> statement-breakpoint
CREATE TABLE `pilot_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`exchange_id` text NOT NULL,
	`author_id` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `feedback_exchange` ON `pilot_feedback` (`exchange_id`);--> statement-breakpoint
CREATE TABLE `exchange_members` (
	`exchange_id` text NOT NULL,
	`member_id` text NOT NULL,
	`joined_at` text NOT NULL,
	PRIMARY KEY(`exchange_id`, `member_id`)
);
--> statement-breakpoint
CREATE TABLE `coordination_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`exchange_id` text NOT NULL,
	`reservation_id` text NOT NULL,
	`author_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `messages_reservation` ON `coordination_messages` (`exchange_id`,`reservation_id`);--> statement-breakpoint
CREATE TABLE `exchange_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`exchange_id` text NOT NULL,
	`recipient` text NOT NULL,
	`record_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`read_at` text
);
--> statement-breakpoint
CREATE INDEX `notifications_recipient` ON `exchange_notifications` (`exchange_id`,`recipient`);--> statement-breakpoint
CREATE TABLE `workshop_profiles` (
	`owner` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`suburb` text DEFAULT '' NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`active_exchange` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `offcuts` ADD `seller_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `buyer_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `seller_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `buyer_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `seller_name` text DEFAULT '' NOT NULL;