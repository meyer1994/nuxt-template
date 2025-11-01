<script setup lang="ts">
const { $trpc } = useNuxtApp()
const { data, refresh } = $trpc.users.list.useQuery()
</script>

<template>
  <UApp>
    <div class="flex flex-col gap-4 p-4">
      <FormUser
        @submit="e => {
          $trpc.users.create.mutate(e)
          refresh()
        }"
      />
      <TableUsers
        :items="data || []"
        @refresh-table="async () => {
          await refresh()
        }"
        @update-user="async (e) => {
          await $trpc.users.update.mutate(e)
          await refresh()
        }"
        @delete-user="async (e) => {
          await $trpc.users.delete.mutate(e)
          await refresh()
        }"
        @select-user="async (e) => {
          await $trpc.users.update.mutate(e)
          await refresh()
        }"
      />
    </div>
  </UApp>
</template>
