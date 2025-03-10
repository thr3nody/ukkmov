<template>
  <div class="flex gap-2 items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter casts..."
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
        <ContainDashCastsCreateModal
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
  (e: "refreshCasts"): void;
}>();

function onCreated(newCasts: Casts) {
  console.log("Craeted casts: ", newCasts);
  emit("refreshCasts");
}

function handleError(errorMessage: string) {
  console.error("Create genre error:", errorMessage);
}
</script>
