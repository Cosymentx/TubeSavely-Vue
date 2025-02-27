<template>
  <Listbox as="div" v-model="selectedValue" class="relative">
    <ListboxButton
      class="relative w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f32b2b]/50 transition-all text-left"
    >
      <span class="block truncate">{{ getSelectedLabel }}</span>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </ListboxButton>

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions
        class="absolute z-10 w-full mt-1 overflow-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-xl py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm max-h-60"
      >
        <ListboxOption
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          v-slot="{ active, selected }"
          as="template"
        >
          <li
            :class="[
              active ? 'bg-[#f32b2b]/10 text-[#f32b2b]' : 'text-gray-800 dark:text-white',
              'relative cursor-pointer select-none py-2 pl-10 pr-4'
            ]"
          >
            <span
              :class="[
                selected ? 'font-semibold' : 'font-normal',
                'block truncate'
              ]"
            >
              {{ option.label }}
            </span>
            <span
              v-if="selected"
              :class="[
                active ? 'text-[#f32b2b]' : 'text-[#f32b2b]',
                'absolute inset-y-0 left-0 flex items-center pl-3'
              ]"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

interface Option {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  options: Option[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getSelectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === selectedValue.value)
  return option ? option.label : ''
})
</script>
