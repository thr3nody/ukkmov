<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <h1 class="text-3xl font-bold mb-4">Browse for some movies.</h1>
      <div class="inline-flex space-x-2">
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search..."
            class="pl-10 h-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Icon name="mdi:search" size="24" />
          </span>
        </div>

        <Combobox
          v-model="selectedGenres"
          v-model:open="openGenres"
          :ignore-filter="true"
        >
          <ComboboxAnchor as-child>
            <TagsInput v-model="selectedGenres" class="px-2 gap-2 w-80">
              <div class="flex gap-2 flex-wrap items-center">
                <TagsInputItem
                  v-for="item in selectedGenres"
                  :key="item"
                  :value="item"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput v-model="genreSearchTerm" as-child>
                <TagsInputInput
                  placeholder="Filter by genre..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup>
                <ComboboxItem
                  v-for="genre in filteredGenres"
                  :key="genre"
                  :value="genre"
                  @select.prevent="
                    (ev: any) => {
                      if (typeof ev.detail.value === 'string') {
                        genreSearchTerm = '';
                        selectedGenres.push(ev.detail.value);
                      }

                      if (filteredGenres.length === 0) {
                        openGenres = false;
                      }
                    }
                  "
                >
                  {{ genre }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxAnchor>
        </Combobox>

        <Combobox
          v-model="selectedCasts"
          v-model:open="openCasts"
          :ignore-filter="true"
        >
          <ComboboxAnchor as-child>
            <TagsInput v-model="selectedCasts" class="px-2 gap-2 w-80">
              <div class="flex gap-2 flex-wrap items-center">
                <TagsInputItem
                  v-for="item in selectedCasts"
                  :key="item"
                  :value="item"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
              </div>

              <ComboboxInput v-model="castSearchTerm" as-child>
                <TagsInputInput
                  placeholder="Filter by cast..."
                  class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                  @keydown.enter.prevent
                />
              </ComboboxInput>
            </TagsInput>

            <ComboboxList class="w-[--reka-popper-anchor-width]">
              <ComboboxEmpty />
              <ComboboxGroup>
                <ComboboxItem
                  v-for="cast in filteredCasts"
                  :key="cast"
                  :value="cast"
                  @select.prevent="
                    (ev: any) => {
                      if (typeof ev.detail.value === 'string') {
                        castSearchTerm = '';
                        selectedCasts.push(ev.detail.value);
                      }

                      if (filteredCasts.length === 0) {
                        openCasts = false;
                      }
                    }
                  "
                >
                  {{ cast }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxAnchor>
        </Combobox>
      </div>
      <div v-if="isLoading" class="text-center mb-2">Loading movies...</div>
      <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    </div>

    <!-- Movie grid -->
    <div
      v-if="movies && movies.length"
      class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <NuxtLink
        v-for="movie in movies"
        :key="movie.slug"
        :to="`/movies/${movie.slug}`"
      >
        <Card class="border p-2 rounded-xl hover:shadow-lg transition-shadow">
          <CardHeader>
            <img
              v-if="movie.posterPath"
              :src="`/posters/${movie.posterPath}`"
              :alt="`Poster for ${movie.title}`"
              class="w-full h-fit object-cover mb-4"
            />
            <div
              v-else
              class="w-full h-64 flex items-center justify-center bg-gray-200 mb-4"
            >
              <span class="text-gray-600">No Poster Available</span>
            </div>
            <CardTitle>{{ movie.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="inline-flex w-full gap-4">
              <p>{{ useFormatDate(movie.releaseDate) }}</p>
              <p>Rating: {{ useFormatFloat(movie.averageRating) }}</p>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>

    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else-if="movies && !movies.length && !isLoading" class="text-center">
      No movies found.
    </div>
  </div>
</template>

<script setup lang="ts">
const movies = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");
const searchQuery = ref("");

const selectedGenres = ref<string[]>([]);
const openGenres = ref(false);
const genreSearchTerm = ref("");
const allGenres = ref<string[]>([]);

const selectedCasts = ref<string[]>([]);
const openCasts = ref(false);
const castSearchTerm = ref("");
const allCasts = ref<string[]>([]);

const filteredGenres = computed(() => {
  const lowerSearch = genreSearchTerm.value.toLowerCase();
  return allGenres.value
    .filter((g) => !selectedGenres.value.includes(g))
    .filter((g) =>
      !lowerSearch ? true : g.toLowerCase().includes(lowerSearch),
    );
});

const filteredCasts = computed(() => {
  const lowerSearch = castSearchTerm.value.toLowerCase();
  return allCasts.value
    .filter((c) => !selectedCasts.value.includes(c))
    .filter((c) =>
      !lowerSearch ? true : c.toLowerCase().includes(lowerSearch),
    );
});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchMovies = async () => {
  try {
    isLoading.value = true;

    const params = new URLSearchParams();
    if (searchQuery.value.trim()) {
      params.append("q", searchQuery.value.trim());
    }
    if (selectedGenres.value.length) {
      params.append("genres", selectedGenres.value.join(","));
    }
    if (selectedCasts.value.length) {
      params.append("casts", selectedCasts.value.join(","));
    }

    const url = `/api/movies/search?${params.toString()}`;
    const response = await $fetch<{
      success: boolean;
      result: any[];
      message?: string;
    }>(url);

    if (response.success) {
      movies.value = response.result;
      error.value = "";
    } else {
      if (response.message?.includes("Something went wrong")) {
        error.value = response.message;
      } else {
        error.value = "";
      }
      movies.value = [];
    }
  } catch (err: any) {
    error.value = err.message || "Something went wrong while fetching movies.";
    console.error("Error fetching movies:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const genresResponse = await $fetch<{
      success: boolean;
      genres: { id: number; name: string }[];
    }>("/api/genres");
    if (genresResponse.success) {
      allGenres.value = genresResponse.genres.map((g) => g.name);
    }

    const castsResponse = await $fetch<{
      success: boolean;
      casts: { id: number; name: string }[];
    }>("/api/casts");
    if (castsResponse.success) {
      allCasts.value = castsResponse.casts.map((c) => c.name);
    }

    fetchMovies();
  } catch (error: any) {
    console.error("Error fetching genres/casts:", error);
  } finally {
    isLoading.value = false;
  }
});

watch(
  selectedGenres,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchMovies();
    }, 200);
  },
  { deep: true },
);

watch(
  selectedCasts,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchMovies();
    }, 200);
  },
  { deep: true },
);

watch(searchQuery, () => {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    isLoading.value = true;
    fetchMovies();
  }, 200);
});
</script>
