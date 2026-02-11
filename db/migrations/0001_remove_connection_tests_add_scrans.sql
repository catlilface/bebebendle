DROP TABLE IF EXISTS `connection_tests`;

CREATE TABLE `scrans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`number_of_likes` integer NOT NULL DEFAULT 0,
	`number_of_dislikes` integer NOT NULL DEFAULT 0
);
