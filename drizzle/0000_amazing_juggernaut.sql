CREATE TABLE `offcuts` (
	`owner` text NOT NULL,
	`id` text NOT NULL,
	`data` text NOT NULL,
	`status` text NOT NULL,
	PRIMARY KEY(`owner`, `id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`owner` text NOT NULL,
	`id` text NOT NULL,
	`stock_id` text NOT NULL,
	`stock` text NOT NULL,
	`order_data` text NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`revision` text NOT NULL,
	`used_ids` text DEFAULT '[]' NOT NULL,
	`weight_kg` real,
	`avoided_new` text DEFAULT 'unknown' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`owner`, `id`)
);
