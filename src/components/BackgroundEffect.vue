<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none bg-effect-container">
    <!-- 背景渐变 -->
    <div class="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 opacity-60"></div>

    <!-- 网格纹理 -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.02] dark:opacity-[0.04]"></div>

    <!-- 动态模糊效果 -->
    <div class="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-blob">
      <div class="absolute rounded-full bg-gradient-to-br from-[#f32b2b]/[0.15] to-[#ff6b6b]/[0.15] dark:from-[#f32b2b]/[0.08] dark:to-[#ff6b6b]/[0.08] w-[30%] h-[30%] top-[20%] left-[20%] blur-3xl transform-gpu"></div>
      <div class="absolute rounded-full bg-gradient-to-tr from-[#ff4b4b]/[0.15] to-[#ff8080]/[0.15] dark:from-[#ff4b4b]/[0.08] dark:to-[#ff8080]/[0.08] w-[28%] h-[28%] top-[35%] left-[15%] blur-3xl transform-gpu"></div>
      <div class="absolute rounded-full bg-gradient-to-bl from-[#f32b2b]/[0.15] to-[#ff6b6b]/[0.15] dark:from-[#f32b2b]/[0.08] dark:to-[#ff6b6b]/[0.08] w-[32%] h-[32%] top-[15%] left-[35%] blur-3xl transform-gpu"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bg-effect-container {
  contain: strict;
  transform: translateZ(0);
}

@keyframes blob {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.05);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.animate-blob {
  animation: blob 90s ease-in-out infinite;
  will-change: transform;
  transform: translateZ(0);
}
</style>