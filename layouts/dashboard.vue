<template>
  <div>
    <SidebarProvider>
      <ContainSidebar />
      <main>
        <SidebarTrigger />
        <slot />
      </main>
    </SidebarProvider>
  </div>
</template>
