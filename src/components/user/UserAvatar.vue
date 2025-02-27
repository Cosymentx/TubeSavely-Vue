<template>
  <div 
    class="rounded-full bg-gradient-to-r from-[#f32b2b] to-[#ff4b4b] flex items-center justify-center text-white font-medium overflow-hidden"
    :class="{
      'w-8 h-8 text-sm': size === 'sm',
      'w-10 h-10': size === 'md',
      'w-12 h-12 text-lg': size === 'lg'
    }"
  >
    <img 
      v-if="avatar"
      :src="avatar"
      :alt="username"
      class="w-full h-full object-cover"
    />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  username: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const initials = computed(() => {
  return props.username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script> 