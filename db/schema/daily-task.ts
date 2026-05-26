import { date, index, integer, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./users";

export const dailyTaskItem = pgTable(
  "daily_task",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    title: text("title").notNull(),
    notes: text("notes"),
    color: text("color").notNull(),
    iconName: text("icon_name").notNull(),
    toCompleteBefore: time("to_complete_before"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("daily_task_item_user_id_idx").on(table.userId),
    index("daily_task_item_parent_id_sort_order_idx").on(table.parentId, table.sortOrder),
  ],
);

export const dailyTaskCompletion = pgTable(
  "daily_task_completion",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    dailyTaskId: uuid("daily_task_id")
      .notNull()
      .references(() => dailyTaskItem.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => [
    index("daily_task_completion_user_day_idx").on(table.userId, table.day),
    index("daily_task_completion_task_day_idx").on(table.dailyTaskId, table.day),
  ],
);