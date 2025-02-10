<template>
  <div>
    Casts
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated', 'admin', 'author']
})
</script>