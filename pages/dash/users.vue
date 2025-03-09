<template>
  <div class="w-full">
    <ContainDashUsersTable />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin"],
});
</script>
