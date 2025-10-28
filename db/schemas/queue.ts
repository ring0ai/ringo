import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const queuesTable = pgTable("queues", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  task_type: text("task_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
