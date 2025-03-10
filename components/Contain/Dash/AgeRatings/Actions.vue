<template>
  <div class="flex gap-2 items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter age ratings..."
      :modelValue="props.table.getColumn('content')?.getFilterValue() as string"
      @update:modelValue="
        (value: any) => table.getColumn('content')?.setFilterValue(value)
      "
    />

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">New Age Rating</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashAgeRatingsCreateModal
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
  (e: "refreshAgeRatings"): void;
}>();

function onCreated(newAgeRatings: AgeRatings) {
  console.log("Craeted age ratings: ", newAgeRatings);
  emit("refreshAgeRatings");
}

function handleError(errorMessage: string) {
  console.error("Create age rating error:", errorMessage);
}
</script>
