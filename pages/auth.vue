<template>
  <div class="flex pt-48 justify-center items-center">
    <ViewAuth />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['unauthenticated']
})
</script>