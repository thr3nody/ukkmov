<template>
  <div class="flex gap-2 items-center py-4">
    <Input class="max-w-sm" placeholder="Filter casts..."
      :modelValue="props.table.getColumn('name')?.getFilterValue() as string" @update:modelValue="(value: any) => table.getColumn('name')?.setFilterValue(value)
        " />

    <Button v-if="selectedRows.length > 0" variant="destructive" @click="bulkDelete">Delete Selected</Button>

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">New Cast</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashCastsCreateModal @created="onCreated" @error="handleError" />
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

const selectedRows = computed(() => props.table.getSelectedRowModel().rows);
async function bulkDelete() {
  if (!selectedRows.value.length) {
    return;
  }

  const idsToDelete = selectedRows.value.map((row) => row.original.id);

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      casts?: Casts[];
    }>("/api/casts/bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: idsToDelete }),
    });

    if (response.success) {
      emit("refreshCasts");
      props.table.resetRowSelection();
    } else {
      console.error("Bulk delete failed:", response.message);
    }
  } catch (error) {
    console.error("Bulk delete error:", error);
  }
}

function onCreated(newCasts: Casts) {
  console.log("Craeted casts: ", newCasts);
  emit("refreshCasts");
}

function handleError(errorMessage: string) {
  console.error("Create cast error:", errorMessage);
}
</script>
