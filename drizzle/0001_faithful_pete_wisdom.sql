CREATE TABLE IF NOT EXISTS "messages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"content" text NOT NULL,
	"role" varchar NOT NULL
);
