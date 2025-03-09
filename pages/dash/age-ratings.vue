<template>
  <div class="w-full">
    <ContainDashAgeRatingsTable />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin-or-author"],
});
</script>
