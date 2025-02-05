<template>
  <div class="flex pt-72 justify-center items-center">
    <ViewAuth />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateUnauthenticatedTo: '/'
  }
})
</script>

<style>

</style>