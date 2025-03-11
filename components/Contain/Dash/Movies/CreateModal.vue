<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a New Movie</DialogTitle>
      <DialogDescription>
        Fill out the details for the new movie.
      </DialogDescription>
    </DialogHeader>

    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <!-- Title Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="title" class="text-right">Title</Label>
          <Input
            id="title"
            v-model="title"
            placeholder="Enter movie title..."
            class="col-span-3"
          />
        </div>

        <!-- Synopsis Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="synopsis" class="text-right">Synopsis</Label>
          <Input
            id="synopsis"
            v-model="synopsis"
            placeholder="Enter movie synopsis..."
            class="col-span-3"
          />
        </div>

        <!-- Duration Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="duration" class="text-right">Duration (Minutes)</Label>
          <NumberField
            id="duration"
            v-model.number="duration"
            placeholder="Enter duration..."
            class="col-span-3"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <!-- Release Date Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="releaseDate" class="text-right">Release Date</Label>
          <Input
            id="releaseDate"
            v-model="releaseDate"
            type="date"
            class="col-span-3"
          />
        </div>

        <!-- Genres & Casts Multiple-Select Dropdowns -->
        <div class="flex flex-col space-y-4">
          <!-- Genres Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                Genres:
                <span v-if="selectedGenresLabel" class="ml-2 text-sm">
                  {{ selectedGenresLabel }}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuCheckboxItem
                v-for="genreItem in genres"
                :key="genreItem.id"
                v-model:checked="genreItem.checked"
              >
                {{ genreItem.name }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Casts Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline">
                Casts:
                <span v-if="selectedCastsLabel" class="ml-2 text-sm">
                  {{ selectedCastsLabel }}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuCheckboxItem
                v-for="castItem in casts"
                :key="castItem.id"
                v-model:checked="castItem.checked"
              >
                {{ castItem.name }}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>

      <!-- Feedback message -->
      <div
        v-if="message"
        :class="['mt-2 text-sm', success ? 'text-green-500' : 'text-red-500']"
      >
        {{ message }}
      </div>
    </form>
  </DialogContent>
</template>

<script setup lang="ts">
const title = ref("");
const synopsis = ref("");
const duration = ref<number | undefined>(undefined);
const releaseDate = ref("");

const message = ref("");
const success = ref(false);

interface Genre {
  id: number;
  name: string;
  checked: boolean;
}

interface Cast {
  id: number;
  name: string;
  checked: boolean;
}

const genres = ref<Genre[]>([]);
const casts = ref<Cast[]>([]);

onMounted(async () => {
  try {
    const genreResponse = await $fetch<{
      success: boolean;
      genres: { id: number; name: string }[];
    }>("/api/genres");
    if (genreResponse.success) {
      genres.value = genreResponse.genres.map((g) => ({
        ...g,
        checked: false, // Prop for each genre
      }));
    }

    const castResponse = await $fetch<{
      success: boolean;
      casts: { id: number; name: string }[];
    }>("/api/casts");
    if (castResponse.success) {
      casts.value = castResponse.casts.map((c) => ({
        ...c,
        checked: false, // Prop for each cast
      }));
    }
  } catch (error) {
    console.error("Error fetching genres or casts:", error);
  }
});

const selectedGenresLabel = computed(() => {
  const selected = genres.value.filter((g) => g.checked);
  return selected.length ? selected.map((g) => g.name).join(", ") : "None";
});

const selectedCastsLabel = computed(() => {
  const selected = casts.value.filter((c) => c.checked);
  return selected.length ? selected.map((c) => c.name).join(", ") : "None";
});

const emit = defineEmits<{
  (e: "created", newMovie: Movies): void;
  (e: "error", message: string): void;
}>();

async function onSubmit() {
  if (
    !title.value.trim() ||
    !synopsis.value.trim() ||
    !duration.value ||
    !releaseDate.value
  ) {
    message.value = "All fields except genres and casts are required.";
    success.value = false;
    return;
  }

  const selectedGenreIds = genres.value
    .filter((g) => g.checked)
    .map((g) => g.id);

  const selectedCastIds = casts.value.filter((c) => c.checked).map((c) => c.id);

  try {
    const response = await $fetch<{
      success: boolean;
      movie?: Movies;
      message?: string;
    }>("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value.trim(),
        synopsis: synopsis.value.trim(),
        duration: duration.value,
        releaseDate: releaseDate.value,
        genres: selectedGenreIds,
        casts: selectedCastIds,
      }),
    });

    if (response.success && response.movie) {
      message.value = "Movie created successfully!";
      success.value = true;
      emit("created", response.movie);

      // Reset form fields
      title.value = "";
      synopsis.value = "";
      duration.value = undefined;
      releaseDate.value = "";
      // Uncheck all genres and casts
      genres.value.forEach((g) => (g.checked = false));
      casts.value.forEach((c) => (c.checked = false));
    } else {
      message.value = response.message || "Failed to create movie.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error creating movie:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
