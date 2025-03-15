<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4">
      <h1 class="text-3xl font-bold mb-4">Browse for some movies.</h1>
      <div class="relative w-full max-w-sm items-center">
        <Input
          id="search"
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="pl-10"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Icon name="mdi:search" size="24" />
        </span>
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

    <div v-if="movies && !movies.length && !isLoading" class="text-center">
      No movies found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const movies = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");
const searchQuery = ref("");

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchMovies = async (q: string = "") => {
  try {
    const url = `/api/movies/search?q=${encodeURIComponent(q)}`;
    const response = await $fetch<{
      success: boolean;
      result: any[];
      message?: string;
    }>(url);

    if (response.success) {
      movies.value = response.result;
    } else {
      error.value = response.message || "Failed to load movies.";
    }
  } catch (err: any) {
    error.value = err.message || "Something went wrong while fetching movies.";
    console.error("Error fetching movies:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMovies();
});

watch(searchQuery, (newValue) => {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    isLoading.value = true;
    // If there's no search term, fetch all; otherwise, fetch filtered
    fetchMovies(newValue.trim());
  }, 200);
});
</script>
