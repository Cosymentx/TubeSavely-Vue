<template>
  <footer class="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
    <p>&copy; {{ currentYear }} TubeSavely. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
