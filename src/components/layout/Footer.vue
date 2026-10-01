<template>
  <footer class="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
    <p>&copy; {{ currentYear }} TubeSavely. All rights reserved.</p>
    <nav class="mt-2 flex justify-center gap-4" aria-label="Legal links">
      <router-link to="/terms" class="hover:text-[#f32b2b] transition-colors">Terms</router-link>
      <router-link to="/privacy" class="hover:text-[#f32b2b] transition-colors">Privacy</router-link>
      <router-link to="/data-deletion" class="hover:text-[#f32b2b] transition-colors">Data Deletion</router-link>
      <a href="https://github.com/Cosymentx" target="_blank" rel="noopener noreferrer" class="hover:text-[#f32b2b] transition-colors">Ecosystem</a>
    </nav>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
