import { relations, sql } from 'drizzle-orm'
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export enum NodeType {
  FUNCTION = 'FUNCTION',
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export const TNodes = sqliteTable('nodes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  parentId: text('parent_id')
    .references((): SQLiteColumn => TNodes.id, { onDelete: 'set null' }),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),

  data: text('data', { mode: 'json' })
    .notNull(),
})

export const TExecutions = sqliteTable('executions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nodeId: text('node_id')
    .notNull()
    .references(() => TNodes.id, { onDelete: 'no action' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }),
  finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),

  status: text('status')
    .notNull()
    .$type<ExecutionStatus | `${ExecutionStatus}`>(),
  input: text('input', { mode: 'json' })
    .notNull(),
  output: text('output', { mode: 'json' }),
})

export const RNodes = relations(TNodes, ({ one, many }) => ({
  parent: one(TNodes, {
    fields: [TNodes.parentId],
    references: [TNodes.id],
  }),
  executions: many(TExecutions),
}))

export const RExecutions = relations(TExecutions, ({ one }) => ({
  node: one(TNodes, {
    fields: [TExecutions.nodeId],
    references: [TNodes.id],
  }),
}))
