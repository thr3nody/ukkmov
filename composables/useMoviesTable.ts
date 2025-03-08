import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
  type ExpandedState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";

import { valueUpdater } from "@/utils/valueUpdater";

import Button from "~/components/ui/button/Button.vue";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import { Icon } from "#components";

export function useMoviesTable(movies: Ref<Movies[]>) {
  const ColumnHelper = createColumnHelper<Movies>();

  const columns = [
    ColumnHelper.display({
      id: "select",
      header: ({ table }) =>
        h(Checkbox, {
          modelValue:
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate"),
          "onUpdate:modelValue": (value: boolean | "intermediate") =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: "Select all",
        }),
      cell: ({ row }) => {
        return h(Checkbox, {
          modelValue: row.getIsSelected(),
          "onUpdate:modelValue": (value: boolean | "intermediate") =>
            row.toggleSelected(!!value),
          ariaLabel: "Select row",
        });
      },
      enableSorting: false,
      enableHiding: false,
    }),
    ColumnHelper.accessor("title", {
      header: ({ column }) =>
        h(
          Button,
          {
            variant: "ghost",
            onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          },
          () => [
            "Title",
            h(Icon, { name: "mdi:chevron-up-down", class: "ml-2 h-4 w-4" }),
          ],
        ),
      cell: ({ row }) =>
        h("div", { class: "font-medium" }, row.getValue("title")),
    }),
    ColumnHelper.accessor("synopsis", {
      header: () => h("div", { class: "text-center" }, "Synopsis"),
      cell: ({ row }) => {
        return h("div", { class: "text-justify" }, row.getValue("synopsis"));
      },
    }),
    ColumnHelper.accessor("duration", {
      header: () => h("div", { class: "text-center" }, "Duration"),
      cell: ({ row }) => {
        const movieDuration = row.getValue("duration");
        const display = movieDuration ? `${movieDuration} Minutes` : "N/A";
        return h("div", { class: "text-center" }, String(display));
      },
    }),
    ColumnHelper.accessor("releaseDate", {
      header: () => h("div", { class: "text-center" }, "Release Date"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("releaseDate"));
        return h("div", { class: "text-center" }, date.toLocaleDateString());
      },
    }),
    ColumnHelper.accessor("averageRating", {
      header: () => h("div", { class: "text-center" }, "Average Rating"),
      cell: ({ row }) => {
        const rating = parseFloat(row.getValue("averageRating"));
        const formatted = isNaN(rating) ? "N/A" : rating.toFixed(1);
        return h("div", { class: "text-center" }, formatted);
      },
    }),
  ];

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});
  const expanded = ref<ExpandedState>({});

  const table = useVueTable({
    get data() {
      return movies.value;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, expanded),
    state: {
      get sorting() {
        return sorting.value;
      },
      get columnFilters() {
        return columnFilters.value;
      },
      get columnVisibility() {
        return columnVisibility.value;
      },
      get rowSelection() {
        return rowSelection.value;
      },
      get expanded() {
        return expanded.value;
      },
      columnPinning: {
        left: ["select"],
      },
    },
  });

  return { table, columns };
}
