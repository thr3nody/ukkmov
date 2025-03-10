<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a movie genre</DialogTitle>
      <DialogDescription>
        Make a movie genre for categorizing movies.
      </DialogDescription>
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
        <Button type="submit">Submit</Button>
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
const name = ref<string>("");
const message = ref<string>("");
const success = ref<boolean>(false);

const emit = defineEmits<{
  (e: "created", newGenre: Genres): void;
  (e: "error", message: string): void;
}>();

async function onSubmit() {
  if (!name.value.trim()) {
    message.value = "Genre name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      genre?: Genres;
      message?: string;
    }>("/api/genres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name.value.trim() }),
    });

    if (response.success) {
      message.value = "Genre created successfully!";
      success.value = true;
      emit("created", { id: Date.now(), name: name.value.trim() } as Genres);
      name.value = ""; // Only emptying the name after success.
    } else {
      message.value = response.message || "Failed to create genre.";
      success.value = false;
    }
  } catch (error: any) {
    console.error("Error creating genre:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
  }
}
</script>
