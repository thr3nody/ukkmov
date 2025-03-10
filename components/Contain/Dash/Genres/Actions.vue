<template>
  <div class="flex gap-2 items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter genres..."
      :modelValue="props.table.getColumn('name')?.getFilterValue() as string"
      @update:modelValue="
        (value: any) => table.getColumn('name')?.setFilterValue(value)
      "
    />

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">New Genre</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashGenresCreateModal
          @created="onCreated"
          @error="handleError"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";

const props = defineProps<{
  table: Table<any>;
}>();

const emit = defineEmits<{
  (e: "refreshGenres"): void;
}>();

function onCreated(newGenre: Genres) {
  console.log("New genre created:", newGenre);
  emit("refreshGenres");
}

function handleError(errorMessage: string) {
  console.error("Create genre error:", errorMessage);
}
</script>
