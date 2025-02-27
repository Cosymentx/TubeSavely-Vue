<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div 
      v-if="show"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl shadow-lg min-w-[200px] text-center"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-blue-500 text-white': type === 'info',
        'bg-yellow-500 text-white': type === 'warning'
      }"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

defineProps<Props>()
</script> 