<template>
  <div class="w-full">
    <ContainDashAgeRatingsActions
      :table="table"
      @refreshAgeRatings="refreshAgeRatings"
    />

    <div class="rounded-md border">
      <Table>
        <TableCaption>Age Ratings (Only) Data</TableCaption>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              v-bind="$attrs"
              :data-pinned="header.column.getIsPinned()"
              :class="
                cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="
                    cn(
                      { 'sticky bg-background/95': cell.column.getIsPinned() },
                      cell.column.getIsPinned() === 'left'
                        ? 'left-0'
                        : 'right-0',
                    )
                  "
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  <pre>{{ JSON.stringify(row.original, null, 2) }}</pre>
                </TableCell>
              </TableRow>
            </template>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results/data.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>

    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashAgeRatingsDeleteModal
          v-if="showDeleteModal && selectedAgeRating"
          :ageRating="selectedAgeRating"
          @deleted="onDeleted"
          @close="showDeleteModal = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FlexRender } from "@tanstack/vue-table";
import { cn } from "@/lib/utils";
import { useAgeRatingsTable } from "~/composables/useAgeRatingsTable";

const ageRatings = ref<AgeRatings[]>([]);

const selectedAgeRating = ref<AgeRatings | null>(null);
const showDeleteModal = ref(false);

async function loadAgeRatings() {
  const response = await $fetch<{ success: boolean; ageRatings: AgeRatings[] }>(
    "/api/age-ratings",
  );
  ageRatings.value = response.ageRatings;
  console.log(ageRatings.value);
}

function onDelete(ageRating: AgeRatings) {
  selectedAgeRating.value = ageRating;
  showDeleteModal.value = true;
}

function onDeleted() {
  showDeleteModal.value = false;
  refreshAgeRatings();
}

onMounted(() => {
  loadAgeRatings();
});

const { table, columns } = useAgeRatingsTable(ageRatings, { onDelete });

function refreshAgeRatings() {
  loadAgeRatings();
}
</script>
