<script setup>

</script>

<template>
  <div class="flex h-screen overflow-hidden flex-col">
  <main
      class="pt-16 flex-1 overflow-auto bg-light-bg dark:bg-dark-bg
          px-8 md:px-12 lg:px-16 pb-6 transition-all duration-500"
  >
    <router-view />
  </main>
  </div>
</template>

<style scoped>

</style>