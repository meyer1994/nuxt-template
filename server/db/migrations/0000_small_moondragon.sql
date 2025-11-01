CREATE TABLE `executions` (
	`id` text PRIMARY KEY NOT NULL,
	`node_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`started_at` integer,
	`finished_at` integer,
	`status` text NOT NULL,
	`input` text NOT NULL,
	`output` text,
	FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`data` text NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
