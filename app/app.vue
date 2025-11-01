<script setup lang="ts">
import { Background } from '@vue-flow/background'
import type { Edge, Node } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { ref } from 'vue'

const { $trpc } = useNuxtApp()

// Fetch nodes and executions data
const { data: nodesData, refresh: refreshNodes } = await useAsyncData(
  'nodes',
  () => $trpc.node.list.query(),
)

const { data: executionsData, refresh: refreshExecutions } = await useAsyncData(
  'executions',
  () => $trpc.execution.list.query(),
)

const nodes = ref<Node[]>([
  {
    id: crypto.randomUUID(),
    type: 'form-name',
    position: { x: 250, y: 100 },
    data: { name: 'John Doe' },
  },
])

const edges = ref<Edge[]>([])

// Handle table events
const handleDeleteNode = async (node: NonNullable<typeof nodesData.value>[number]) => {
  await $trpc.node.delete.mutate({ id: node.id })
  await refreshNodes()
}

const handleCancelExecution = async (execution: NonNullable<typeof executionsData.value>[number]) => {
  await $trpc.execution.cancel.mutate({ id: execution.id })
  await refreshExecutions()
}
</script>

<template>
  <UApp>
    <div class="flex gap-4 p-4 min-h-screen min-w-full h-screen w-screen box-border">
      <!-- Left side: Tables -->
      <div class="flex flex-col gap-4 w-1/2 overflow-auto">
        <!-- Nodes Table -->
        <div>
          <h2 class="text-lg font-semibold mb-2">
            Nodes
          </h2>
          <TableNodes
            :items="nodesData || []"
            @delete-node="handleDeleteNode"
            @refresh-table="refreshNodes"
          />
        </div>

        <!-- Executions Table -->
        <div>
          <h2 class="text-lg font-semibold mb-2">
            Executions
          </h2>
          <TableExecutions
            :items="executionsData || []"
            @cancel-execution="handleCancelExecution"
            @refresh-table="refreshExecutions"
          />
        </div>
      </div>

      <!-- Right side: VueFlow -->
      <div class="flex-1 min-h-[400px]">
        <ClientOnly>
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            class="w-full h-full min-h-[400px]"
            :min-zoom="0.2"
            :max-zoom="4"
            :fit-view-on-init="true"
          >
            <Background
              variant="dots"
              :gap="20"
            />

            <template #node-form-name="props">
              <div>
                <FormName
                  class="p-2 bg-muted border rounded-md"
                  :default-value="props.data"
                  @submit="e => console.log(e)"
                />
              </div>
            </template>
          </VueFlow>
        </ClientOnly>
      </div>
    </div>
  </UApp>
</template>

<style>
/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';
/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';
</style>
