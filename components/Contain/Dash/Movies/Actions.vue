<template>
  <div class="flex gap-2 items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter movies..."
      :modelValue="props.table.getColumn('title')?.getFilterValue() as string"
      @update:modelValue="
        (value: any) => table.getColumn('title')?.setFilterValue(value)
      "
    />

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">New Movies</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashMoviesCreateModal
          @created="onCreated"
          @error="handleError"
        />
      </DialogContent>
    </Dialog>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="ml-auto">
          Columns
          <icon name="mdi:chevron-up-down" class="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          v-for="column in table
            .getAllColumns()
            .filter((column) => column.getCanHide())"
          :key="column.id"
          class="capitalize"
          :checked="column.getIsVisible()"
          @update:checked="
            (checked) => {
              column.toggleVisibility(checked);
            }
          "
        >
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

const emit = defineEmits<{
  (e: "refreshMovies"): void;
}>();

function onCreated(newMovies: Movies) {
  console.log("New movie created:", newMovies);
  emit("refreshMovies");
}

function handleError(errorMessage: string) {
  console.error("Create movie error:", errorMessage);
}
</script>
