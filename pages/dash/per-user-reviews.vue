<template>
  <div>
    <ContainDashPerUserReviewsTable />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin-or-author"],
});
</script>
