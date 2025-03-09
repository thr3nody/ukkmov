<template>
  <div class="w-full">
    <ContainDashGenresTable />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: ["authenticated", "admin-or-author"],
});
</script>
