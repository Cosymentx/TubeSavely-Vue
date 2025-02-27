<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-lg transition-all duration-300',
      variantClasses[variant],
      sizeClasses[size],
      {
        'opacity-50 cursor-not-allowed': disabled,
        'hover:scale-105': !disabled
      }
    ]"
    @click="$emit('click', $event)"
  >
    <slot name="icon" v-if="$slots.icon" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'outline' | 'ghost'>,
    default: 'primary'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClasses = {
  primary: 'bg-[#f32b2b] text-white hover:bg-[#ff4b4b]',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  outline: 'border border-[#f32b2b] text-[#f32b2b] bg-transparent hover:bg-[#f32b2b]/10',
  ghost: 'text-gray-600 hover:bg-gray-100'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}
</script> 