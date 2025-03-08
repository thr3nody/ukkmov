<template>
  <div class="flex gap-2 items-center py-4">
    <Input class="max-w-sm" placeholder="Filter casts..."
      :modelValue="props.table.getColumn('name')?.getFilterValue() as string" @update:modelValue="(value: any) => table.getColumn('name')?.setFilterValue(value)
        " />
  </div>
</template>

<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";

const props = defineProps<{
  table: Table<any>;
}>();
</script>
