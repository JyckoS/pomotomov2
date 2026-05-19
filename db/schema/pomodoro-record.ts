import { index, pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

import { user } from "./users";

// Track individual pomodoro sessions completed by users
export const pomodoroRecord = pgTable(
  "pomodoro_record",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    seconds: integer("seconds").notNull(), // Duration in seconds
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("pomodoro_record_user_id_idx").on(table.userId),
    index("pomodoro_record_created_at_idx").on(table.createdAt),
  ],
);
