<template>
  <div>
    Welcome to dash
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated', 'admin', 'author']
})
</script>