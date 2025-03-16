<template>
  <DialogContent>
    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <!-- Name Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" v-model="name" placeholder="Enter user name..." class="col-span-3" />
        </div>

        <!-- Email Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
          <Input id="email" v-model="email" placeholder="Enter user email..." class="col-span-3" />
        </div>

        <!-- Password Field (optional if you want to force updates) -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="password" class="text-right">Password</Label>
          <Input id="password" type="password" v-model="password" placeholder="Enter new password..."
            class="col-span-3" />
        </div>

        <!-- Role Field -->
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="role" class="text-right">Role</Label>
          <div class="col-span-3">
            <Select v-model="role">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="subscriber">Subscriber</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Update</Button>
      </DialogFooter>
      <!-- Display success/error message -->
      <div v-if="message" :class="['mt-2 text-sm', success ? 'text-green-500' : 'text-red-500']">
        {{ message }}
      </div>
    </form>
  </DialogContent>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  user: Users;
}>();

const emit = defineEmits<{
  (e: "updated", updatedUser: Users): void;
  (e: "error", errorMessage: string): void;
}>();

const name = ref<string>(props.user.name);
const email = ref<string>(props.user.email);
const password = ref<string>("");
const role = ref<string>(props.user.role);

const message = ref<string>("");
const success = ref<boolean>(false);

watch(
  () => props.user,
  (newUser) => {
    name.value = newUser.name;
    email.value = newUser.email;
    role.value = newUser.role;
    password.value = ""; // Will not give away old password :P
  },
);

async function onSubmit() {
  if (!name.value.trim() || !email.value.trim()) {
    message.value = "Name and email cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      updated?: Users;
      message?: string;
    }>("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user.id,
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
        role: role.value,
      }),
    });

    if (response.success) {
      message.value = "User updated successfully!";
      success.value = true;
      emit("updated", {
        ...props.user,
        name: name.value.trim(),
        email: email.value.trim(),
        role: role.value,
      } as Users);
    } else {
      message.value = response.message || "Failed to update user.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
