<template>
  <div class="flex justify-end">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NuxtLink to="/">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Home
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink to="/movies">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Browse
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

        <NavigationMenuItem v-if="user && (user.role === 'author' || user.role === 'admin')">
          <NuxtLink to="/dash/movies">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Dashboard
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>

        <NavigationMenuItem v-if="user">
          <NuxtLink to="/history">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              History
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
  </div>
</template>

<script lang="ts" setup>
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
const { user } = useUserSession();
</script>
