import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./users";

export const userHeartbeat = pgTable(
  "user_heartbeat",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    lastHeartbeatAt: timestamp("last_heartbeat_at").defaultNow().notNull(),
    source: text("source"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_heartbeat_last_heartbeat_at_idx").on(table.lastHeartbeatAt)],
);
