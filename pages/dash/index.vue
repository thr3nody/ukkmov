<template>
  <div>
    <!-- <p>Welcome to your dashboard, {{ user!.name }}</p> -->
    <!-- <p>Your role is, {{ user!.role }}</p> -->
    <p>Hello</p>
  </div>
</template>

<script lang="ts" setup>
const { user } = useUserSession();
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin-or-author"],
});
</script>
