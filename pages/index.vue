<template>
  <div class="w-full flex flex-col items-center space-y-4">
    <div class="w-full flex flex-col items-center space-y-2">
      <h1 class="text-9xl text-[#22C55E] font-bold">
        <span class="text-white dask:text-black">Mov</span>
        <span class="text-[#22C55E]">Flix</span>
      </h1>
      <h1 class="text-xl">
        Find some <span class="text-[#22C55E]">movies</span>, rate them, leave
        some comments.
      </h1>
    </div>

    <h1 class="text-lg max-w-[600px] text-center">
      Finding actual good movies that are community rated are difficult
      nowadays. Contribute to the site for finding a legit, community rated
      movies out there.
    </h1>

    <main class="flex flex-col items-center space-y-2">
      <div class="flex flex-col items-center">
        <h2>Start by searching for movies</h2>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Icon name="mdi:search" size="24" />
          </span>
        </div>
      </div>
      <div v-if="!user">
        <h2>
          Or
          <span>
            <NuxtLink to="/auth">
              <Button variant="secondary">login</Button>
            </NuxtLink>
          </span>
          to the site to start rating movies.
        </h2>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const user = useUserSession();
</script>
