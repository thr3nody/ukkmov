<template>
  <div>
    <p v-if="user">Hello {{ user.name }}</p>
    <p v-if="user">You are {{ user.role }}</p>
    <p v-if="user">and {{ user }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["authenticated"],
});

const { user, clear: clearSession } = useUserSession();

async function logout() {
  await clearSession();
  await navigateTo("/");
}
</script>
