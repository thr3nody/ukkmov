<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to permanently
        delete this country origin?
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
  countryOrigin: CountriesOrigin;
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
      `/api/countries-origin`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.countryOrigin.id }),
      },
    );
    if (response.success) {
      message.value = "Country origin deleted successfully!";
      success.value = true;
      emit("deleted", props.countryOrigin.id);
    } else {
      message.value = response.message || "Failed to delete country origin.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error deleting country origin:", error);
    message.value = error.message || "An error occurred while deleting.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
