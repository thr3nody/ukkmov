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
          <Input id="title" v-model="title" placeholder="Enter movie title..." class="col-span-3" />
        </div>

        <!-- Synopsis Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="synopsis" class="text-right">Synopsis</Label>
          <Input id="synopsis" v-model="synopsis" placeholder="Enter movie synopsis..." class="col-span-3" />
        </div>

        <!-- Duration Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="duration" class="text-right">Duration (Minutes)</Label>
          <NumberField id="duration" v-model.number="duration" placeholder="Enter duration..." class="col-span-3">
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
          <Input id="releaseDate" v-model="releaseDate" type="date" class="col-span-3" />
        </div>

        <!-- Age Rating Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Age Rating</Label>
          <div class="col-span-3">
            <Select v-model="selectedAgeRating">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select an age rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Age Ratings</SelectLabel>
                  <SelectItem v-for="ar in ageRatings" :key="ar.id" :value="ar.id">
                    {{ ar.content }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Genres Searchable Multi-Select -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Genres</Label>
          <div class="col-span-3">
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="w-full justify-between">
                  <span>{{ selectedGenresLabel }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0 w-72">
                <Command>
                  <!-- Search input for genres -->
                  <CommandInput placeholder="Search genres..." v-model="searchTermGenres" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem v-for="genre in filteredGenres" :key="genre.id" :value="genre.name ?? ''"
                        @select="toggleGenre(genre)">
                        <Checkbox class="mr-2" :checked="selectedGenreIds.includes(genre.id)" />
                        {{ genre.name }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <!-- Casts Searchable Multi-Select -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Casts</Label>
          <div class="col-span-3">
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" class="w-full justify-between">
                  <span>{{ selectedCastsLabel }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0 w-72">
                <Command>
                  <!-- Search input for casts -->
                  <CommandInput placeholder="Search casts..." v-model="searchTermCasts" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem v-for="cast in filteredCasts" :key="cast.id" :value="cast.name ?? ''"
                        @select="toggleCast(cast)">
                        <Checkbox class="mr-2" :checked="selectedCastIds.includes(cast.id)" />
                        {{ cast.name }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="trailer" class="text-right">Trailer Link</Label>
          <Input id="trailer" v-model="trailerLink" placeholder="Enter a YouTube trailer link..." class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="poster" class="text-right">Poster</Label>
          <Input id="poster" :key="fileInputKey" type="file" ref="posterFile" class="col-span-3"
            @change="handleFileChange" />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>

      <!-- Feedback message -->
      <div v-if="message" :class="['mt-2 text-sm', success ? 'text-green-500' : 'text-red-500']">
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

const ageRatings = ref<AgeRatings[]>([]);
const selectedAgeRating = ref<number | null>(null);

const genres = ref<Genres[]>([]);
const casts = ref<Casts[]>([]);

const searchTermGenres = ref("");
const searchTermCasts = ref("");

const selectedGenreIds = ref<number[]>([]);
const selectedCastIds = ref<number[]>([]);

const trailerLink = ref("");
const posterFile = ref<File | null>(null);
const fileInputKey = ref(0);

onMounted(async () => {
  try {
    const genreResponse = await $fetch<{
      success: boolean;
      genres: Genres[];
    }>("/api/genres");
    if (genreResponse.success) {
      genres.value = genreResponse.genres;
    }

    const castResponse = await $fetch<{
      success: boolean;
      casts: Casts[];
    }>("/api/casts");
    if (castResponse.success) {
      casts.value = castResponse.casts;
    }

    const ageRatingsRespone = await $fetch<{
      success: boolean;
      ageRatings: AgeRatings[];
    }>("/api/age-ratings");
    if (ageRatingsRespone.success) {
      ageRatings.value = ageRatingsRespone.ageRatings;
    }
  } catch (error) {
    console.error("Error fetching genres or casts:", error);
  }
});

const filteredGenres = computed(() => {
  if (!searchTermGenres.value) return genres.value;
  return genres.value.filter((g) =>
    g.name.toLowerCase().includes(searchTermGenres.value.toLowerCase()),
  );
});

const filteredCasts = computed(() => {
  if (!searchTermCasts.value) return casts.value;
  return casts.value.filter((c) =>
    c.name.toLowerCase().includes(searchTermCasts.value.toLowerCase()),
  );
});

const selectedGenresLabel = computed(() => {
  if (!selectedGenreIds.value.length) return "None";
  const selected = genres.value.filter((g) =>
    selectedGenreIds.value.includes(g.id),
  );
  return selected.map((g) => g.name).join(", ");
});

const selectedCastsLabel = computed(() => {
  if (!selectedCastIds.value.length) return "None";
  const selected = casts.value.filter((c) =>
    selectedCastIds.value.includes(c.id),
  );
  return selected.map((c) => c.name).join(", ");
});

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    posterFile.value = target.files[0];
  }
}

function toggleGenre(genre: Genres) {
  if (selectedGenreIds.value.includes(genre.id)) {
    selectedGenreIds.value = selectedGenreIds.value.filter(
      (id) => id !== genre.id,
    );
  } else {
    selectedGenreIds.value.push(genre.id);
  }
}

function toggleCast(cast: Casts) {
  if (selectedCastIds.value.includes(cast.id)) {
    selectedCastIds.value = selectedCastIds.value.filter(
      (id) => id !== cast.id,
    );
  } else {
    selectedCastIds.value.push(cast.id);
  }
}

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
    message.value =
      "All fields except genres, casts, and age rating are required.";
    success.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title.value.trim());
    formData.append("synopsis", synopsis.value.trim());
    formData.append("duration", String(duration.value));
    formData.append("releaseDate", releaseDate.value);
    if (selectedAgeRating.value)
      formData.append("ageRatingId", String(selectedAgeRating.value));
    formData.append("genres", JSON.stringify(selectedGenreIds.value));
    formData.append("casts", JSON.stringify(selectedCastIds.value));
    if (trailerLink.value) {
      formData.append("trailerLink", trailerLink.value);
    }
    if (posterFile.value) {
      formData.append("poster", posterFile.value);
    }

    const response = await $fetch<{
      success: boolean;
      movie?: Movies;
      message?: string;
    }>("/api/movies", {
      method: "POST",
      body: formData,
    });

    if (response.success) {
      if (response.movie) {
        emit("created", response.movie);
      }
      message.value = "Movie created successfully!";
      success.value = true;

      // Reset fields
      title.value = "";
      synopsis.value = "";
      duration.value = undefined;
      releaseDate.value = "";
      selectedGenreIds.value = [];
      selectedCastIds.value = [];
      searchTermGenres.value = "";
      searchTermCasts.value = "";
      trailerLink.value = "";
      posterFile.value = null;
      fileInputKey.value++;
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
