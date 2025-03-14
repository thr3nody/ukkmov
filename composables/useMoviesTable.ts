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

interface MoviesHandlers {
  onUpdate: (movie: Movies) => void;
  onDelete: (movie: Movies) => void;
}

export function useMoviesTable(
  movies: Ref<Movies[]>,
  handlers: MoviesHandlers,
) {
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
        const date = useFormatDate(row.getValue("releaseDate"));
        return h("div", { class: "text-center" }, date);
      },
    }),
    ColumnHelper.accessor("ageRating", {
      header: () => h("div", { class: "text-center" }, "Age Rating"),
      cell: ({ row }) => {
        const ageRating = row.getValue("ageRating") as
          | { id: number; content: string }
          | undefined;
        return h(
          "div",
          { class: "text-center" },
          ageRating ? ageRating.content : "N/A",
        );
      },
    }),
    ColumnHelper.accessor("averageRating", {
      header: () => h("div", { class: "text-center" }, "Average Rating"),
      cell: ({ row }) => {
        const rating = useFormatFloat(row.getValue("averageRating"));
        return h("div", { class: "text-center" }, rating ? rating : "N/A");
      },
    }),
    ColumnHelper.accessor("genres", {
      header: () => h("div", { class: "text-center" }, "Genres"),
      cell: ({ row }) => {
        const genres = row.getValue("genres") as Array<{
          id: number;
          name: string;
        }>;
        const formattedGenres =
          genres && genres.length
            ? genres.map((g) => g.name).join(", ")
            : "N/A";
        return h("div", { class: "text-center" }, formattedGenres);
      },
    }),
    ColumnHelper.accessor("casts", {
      header: () => h("div", { class: "text-center" }, "Casts"),
      cell: ({ row }) => {
        const casts = row.getValue("casts") as Array<{
          id: number;
          name: string;
        }>;
        const formattedCasts =
          casts && casts.length ? casts.map((c) => c.name).join(", ") : "N/A";
        return h("div", { class: "text-center" }, formattedCasts);
      },
    }),
    ColumnHelper.accessor("posterPath", {
      header: () => h("div", { class: "text-center" }, "Poster"),
      cell: ({ row }) => {
        const posterPath = row.getValue("posterPath") as string | undefined;
        if (!posterPath) {
          return h(
            "div",
            { class: "text-center italic text-muted-foreground" },
            "No Poster",
          );
        }
        return h("img", {
          src: `/posters/${posterPath}`,
          alt: `Poster for ${row.original.title}`,
          class: "mx-auto h-16 object-cover rounded",
        });
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
              variant: "outline",
              size: "sm",
              onClick: () => {
                handlers.onUpdate(row.original);
              },
            },
            "Edit",
          ),
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
