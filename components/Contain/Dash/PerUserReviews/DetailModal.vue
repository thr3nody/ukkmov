<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle
        >Detail of {{ props.perUserReview.name }} reviews.</DialogTitle
      >
      <DialogDescription>
        Reports of user specific reviews history.
      </DialogDescription>
    </DialogHeader>
    <div v-if="!reviews.length" class="text-center italic">
      No reviews found. Start doing some movie reviews to see a list here.
    </div>
    <div v-else class="grid gap-4 h-fit sm:grid-cols-1">
      <Card v-for="(review, index) in reviews" :key="index">
        <NuxtLink
          :to="`/movies/${review.movies.slug}`"
          class="inline-flex w-full h-fit p-2"
        >
          <img
            v-if="review.movies.posterPath"
            :src="`/posters/${review.movies.posterPath}`"
            alt="Movie Poster"
            class="h-24 mr-6 rounded-md"
          />
          <div
            v-else
            class="h-24 w-16 mr-6 rounded-md text-gray-600 flex items-center justify-center"
          >
            No Poster
          </div>

          <div>
            <CardTitle class="p-2">
              <h2 class="text-xl font-semibold">
                {{ review.movies.title }}
              </h2>
            </CardTitle>
            <CardContent class="p-2">
              <p class="text-sm text-yellow-500">
                Rating: {{ review.rating }} ★
              </p>
              <p class="text-sm">Comment: {{ review.comment || "-" }}</p>
            </CardContent>
          </div>
        </NuxtLink>
      </Card>
    </div>
  </DialogContent>
</template>

<script setup lang="ts">
const props = defineProps<{
  perUserReview: PerUserReviews;
}>();

const reviews = ref<Reviews[]>([]);

const message = ref<string>("");

onMounted(async () => {
  try {
    const url = `/api/reviews/history?userId=${props.perUserReview.id}`;
    const response = await $fetch<{
      success: boolean;
      result?: any[];
      message?: string;
    }>(url);

    if (response.success && response.result) {
      reviews.value = response.result;
    } else {
      message.value = response.message || "Failed to load reviews.";
    }
  } catch (err: any) {
    message.value = err.message || "Something went wrong.";
    console.error("Error fetching reviews:", err);
  }
});
</script>
