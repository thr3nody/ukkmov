<template>
  <ContainDashReviewsTable />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin-or-author"],
});
</script>
