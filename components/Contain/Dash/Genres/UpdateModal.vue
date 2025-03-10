<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Genre</DialogTitle>
      <DialogDescription> Update the details of this genre. </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            id="name"
            v-model="name"
            placeholder="Enter genre name..."
            class="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Update</Button>
      </DialogFooter>
      <!-- Display success/error message -->
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
import { ref, watch } from "vue";

const props = defineProps<{
  genre: Genres;
}>();

const emit = defineEmits<{
  (e: "updated", updatedGenre: Genres): void;
  (e: "error", errorMessage: string): void;
}>();

const name = ref<string>(props.genre.name);
const message = ref<string>("");
const success = ref<boolean>(false);

watch(
  () => props.genre,
  (newGenre) => {
    name.value = newGenre.name;
  },
);

async function onSubmit() {
  if (!name.value.trim()) {
    message.value = "Genre name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message?: string;
    }>("/api/genres", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: props.genre.id, name: name.value.trim() }),
    });

    if (response.success) {
      message.value = "Genre updated successfully!";
      success.value = true;
      emit("updated", {
        id: props.genre.id,
        name: name.value.trim(),
      } as Genres);
    } else {
      message.value = response.message || "Failed to update genre.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error updating genre:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
