<template>
  <div class="w-full">
    <ContainDashCountriesOriginActions
      :table="table"
      @refreshCountriesOrigin="refreshCountriesOrigin"
    />

    <div class="rounded-md border">
      <Table>
        <TableCaption>Countries Origin (Only) Data</TableCaption>
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

    <Dialog v-model:open="showUpdateModal">
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashCountriesOriginUpdateModal
          v-if="showUpdateModal && selectedCountryOrigin"
          :countryOrigin="selectedCountryOrigin"
          @updated="onUpdated"
          @close="showUpdateModal = false"
        />
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="sm:max-w-[425px]">
        <ContainDashCountriesOriginDeleteModal
          v-if="showDeleteModal && selectedCountryOrigin"
          :countryOrigin="selectedCountryOrigin"
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
import { useCountriesOriginTable } from "~/composables/useCountriesOriginTable";

const countriesOrigin = ref<CountriesOrigin[]>([]);

async function loadCountriesOrigin() {
  const response = await $fetch<{
    success: boolean;
    countriesOrigin: CountriesOrigin[];
  }>("/api/countries-origin");
  countriesOrigin.value = response.countriesOrigin;
  console.log(countriesOrigin.value);
}

const showUpdateModal = ref(false);
const selectedCountryOrigin = ref<CountriesOrigin | null>(null);

const showDeleteModal = ref(false);

function onUpdate(countryOrigin: CountriesOrigin) {
  selectedCountryOrigin.value = countryOrigin;
  showUpdateModal.value = true;
}

function onUpdated() {
  refreshCountriesOrigin();
  setTimeout(() => {
    showUpdateModal.value = false;
  }, 2000);
}

function onDelete(countryOrigin: CountriesOrigin) {
  selectedCountryOrigin.value = countryOrigin;
  showDeleteModal.value = true;
}

function onDeleted() {
  showDeleteModal.value = false;
  refreshCountriesOrigin();
}

onMounted(() => {
  loadCountriesOrigin();
});

const { table, columns } = useCountriesOriginTable(countriesOrigin, {
  onUpdate,
  onDelete,
});

function refreshCountriesOrigin() {
  loadCountriesOrigin();
}
</script>
