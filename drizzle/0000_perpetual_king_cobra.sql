ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "theme_mode" text DEFAULT 'auto' NOT NULL;
--> statement-breakpoint
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "language_mode" text DEFAULT 'auto' NOT NULL;
