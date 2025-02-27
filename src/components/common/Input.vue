<template>
  <div class="w-full">
    <label 
      v-if="label" 
      :for="id" 
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2',
          errorMessage 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-[#f32b2b] focus:ring-[#f32b2b]/20'
        ]"
        class="px-4 py-2 text-sm"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <Icon 
        v-if="icon" 
        :icon="icon" 
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
      />
    </div>
    <p 
      v-if="errorMessage" 
      class="mt-1 text-xs text-red-500"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { PropType } from 'vue'

defineProps({
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  type: {
    type: String as PropType<'text' | 'email' | 'password' | 'number'>,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script> 