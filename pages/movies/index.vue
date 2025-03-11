<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Movies</h1>
    <!-- Loading and error states -->
    <div v-if="isLoading" class="text-center">Loading movies...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <!-- Movie grid -->
    <div
      v-if="movies && movies.length"
      class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <NuxtLink
        v-for="movie in movies"
        :key="movie.slug"
        :to="`/movies/${movie.slug}`"
        class="border p-4 rounded hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold">{{ movie.title }}</h2>
        <p class="text-sm text-gray-600">
          Released: {{ formatDate(movie.releaseDate) }}
        </p>
        <p class="mt-2 line-clamp-3">{{ movie.synopsis }}</p>
        <p class="mt-2">
          Average Rating: {{ formatRating(movie.averageRating) }}
        </p>
      </NuxtLink>
    </div>

    <!-- No movies found message -->
    <div v-if="movies && !movies.length && !isLoading" class="text-center">
      No movies found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRating(ratingValue: number | string) {
  const averageRating = parseFloat(String(ratingValue));
  if (isNaN(averageRating)) {
    return "N/A";
  }
  return averageRating.toFixed(1);
}

const movies = ref<any[]>([]);
const isLoading = ref(true);
const error = ref("");

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
</script>
