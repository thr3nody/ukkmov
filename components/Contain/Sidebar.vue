<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <NuxtLink
        to="/"
        class="flex items-center gap-2 p-2 bg-[#16A34A] hover:bg-[#199848] dark:bg-[#22C55E] rounded-md dark:hover:bg-[#20B356] text-sm justify-center text-[#FFF1F2] dark:text-[#052E16] transition-all duration-200"
      >
        <Icon name="mdi:home" size="24" />
        <span> Go Back to Main Page </span>
      </NuxtLink>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Reports</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/per-user-reviews">
                  <Icon name="mdi:comment-account-outline" size="24" />
                  <span>Per User Reviews</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Author Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/movies">
                  <Icon name="mdi:movie-outline" size="24" />
                  <span>Manage Movies</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/genres">
                  <Icon name="mdi:category-outline" size="24" />
                  <span>Manage Genres</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/casts">
                  <Icon name="mdi:people-outline" size="24" />
                  <span>Manage Casts</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/reviews">
                  <Icon name="mdi:comment-text-multiple-outline" size="24" />
                  <span>Manage Reviews</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/age-ratings">
                  <Icon name="mdi:number-9-plus-circle-outline" size="24" />
                  <span>Manage Age Ratings</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/countries-origin">
                  <Icon name="mdi:map-outline" size="24" />
                  <span>Manage Countries Origin</span>
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
              <SidebarMenuButton
                asChild
                variant="default"
                class="sidebar-button"
              >
                <NuxtLink to="/dash/users">
                  <Icon name="mdi:user-card-details-outline" size="24" />
                  <span>Manage Users</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>

<script setup lang="ts">
const { user, clear: clearSession } = useUserSession();

async function handleLogout() {
  await clearSession();
  await navigateTo("/");
}
</script>
