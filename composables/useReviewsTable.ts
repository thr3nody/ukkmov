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

interface ReviewHandlers {
  onDelete: (revew: Reviews) => void;
}

import { valueUpdater } from "@/utils/valueUpdater";

import Button from "~/components/ui/button/Button.vue";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import { Icon } from "#components";

export function useReviewsTable(
  reviews: Ref<Reviews[]>,
  handlers: ReviewHandlers,
) {
  const ColumnHelper = createColumnHelper<Reviews>();

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
    ColumnHelper.accessor((row) => row.movies.title, {
      id: "movieTitle",
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
      cell: ({ row }) => {
        return h("div", { class: "font-medium" }, row.original.movies.title);
      },
    }),
    ColumnHelper.accessor("rating", {
      header: () => h("div", { class: "text-center" }, "Rating"),
      cell: ({ row }) => {
        return h("div", { class: "text-center" }, row.getValue("rating"));
      },
    }),
    ColumnHelper.accessor("comment", {
      header: () => h("div", { class: "text-center" }, "Comment"),
      cell: ({ row }) => {
        return h("div", { class: "text-justify" }, row.getValue("comment"));
      },
    }),
    ColumnHelper.accessor((row) => row.users.name, {
      id: "userName",
      header: () => "Reviewed by",

      cell: ({ row }) => {
        return h("div", { class: "text-left" }, row.original.users.name);
      },
    }),
    ColumnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) =>
        h("div", { class: "flex space-x-2" }, [
          h(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: () => {
                handlers.onDelete(row.original);
              },
            },
            "Delete",
          ),
        ]),
      enableSorting: false,
      enableHiding: false,
    }),
  ];

  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});
  const expanded = ref<ExpandedState>({});

  const table = useVueTable({
    get data() {
      return reviews.value;
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
