<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Cast</DialogTitle>
      <DialogDescription> Update the details of this cast. </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            id="name"
            v-model="name"
            placeholder="Enter cast name..."
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
  cast: Casts;
}>();

const emit = defineEmits<{
  (e: "updated", updatedCast: Casts): void;
  (e: "error", errorMessage: string): void;
}>();

const name = ref<string>(props.cast.name);
const message = ref<string>("");
const success = ref<boolean>(false);

watch(
  () => props.cast,
  (newCast) => {
    name.value = newCast.name;
  },
);

async function onSubmit() {
  if (!name.value.trim()) {
    message.value = "Cast name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message?: string;
    }>("/api/casts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: props.cast.id, name: name.value.trim() }),
    });

    if (response.success) {
      message.value = "Cast updated successfully!";
      success.value = true;
      emit("updated", {
        id: props.cast.id,
        name: name.value.trim(),
      } as Casts);
    } else {
      message.value = response.message || "Failed to update cast.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error updating cast:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
