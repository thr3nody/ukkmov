<template>
  <div class="w-full flex flex-col items-center space-y-4">
    <div class="w-full flex flex-col items-center space-y-2">
      <h1 class="text-9xl text-[#22C55E] font-bold">
        <span class="dark:text-white text-black">Mov</span>
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
      <div class="flex items-center">
        <h2>
          Start by
          <NuxtLink to="/movies"
            ><Button variant="default">browsing</Button></NuxtLink
          >
          for movies
        </h2>
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
