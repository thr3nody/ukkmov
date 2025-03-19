<template>
  <div class="flex gap-2 items-center py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter countries origin..."
      :modelValue="props.table.getColumn('name')?.getFilterValue() as string"
      @update:modelValue="
        (value: any) => table.getColumn('name')?.setFilterValue(value)
      "
    />

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">New Country Origin</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashCountriesOriginCreateModal
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
  (e: "refreshCountriesOrigin"): void;
}>();

function onCreated(newCountryOrigin: CountriesOrigin) {
  console.log("New country origin created:", newCountryOrigin);
  emit("refreshCountriesOrigin");
}

function handleError(errorMessage: string) {
  console.error("Create country origin error:", errorMessage);
}
</script>
