<template>
  <div>
    <p>You are currently {{ status }}</p>
  </div>
</template>

<script lang="ts" setup>
const { status } = useAuth()

definePageMeta({
  auth: false
})
</script>

<style>

</style>