<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Update Country Origin</DialogTitle>
      <DialogDescription>
        Update the details of this country origin.
      </DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            id="name"
            v-model="name"
            placeholder="Enter country origin name..."
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
  countryOrigin: CountriesOrigin;
}>();

const emit = defineEmits<{
  (e: "updated", updatedCountryOrigin: CountriesOrigin): void;
  (e: "error", errorMessage: string): void;
}>();

const name = ref<string>(props.countryOrigin.name);
const message = ref<string>("");
const success = ref<boolean>(false);

watch(
  () => props.countryOrigin,
  (newCountryOrigin) => {
    name.value = newCountryOrigin.name;
  },
);

async function onSubmit() {
  if (!name.value.trim()) {
    message.value = "Country origin name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message?: string;
    }>("/api/countries-origin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.countryOrigin.id,
        name: name.value.trim(),
      }),
    });

    if (response.success) {
      message.value = "Country origin updated successfully!";
      success.value = true;
      emit("updated", {
        id: props.countryOrigin.id,
        name: name.value.trim(),
      } as CountriesOrigin);
    } else {
      message.value = response.message || "Failed to update country origin.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error updating country origin:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
