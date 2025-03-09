<template>
  <div class="flex gap-2 items-center py-4">
    <Input class="max-w-sm" placeholder="Filter users..."
      :modelValue="props.table.getColumn('name')?.getFilterValue() as string" @update:modelValue="(value: any) => table.getColumn('name')?.setFilterValue(value)
        " />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="ml-auto">
          Columns
          <icon name="mdi:chevron-up-down" class="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem v-for="column in table
          .getAllColumns()
          .filter((column) => column.getCanHide())" :key="column.id" class="capitalize"
          :checked="column.getIsVisible()" @update:checked="(checked) => {
              column.toggleVisibility(checked);
            }
            ">
          {{ column.id }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";

const props = defineProps<{
  table: Table<any>;
}>();
</script>
