<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a movie age rating</DialogTitle>
      <DialogDescription>
        Make a movie age rating data for categorizing movies.
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
const content = ref<string>("");
const message = ref<string>("");
const success = ref<boolean>(false);

const emit = defineEmits<{
  (e: "created", newAgeRatings: AgeRatings): void;
  (e: "error", message: string): void;
}>();

async function onSubmit() {
  if (!content.value.trim()) {
    message.value = "Age rating name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      ageRatings?: AgeRatings;
      message?: string;
    }>("/api/age-ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content.value.trim() }),
    });

    if (response.success) {
      message.value = "Age rating created successfully!";
      success.value = true;
      emit("created", {
        id: Date.now(),
        content: content.value.trim(),
      } as AgeRatings);
      content.value = ""; // Only emptying the name after success.
    } else {
      message.value = response.message || "Failed to create age rating.";
      success.value = false;
    }
  } catch (error: any) {
    console.error("Error creating age rating:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
  }
}
</script>
