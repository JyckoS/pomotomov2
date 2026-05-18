import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { conversation } from "./conversation";
import { user } from "./users";

export const friendship = pgTable(
  "friendship",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    statusBeforeBlock: text("status_before_block"),
    blockedByUserId: text("blocked_by_user_id").references(() => user.id, { onDelete: "set null" }),
    conversationId: uuid("conversation_id").references(() => conversation.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("friendship_requester_receiver_unique").on(table.requesterId, table.receiverId),
    index("friendship_requester_id_idx").on(table.requesterId),
    index("friendship_receiver_id_idx").on(table.receiverId),
    index("friendship_status_idx").on(table.status),
    index("friendship_blocked_by_user_id_idx").on(table.blockedByUserId),
    index("friendship_conversation_id_idx").on(table.conversationId),
  ],
);
