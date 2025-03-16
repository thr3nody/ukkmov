<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a New User</DialogTitle>
      <DialogDescription>
        Create a user with name, email, password, and role.
      </DialogDescription>
    </DialogHeader>

    <form @submit.prevent="onSubmit">
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" v-model="name" placeholder="Enter user name..." class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
          <Input id="email" v-model="email" placeholder="Enter user email..." class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="password" class="text-right">Password</Label>
          <Input id="password" type="password" v-model="password" placeholder="Enter user password..."
            class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="role" class="text-right">Role</Label>
          <div class="col-span-3">
            <Select v-model="role">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select role" />
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
        <Button type="submit">Submit</Button>
      </DialogFooter>

      <div v-if="message" :class="['mt-2 text-sm', success ? 'text-green-500' : 'text-red-500']">
        {{ message }}
      </div>
    </form>
  </DialogContent>
</template>

<script setup lang="ts">
const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("");

const message = ref("");
const success = ref(false);

const emit = defineEmits<{
  (e: "created", newUser: any): void;
  (e: "error", message: string): void;
}>();

async function onSubmit() {
  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !password.value.trim() ||
    !role.value.trim()
  ) {
    message.value = "Please fill out every field";
    success.value = false;
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
      };
      message?: string;
    }>("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
        role: role.value,
      }),
    });

    if (response.success) {
      message.value = "User created successfully!";
      success.value = true;

      if (response.user) {
        emit("created", response.user); // Emit to parent for table refresh after this thing is uh, basically done :D
      }

      name.value = "";
      email.value = "";
      password.value = "";
      role.value = "";
    } else {
      message.value = response.message || "Failed to create user.";
      success.value = false;
      emit("error", message.value);
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
    emit("error", message.value);
  }
}
</script>
