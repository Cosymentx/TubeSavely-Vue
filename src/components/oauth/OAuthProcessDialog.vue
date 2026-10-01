<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="onClose" class="relative z-50">
      <!-- 背景遮罩 -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 弹框内容 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 py-8 px-6 text-center shadow-xl transition-all">
              <!-- Success State -->
              <Transition 
                enter-active-class="transition duration-300 ease-out" 
                enter-from-class="transform scale-95 opacity-0" 
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" 
                leave-from-class="transform scale-100 opacity-100" 
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-if="state === 'success'" class="space-y-4">
                  <div class="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900">
                    <Icon icon="heroicons:check" class="w-8 h-8 text-green-500 dark:text-green-400" />
                  </div>
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-800 dark:text-white">
                    {{ message }}
                  </DialogTitle>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Redirecting you to the app...</p>
                </div>
              </Transition>

              <!-- Error State -->
              <Transition 
                enter-active-class="transition duration-300 ease-out" 
                enter-from-class="transform scale-95 opacity-0" 
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" 
                leave-from-class="transform scale-100 opacity-100" 
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-if="state === 'error'" class="space-y-4">
                  <div class="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900">
                    <Icon icon="heroicons:x-mark" class="w-8 h-8 text-red-500 dark:text-red-400" />
                  </div>
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-800 dark:text-white">
                    {{ message }}
                  </DialogTitle>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Please try again</p>
                  <button 
                    @click="onClose" 
                    class="mt-3 px-5 py-2 text-sm text-white bg-[#f32b2b] rounded-lg hover:bg-[#ff4b4b] transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </Transition>

              <!-- Loading State -->
              <Transition 
                enter-active-class="transition duration-300 ease-out" 
                enter-from-class="transform scale-95 opacity-0" 
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" 
                leave-from-class="transform scale-100 opacity-100" 
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-if="state === 'loading'" class="space-y-4">
                  <div class="relative w-16 h-16 mx-auto">
                    <!-- Outer ring -->
                    <div class="absolute inset-0 rounded-full border-[3px] border-[#f32b2b]/20"></div>
                    <!-- Spinning inner ring -->
                    <div class="absolute inset-0 rounded-full border-[3px] border-[#f32b2b] border-t-transparent animate-spin"></div>
                  </div>
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-800 dark:text-white">
                    {{ message }}
                  </DialogTitle>
                  <p class="text-sm text-gray-600 dark:text-gray-300">Please wait while we process your login...</p>
                </div>
              </Transition>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { Icon } from '@iconify/vue'

defineProps<{
  isOpen: boolean
  state: 'loading' | 'success' | 'error'
  message: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onClose() {
  emit('close')
}
</script> 