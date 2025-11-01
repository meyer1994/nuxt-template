<script setup lang="ts">
import type { AppRouterOutputs } from '@@/server/trpc'
import type { TableColumn } from '@nuxt/ui'

type Item = AppRouterOutputs['node']['list'][number]

type Props = {
  items: Item[]
  filter?: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-node': [node: Item]
  'delete-node': [node: Item]
  'select-node': [node: Item]
  'refresh-table': []
}>()

type Keys = keyof Item | 'actions'

// Table columns
const columns: TableColumn<Item>[] = [
  {
    id: 'id' as const,
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'parentId' as const,
    accessorKey: 'parentId',
    header: 'Parent ID',
  },
  {
    id: 'data' as const,
    accessorKey: 'data',
    header: 'Data',
  },
  {
    id: 'createdAt' as const,
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'updatedAt' as const,
    accessorKey: 'updatedAt',
    header: 'Updated At',
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
  parentId: true,
  data: true,
  createdAt: true,
  updatedAt: false,
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
        @click="e => emit('refresh-table')"
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
        icon: 'i-lucide-box',
        label: 'Nenhum node encontrado',
      }"
      :ui="{
        tr: 'hover:bg-muted cursor-pointer',
      }"
      class="flex-1"
      @select="e => emit('select-node', e.original)"
    >
      <!-- ID Column -->
      <template #id-cell="{ row }">
        <span class="font-bold font-mono text-sm">
          #{{ row.original.id.substring(0, 8) }}
        </span>
      </template>

      <!-- Parent ID Column -->
      <template #parentId-cell="{ row }">
        <span class="font-mono text-sm">
          {{ row.original.parentId || 'N/A' }}
        </span>
      </template>

      <!-- Data Column -->
      <template #data-cell="{ row }">
        <span
          class="text-sm"
          :title="JSON.stringify(row.original.data)"
        >
          {{ JSON.stringify(row.original.data).length >= 30
            ? JSON.stringify(row.original.data).substring(0, 27) + '...'
            : JSON.stringify(row.original.data) }}
        </span>
      </template>

      <!-- Created At Column -->
      <template #createdAt-cell="{ row }">
        <NuxtTime
          :datetime="row.original.createdAt"
          title
        />
      </template>

      <!-- Updated At Column -->
      <template #updatedAt-cell="{ row }">
        <NuxtTime
          :datetime="row.original.updatedAt"
          title
        />
      </template>

      <!-- Actions Column -->
      <template #actions-cell="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            title="Excluir node"
            @click="emit('delete-node', row.original)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
