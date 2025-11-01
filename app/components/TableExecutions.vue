<script setup lang="ts">
import type { AppRouter } from '@@/server/trpc'
import type { TableColumn } from '@nuxt/ui'
import type { inferRouterOutputs } from '@trpc/server'

import { ExecutionStatus } from '~~/server/db/schema'

type RouterOutputs = inferRouterOutputs<AppRouter>
type ExecutionData = RouterOutputs['execution']['list'][number]

type Props = {
  items: ExecutionData[]
  filter?: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-execution': [execution: ExecutionData]
  'cancel-execution': [execution: ExecutionData]
  'select-execution': [execution: ExecutionData]
  'refresh-table': []
}>()

type Keys = keyof ExecutionData | 'actions'

// Table columns
const columns: TableColumn<ExecutionData>[] = [
  {
    id: 'id' as const,
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'nodeId' as const,
    accessorKey: 'nodeId',
    header: 'Node ID',
  },
  {
    id: 'status' as const,
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'input' as const,
    accessorKey: 'input',
    header: 'Input',
  },
  {
    id: 'output' as const,
    accessorKey: 'output',
    header: 'Output',
  },
  {
    id: 'createdAt' as const,
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'startedAt' as const,
    accessorKey: 'startedAt',
    header: 'Started At',
  },
  {
    id: 'finishedAt' as const,
    accessorKey: 'finishedAt',
    header: 'Finished At',
  },
  {
    id: 'actions' as const,
    header: 'Ações',
  },
]

const MAP_ID_TO_LABEL: Record<string, string> = columns
  .reduce((a, c) => ({ ...a, [c.id as string]: c.header }), {})

// State for column visibility
const visible: Ref<Record<Keys, boolean>> = ref({
  id: true,
  nodeId: true,
  status: true,
  input: false,
  output: false,
  createdAt: true,
  updatedAt: false,
  startedAt: false,
  finishedAt: false,
  actions: true,
})

const table = useTemplateRef('table')
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <!-- Filter and column controls -->
    <div class="flex items-center gap-2 px-4 py-3.5 border-b border-accented">
      <slot name="top" />

      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="sm"
        title="Atualizar"
        class="ml-auto"
        @click="emit('refresh-table')"
      />

      <UDropdownMenu
        :items="
          table
            ?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: (MAP_ID_TO_LABEL[column.id as Keys] ?? column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked: (checked: boolean) =>
                table
                  ?.tableApi
                  ?.getColumn(column.id)
                  ?.toggleVisibility(!!checked),
              // prevents the select menu from closing
              onSelect: (e: Event) => e.preventDefault(),
            }))
        "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Colunas"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          aria-label="Selecionar colunas"
        />
      </UDropdownMenu>
    </div>

    <!-- Table -->
    <UTable
      ref="table"
      v-model:column-visibility="visible"
      :loading="props.loading"
      loading-animation="carousel"
      :filter="props.filter"
      :global-filter="filter"
      :columns="columns"
      :data="props.items"
      :sticky="true"
      :empty-state="{
        icon: 'i-lucide-play',
        label: 'Nenhuma execução encontrada',
      }"
      :ui="{
        tr: 'hover:bg-muted cursor-pointer',
      }"
      class="flex-1"
      @select="e => emit('select-execution', e.original)"
    >
      <!-- ID Column -->
      <template #id-cell="{ row }">
        <span class="font-bold font-mono text-sm">
          #{{ row.original.id.substring(0, 8) }}
        </span>
      </template>

      <!-- Node ID Column -->
      <template #nodeId-cell="{ row }">
        <span class="font-mono text-sm">
          #{{ row.original.nodeId.substring(0, 8) }}
        </span>
      </template>

      <!-- Status Column -->
      <template #status-cell="{ row }">
        <UBadge
          v-if="row.original.status === ExecutionStatus.FINISHED"
          color="success"
          variant="subtle"
          :label="row.original.status"
        />
        <UBadge
          v-else-if="row.original.status === ExecutionStatus.FAILED"
          color="error"
          variant="subtle"
          :label="row.original.status"
        />
        <UBadge
          v-else-if="row.original.status === ExecutionStatus.CANCELLED"
          color="neutral"
          variant="subtle"
          :label="row.original.status"
        />
        <UBadge
          v-else
          color="warning"
          variant="subtle"
          :label="row.original.status"
        />
      </template>

      <!-- Input Column -->
      <template #input-cell="{ row }">
        <span
          class="text-sm"
          :title="JSON.stringify(row.original.input)"
        >
          {{ JSON.stringify(row.original.input).length >= 30
            ? JSON.stringify(row.original.input).substring(0, 27) + '...'
            : JSON.stringify(row.original.input) }}
        </span>
      </template>

      <!-- Output Column -->
      <template #output-cell="{ row }">
        <span
          v-if="row.original.output"
          class="text-sm"
          :title="JSON.stringify(row.original.output)"
        >
          {{ JSON.stringify(row.original.output).length >= 30
            ? JSON.stringify(row.original.output).substring(0, 27) + '...'
            : JSON.stringify(row.original.output) }}
        </span>
        <span
          v-else
          class="text-sm text-muted"
        >
          N/A
        </span>
      </template>

      <!-- Created At Column -->
      <template #createdAt-cell="{ row }">
        <NuxtTime
          :datetime="row.original.createdAt"
          title
        />
      </template>

      <!-- Started At Column -->
      <template #startedAt-cell="{ row }">
        <NuxtTime
          v-if="row.original.startedAt"
          :datetime="row.original.startedAt"
          title
        />
        <span v-else>N/A</span>
      </template>

      <!-- Finished At Column -->
      <template #finishedAt-cell="{ row }">
        <NuxtTime
          v-if="row.original.finishedAt"
          :datetime="row.original.finishedAt"
          title
        />
        <span v-else>N/A</span>
      </template>

      <!-- Actions Column -->
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-stop"
            color="warning"
            variant="ghost"
            size="sm"
            @click="emit('cancel-execution', row.original)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
