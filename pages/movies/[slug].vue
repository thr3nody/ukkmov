<template>
  <div class="max-w-screen-lg mx-auto py-8 px-4 space-y-8">
    <div class="mb-4">
      <iframe v-if="movieDetail?.trailerLink" class="aspect-video w-full h-full rounded-md"
        :src="movieDetail?.trailerLink" frameborder="0" allowfullscreen></iframe>
      <div v-else class="flex items-center justify-center">
        <p>No Trailer Available</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <h2 class="text-xl w-full font-semibold mb-4">Reviews</h2>
        <div v-if="user" class="mb-4 p-4 border rounded-md">
          <h3 class="text-lg font-bold mb-2">Your Review</h3>
          <div class="mb-2">
            <div class="flex items-center space-x-1">
              <span v-for="star in 5" :key="star" class="cursor-pointer" @click="setRating(star)">
                <Icon :name="star <= userRating! ? 'mdi:star' : 'mdi:star-outline'" class="text-yellow-500 h-6 w-6" />
              </span>
            </div>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Comment</label>
            <Textarea rows="3" v-model="userComment" class="border rounded w-full p-1"></Textarea>
          </div>
          <Button variant="outline" class="mt-2" @click="submitReview">
            Submit
          </Button>
          <p v-if="reviewMessage" class="mt-2 text-sm" :class="reviewSuccess ? 'text-green-500' : 'text-red-500'">
            {{ reviewMessage }}
          </p>
        </div>
        <div v-else class="mb-4 p-4 border rounded-md flex items-center">
          <p>
            <NuxtLink to="/auth"><Button variant="default">Login</Button></NuxtLink>
            to review
          </p>
        </div>

        <div v-if="validReviews && validReviews.length">
          <Card v-for="(review, index) in movieDetail?.reviews" :key="index" class="mb-4 p-4 rounded-md">
            <CardTitle class="flex items-center justify-between">
              <div class="inline-flex space-x-2 items-center">
                <Avatar>
                  <AvatarImage :src="review.user?.avatarPath
                      ? `/avatars/${review.user.avatarPath}`
                      : ''
                    " />
                  <AvatarFallback>PFP</AvatarFallback>
                </Avatar>
                <p class="font-semibold">
                  {{ review.user!.name }}
                </p>
              </div>
              <p class="text-sm text-yellow-500">
                {{ review.rating ? `${review.rating} ★` : "No Rating" }}
              </p>
            </CardTitle>
            <CardContent class="p-0 mt-2 text-sm">
              <p>
                {{ review.comment || "-" }}
              </p>
            </CardContent>
          </Card>
        </div>
        <div v-else class="text-gray-500 italic">No reviews yet.</div>
      </div>

      <div v-if="movieDetail!">
        <h2 class="text-xl w-full font-semibold mb-4">Detail</h2>
        <Card class="p-2">
          <CardTitle class="mb-2">
            <img v-if="movieDetail?.posterPath" :src="`/posters/${movieDetail?.posterPath}`"
              :alt="`Poster for ${movieDetail!.title}`" class="h-auto object-cover rounded" />
          </CardTitle>

          <div class="space-y-2">
            <h3 class="text-lg font-bold">
              {{ movieDetail!.title }}
            </h3>
            <p class="text-gray-100">
              {{ movieDetail!.synopsis }}
            </p>
          </div>

          <div class="mt-4 space-y-2 text-sm text-gray-400">
            <p>Duration: {{ movieDetail!.duration }} minutes</p>
            <p>Release Date: {{ useFormatDate(movieDetail!.releaseDate) }}</p>
            <p>
              Genres:
              <span v-if="movieDetail?.genres?.length">
                {{ movieDetail?.genres.map((g) => g.name).join(", ") }}
              </span>
              <span v-else>No genres</span>
            </p>
            <p>
              Cast:
              <span v-if="movieDetail?.casts?.length">
                {{ movieDetail?.casts.map((c) => c.name).join(", ") }}
              </span>
              <span v-else>No casts</span>
            </p>
            <p>
              Age Rating:
              <span v-if="movieDetail?.ageRating">
                {{ movieDetail?.ageRating.content }}
              </span>
              <span v-else>None</span>
            </p>
            <p>
              Average Rating:
              <span>
                {{ useFormatFloat(movieDetail.averageRating ?? 0) || "N/A" }}
              </span>
            </p>
          </div>
        </Card>
      </div>
      <div v-else class="text-gray-500 italic">No movie details found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from "~/components/ui/textarea/Textarea.vue";

const route = useRoute();
const { user } = useUserSession();
const currentSlug = route.params.slug;

const movieDetail = ref<Movies | null>(null);
const isLoading = ref<boolean>(false);
const error = ref("");

const userRating = ref<number | null>(null);
const userComment = ref<string>("");
const reviewMessage = ref<string>("");
const reviewSuccess = ref<boolean>(false);

const currentUserId = user.value?.id;

const fetchMovieDetail = async () => {
  try {
    const url = `/api/movies/detail?s=${currentSlug}`;
    const response = await $fetch<{
      success: boolean;
      result: any;
      message?: string;
    }>(url);

    if (response.success) {
      movieDetail.value = response.result;
    } else {
      error.value = response.message || "Failed to load movies.";
    }
  } catch (err: any) {
    error.value = err.message || "Something went wrong while fetching data.";
    console.error("Error fetching details:", err);
  } finally {
    isLoading.value = false;
  }
};

const userReview = computed(() => {
  if (!movieDetail.value) return null;
  const reviews = movieDetail.value.reviews ?? [];
  return reviews.find((r) => r.user?.id === currentUserId) || null;
});

function setRating(star: number) {
  userRating.value = star;
}

watch(
  userReview,
  (newVal) => {
    if (newVal) {
      userRating.value = newVal.rating;
      userComment.value = newVal.comment || "";
    } else {
      userRating.value = null;
      userComment.value = "";
    }
  },
  { immediate: true },
);

async function submitReview() {
  if (!userRating.value) {
    reviewMessage.value = "Please provide a rating.";
    reviewSuccess.value = false;
    hideMessageAfterDelay(5000);
    return;
  }
  if (!movieDetail.value) {
    reviewMessage.value = "No movie to review.";
    reviewSuccess.value = false;
    hideMessageAfterDelay(5000);
    return;
  }

  if (currentUserId)
    try {
      const response = await $fetch<{
        success: boolean;
        message?: string;
      }>("/api/reviews", {
        method: "POST",
        body: {
          userId: currentUserId,
          movieId: movieDetail.value?.id,
          rating: userRating.value,
          comment: userComment.value,
        },
      });

      if (response.success) {
        reviewMessage.value = "Review saved successfully!";
        reviewSuccess.value = true;
        userRating.value = null;
        userComment.value = "";
        hideMessageAfterDelay(500);

        fetchMovieDetail();
      } else {
        reviewMessage.value = response.message || "Failed to save review.";
        reviewSuccess.value = false;
        hideMessageAfterDelay(5000);
      }
    } catch (err: any) {
      reviewMessage.value = err.message || "An error occurred while saving.";
      reviewSuccess.value = false;
      console.error("Error upserting review:", err);

      hideMessageAfterDelay(3000);
    }
}

function hideMessageAfterDelay(delay: number) {
  console.log("Hiding message after", delay, "ms");
  setTimeout(() => {
    console.log("Clearing reviewMessage now");
    reviewMessage.value = "";
  }, delay);
}

const validReviews = computed(() => {
  const reviews = movieDetail?.value?.reviews ?? [];
  return reviews.filter((r) => r.id !== null);
});

onMounted(() => {
  fetchMovieDetail();
});
</script>
