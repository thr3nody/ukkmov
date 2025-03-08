<template>
  <div>
    <SidebarProvider>
      <ContainSidebar />
      <main :style="mainStyle" class="flex-1 px-4 py-2">
        <SidebarTrigger />
        <slot />
      </main>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts">
const sidebar = ref<HTMLElement | null>(null);
const sidebarWidth = ref(0);

onMounted(() => {
  if (sidebar.value) {
    sidebarWidth.value = sidebar.value.offsetWidth;
  }
});

const mainStyle = computed(() => ({
  minWidth: `calc(100% - $(sidebarWidth.value)px)`,
}));
</script>
