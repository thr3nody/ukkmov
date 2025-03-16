<template>
  <div class="flex flex-col items-center space-y-4">
    <h1 class="text-2xl font-bold mb-4">{{ user!.name }}'s Profile</h1>
    <Avatar class="relative group w-28 h-28">
      <AvatarImage :src="avatarPreview" />
      <AvatarFallback>PFP</AvatarFallback>

      <label for="avatarFileInput"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/0 text-transparent rounded-full cursor-pointer transition-all duration-200 group-hover:bg-black/80 group-hover:text-white">
        <Icon name="mdi:camera" class="w-6 h-6" />
        <span class="text-sm">Change Image</span>
      </label>

      <input id="avatarFileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
    </Avatar>

    <div class="flex flex-col items-center w-80 space-y-4">
      <div class="space-y-2 w-full">
        <Label for="name" class="text-left">Name</Label>
        <Input id="name" v-model="name" placeholder="Name" />
      </div>

      <div class="space-y-2 w-full">
        <Label for="email" class="text-left">Email</Label>
        <Input id="email" :value="email" placeholder="Email" disabled aria-disabled="true" />
      </div>

      <div class="space-x-2 inline-flex w-full">
        <Button variant="default" @click="onUpdate">Update Profile</Button>
        <Button variant="destructive" @click="logOut">Log Out</Button>
      </div>
      <p v-if="message" class="text-sm mt-2" :class="success ? 'text-green-500' : 'text-red-500'">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();

const currentUserId = user.value!.id;
const name = ref("");
const email = ref("");
const avatarPreview = ref<string>("");
const avatarFile = ref<File | null>(null);

const message = ref("");
const success = ref<boolean>(false);

onMounted(() => {
  if (user.value) {
    name.value = user.value.name || "";
    email.value = user.value.email || "";
    avatarPreview.value = user.value.avatarPath
      ? `/avatars/${user.value.avatarPath}`
      : "";
  }
});

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0];
    avatarPreview.value = URL.createObjectURL(target.files[0]);
  }
}

async function onUpdate() {
  if (!name.value.trim()) {
    message.value = "Name cannot be empty.";
    success.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append("userId", currentUserId!.trim());
    formData.append("name", name.value.trim());
    formData.append("email", email.value.trim());
    if (avatarFile.value) {
      formData.append("avatar", avatarFile.value);
    }

    const response = await $fetch<{
      success: boolean;
      updatedUser?: {
        name: string;
        avatarPath?: string;
      };
      message?: string;
    }>("/api/users/profile", {
      method: "PUT",
      body: formData,
    });

    if (response.success) {
      message.value = "Profile updated successfully!";
      success.value = true;
      setTimeout(() => {
        message.value = "";
      }, 300);
      window.location.reload();
    } else {
      message.value = response.message || "Failed to update profile.";
      success.value = false;
      setTimeout(() => {
        message.value = "";
      }, 10000);
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    message.value = error.message || "An error occurred.";
    success.value = false;
  }
}

async function logOut() {
  await clearSession();
  await navigateTo("/");
}
</script>
