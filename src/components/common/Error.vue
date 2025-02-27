<template>
  <div v-if="message" class="flex items-center text-red-500 text-sm">
    <Icon icon="ri:error-warning-line" class="w-4 h-4 mr-1" />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  message?: string
}>()
</script> 