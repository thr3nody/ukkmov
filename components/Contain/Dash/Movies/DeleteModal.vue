<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to permanently
        delete this movie?
      </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <DialogFooter>
        <Button type="submit" variant="destructive">Confirm</Button>
      </DialogFooter>
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
const props = defineProps<{
  movie: Movies;
}>();

const emit = defineEmits<{
  (e: "deleted", id: number): void;
  (e: "error", errorMessage: string): void;
}>();

const message = ref<string>("");
const success = ref<boolean>(false);

async function onSubmit() {
  try {
    const response = await $fetch<{ success: boolean; message?: string }>(
      `/api/movies`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.movie.id }),
      },
    );
    if (response.success) {
      message.value = "Movie deleted successfully!";
      success.value = true;
      emit("deleted", props.movie.id);
    } else {
      message.value = response.message || "Failed to delete movie.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error deleting movie:", error);
    message.value = error.message || "An error occurred while deleting.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
