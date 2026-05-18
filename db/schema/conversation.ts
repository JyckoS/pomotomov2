import { index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./users";

export const conversation = pgTable(
  "conversation",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").notNull().default("direct"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("conversation_type_idx").on(table.type)],
);

export const conversationParticipant = pgTable(
  "conversation_participant",
  {
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    lastReadAt: timestamp("last_read_at"),
  },
  (table) => [
    primaryKey({
      name: "conversation_participant_pk",
      columns: [table.conversationId, table.userId],
    }),
    index("conversation_participant_user_id_idx").on(table.userId),
  ],
);

export const conversationMessage = pgTable(
  "conversation_message",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    editedAt: timestamp("edited_at"),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("conversation_message_conversation_created_idx").on(table.conversationId, table.createdAt),
    index("conversation_message_sender_id_idx").on(table.senderId),
  ],
);
