import { boolean, foreignKey, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./users";

export const todoTask = pgTable(
	"todo_task",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		parentId: uuid("parent_id"),
		title: text("title").notNull(),
		notes: text("notes"),
		color: text("color").notNull().default("#0075de"),
		iconName: text("icon_name").notNull().default("FileText"),
		deadline: timestamp("deadline").notNull(),
		isFinished: boolean("is_finished").default(false).notNull(),
		sortOrder: integer("sort_order").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "todo_task_parent_id_fkey",
		}).onDelete("cascade"),
		index("todo_task_user_id_idx").on(table.userId),
		index("todo_task_parent_id_sort_order_idx").on(table.parentId, table.sortOrder),
		index("todo_task_deadline_idx").on(table.deadline),
		index("todo_task_is_finished_idx").on(table.isFinished),
	],
);
