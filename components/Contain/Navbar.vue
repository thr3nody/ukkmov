<template>
  <div class="flex justify-end">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NuxtLink to="/movies">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Move Lists
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NuxtLink to="/auth">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Login
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>

<script lang="ts" setup>
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';
</script>