import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./users";

export const pomodoroTimerType = pgTable(
  "pomodoro_timer_type",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    focusDurationMinutes: integer("focus_duration_minutes").notNull(),
    breakDurationMinutes: integer("break_duration_minutes").notNull(),
    isPreset: boolean("is_preset").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("pomodoro_timer_type_user_id_idx").on(table.userId)],
);

export const pomodoroSettings = pgTable(
  "pomodoro_settings",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    autoStartBreak: boolean("auto_start_break").default(true).notNull(),
    autoStartPomodoros: boolean("auto_start_pomodoros").default(false).notNull(),
    selectedTimerTypeId: uuid("selected_timer_type_id").references(() => pomodoroTimerType.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("pomodoro_settings_selected_timer_type_id_idx").on(table.selectedTimerTypeId)],
);
