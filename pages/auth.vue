<template>
  <div class="flex pt-48 justify-center items-center">
    <div>
      <Tabs default-value="login" class="w-[400px]">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            Login
          </TabsTrigger>

          <TabsTrigger value="register">
            Register
          </TabsTrigger>
        </TabsList>
        
        <ContainLogin />
        <ContainRegister />
      </Tabs>

      <div>
        <NuxtLink to="/" class="space-x-1 mt-1 inline-flex p-1 items-center opacity-80 rounded-sm group hover:opacity-100 transition-all duration-200">
          <Icon name="uil:angle-left-b" size="16" />
          <span class="text-sm group-hover:underline group-hover:underline-offset-1">Go Back</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['unauthenticated']
})
</script>