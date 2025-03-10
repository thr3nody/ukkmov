<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Age Rating</DialogTitle>
      <DialogDescription>
        Update the details of this age rating.
      </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="content" class="text-right">Name</Label>
          <Input
            id="content"
            v-model="content"
            placeholder="Enter age rating name..."
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
  ageRating: AgeRatings;
}>();

const emit = defineEmits<{
  (e: "updated", updatedAgeRating: AgeRatings): void;
  (e: "error", errorMessage: string): void;
}>();

const content = ref<string>(props.ageRating.content);
const message = ref<string>("");
const success = ref<boolean>(false);

watch(
  () => props.ageRating,
  (newAgeRating) => {
    content.value = newAgeRating.content;
  },
);

async function onSubmit() {
  if (!content.value.trim()) {
    message.value = "Age rating name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message?: string;
    }>("/api/age-ratings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.ageRating.id,
        content: content.value.trim(),
      }),
    });

    if (response.success) {
      message.value = "Age rating updated successfully!";
      success.value = true;
      emit("updated", {
        id: props.ageRating.id,
        content: content.value.trim(),
      } as AgeRatings);
    } else {
      message.value = response.message || "Failed to update age rating.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error updating age rating:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
