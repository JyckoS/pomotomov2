CREATE TABLE IF NOT EXISTS "pomodoro_timer_type" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "name" text NOT NULL,
  "focus_duration_minutes" integer NOT NULL,
  "break_duration_minutes" integer NOT NULL,
  "is_preset" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pomodoro_timer_type_user_id_idx" ON "pomodoro_timer_type" USING btree ("user_id");
--> statement-breakpoint
ALTER TABLE "pomodoro_timer_type"
  ADD CONSTRAINT "pomodoro_timer_type_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pomodoro_settings" (
  "user_id" text PRIMARY KEY NOT NULL,
  "auto_start_break" boolean DEFAULT true NOT NULL,
  "auto_start_pomodoros" boolean DEFAULT false NOT NULL,
  "selected_timer_type_id" integer,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pomodoro_settings_selected_timer_type_id_idx"
  ON "pomodoro_settings" USING btree ("selected_timer_type_id");
--> statement-breakpoint
ALTER TABLE "pomodoro_settings"
  ADD CONSTRAINT "pomodoro_settings_user_id_user_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pomodoro_settings"
  ADD CONSTRAINT "pomodoro_settings_selected_timer_type_id_pomodoro_timer_type_id_fk"
  FOREIGN KEY ("selected_timer_type_id") REFERENCES "public"."pomodoro_timer_type"("id") ON DELETE set null ON UPDATE no action;
