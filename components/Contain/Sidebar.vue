<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <NuxtLink to="/"
        class="flex items-center gap-2 p-2 bg-[#16A34A] hover:bg-[#199848] dark:bg-[#22C55E] rounded-md dark:hover:bg-[#20B356] text-sm justify-center text-[#FFF1F2] dark:text-[#052E16] transition-all duration-200">
        <Icon name="mdi:home" size="24" />
        <span> Go Back to Main Page </span>
      </NuxtLink>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Author Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="default">
                <NuxtLink to="/dash/movies">
                  <Icon name="mdi:movie-outline" />
                  <span>Manage Movies</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="default">
                <NuxtLink to="/dash/genres">
                  <Icon name="mdi:category-outline" />
                  <span>Manage Genres</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="default">
                <NuxtLink to="/dash/casts">
                  <Icon name="mdi:category-outline" />
                  <span>Manage Casts</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup v-if="user!.role === 'admin'">
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild variant="default">
                <NuxtLink to="/dash/users">
                  <Icon name="mdi:user-card-details-outline" />
                  <span>Manage Users</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div class="flex items-center justify-between">
        <Avatar>
          <!-- TODO: Avatar for users, make it possible. -->
        </Avatar>
        <div class="flex gap-1">
          <ContainToggleTheme />
          <Button type="button" variant="destructive" size="icon" @click="handleLogout" class="w-[40px] h-[40px]">
            <Icon name="mdi:logout" />
          </Button>
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
const { user, clear: clearSession } = useUserSession();

async function handleLogout() {
  await clearSession();
  await navigateTo("/");
}
</script>
