import { sql } from "drizzle-orm";
import {
  text,
  varchar,
  timestamp,
  pgTable,
  vector,
  index,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const resources = pgTable("resources", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export type NewResourceParams = z.infer<typeof insertResourceSchema>;

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    resourceId: varchar("resource_id", { length: 191 }).references(
      () => resources.id,
      { onDelete: "cascade" }
    ),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const messages = pgTable("messages", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  role: varchar("role").notNull(),
});
