<template>
  <div class="flex justify-end">
    <ClientOnly>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <ContainToggleTheme />
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NuxtLink to="/movies">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                Move Lists
              </NavigationMenuLink>
            </NuxtLink>
          </NavigationMenuItem>

          <NavigationMenuItem v-if="!user">
            <NuxtLink to="/auth">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                Login
              </NavigationMenuLink>
            </NuxtLink>
          </NavigationMenuItem>

          <NavigationMenuItem v-if="user">
            <NuxtLink to="/profile">
              <NavigationMenuLink :class="navigationMenuTriggerStyle()">
                Profile
              </NavigationMenuLink>
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
const { user } = useUserSession()
</script>