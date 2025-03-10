<template>
  <div class="w-full">
    <ContainDashCastsActions :table="table" @refreshCasts="refreshCasts" />

    <div class="rounded-md border">
      <Table>
        <TableCaption>Casts (Only) Data</TableCaption>
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
        <ContainDashCastsDeleteModal
          v-if="showDeleteModal && selectedCast"
          :cast="selectedCast"
          @deleted="onDeleted"
          @close="showDeleteModal = false"
        />
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showUpdateModal">
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashCastsUpdateModal
          v-if="showUpdateModal && selectedCast"
          :cast="selectedCast"
          @updated="onUpdated"
          @close="showUpdateModal = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FlexRender } from "@tanstack/vue-table";
import { cn } from "@/lib/utils";
import { useCastsTable } from "~/composables/useCastsTable";

const casts = ref<Casts[]>([]);

const selectedCast = ref<Casts | null>(null);
const showDeleteModal = ref(false);
const showUpdateModal = ref(false);

async function loadCasts() {
  const response = await $fetch<{ success: boolean; casts: Casts[] }>(
    "/api/casts",
  );
  casts.value = response.casts;
  console.log(casts.value);
}

function onUpdate(cast: Casts) {
  selectedCast.value = cast;
  showUpdateModal.value = true;
}

function onUpdated() {
  refreshCasts();
  setTimeout(() => {
    showUpdateModal.value = false;
  }, 2000);
}

function onDelete(cast: Casts) {
  selectedCast.value = cast;
  showDeleteModal.value = true;
}

function onDeleted() {
  showDeleteModal.value = false;
  refreshCasts();
}

onMounted(() => {
  loadCasts();
});

const { table, columns } = useCastsTable(casts, { onUpdate, onDelete });

function refreshCasts() {
  loadCasts();
}
</script>
