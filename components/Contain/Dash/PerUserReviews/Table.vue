<template>
  <div class="w-full">
    <div class="rounded-md border">
      <Table>
        <TableCaption>Per User Reviews Report</TableCaption>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              v-bind="$attrs"
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

    <Dialog v-model:open="showViewModal">
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashPerUserReviewsDetailModal
          v-if="showViewModal && selectedUser"
          :perUserReview="selectedUser"
          @close="showViewModal = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FlexRender } from "@tanstack/vue-table";
import { cn } from "@/lib/utils";
import { usePerUserReviewsTable } from "~/composables/usePerUserReviewsTable";

const perUserReviews = ref<PerUserReviews[]>([]);

const showViewModal = ref(false);
const selectedUser = ref<PerUserReviews | null>(null);

async function loadPerUserReviews() {
  const response = await $fetch<{
    success: boolean;
    perUserReviews: PerUserReviews[];
  }>("/api/per-user-reviews");
  perUserReviews.value = response.perUserReviews;
  console.log(perUserReviews.value);
}

function onView(perUserReview: PerUserReviews) {
  selectedUser.value = perUserReview;
  showViewModal.value = true;
}

onMounted(() => {
  loadPerUserReviews();
});

const { table, columns } = usePerUserReviewsTable(perUserReviews, { onView });
</script>
