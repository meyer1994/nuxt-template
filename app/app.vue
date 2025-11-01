<script setup lang="ts">
import { Background } from '@vue-flow/background'
import type { Edge, Node } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { ref } from 'vue'

const nodes = ref<Node[]>([
  {
    id: crypto.randomUUID(),
    type: 'form-name',
    position: { x: 250, y: 100 },
    data: { name: 'John Doe' },
  },
])

const edges = ref<Edge[]>([])
</script>

<template>
  <UApp>
    <div class="flex flex-col gap-4 p-4 min-h-screen min-w-full h-screen w-screen box-border">
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
  </UApp>
</template>

<style>
/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';
/* this contains the default theme, these are optional styles */
@import '@vue-flow/core/dist/theme-default.css';
</style>
