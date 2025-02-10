<template>
  <div>
    Users
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated', 'admin']
})
</script>