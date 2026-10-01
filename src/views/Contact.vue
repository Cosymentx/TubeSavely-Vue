<template>
  <div class="relative min-h-screen overflow-x-clip">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Us</h1>
        
        <div class="space-y-6">
          <p class="text-gray-600 dark:text-gray-300">
            Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Name</label>
              <input 
                v-model="formData.name"
                type="text"
                class="form-input"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
              <input 
                v-model="formData.email"
                type="email"
                class="form-input"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Message</label>
              <textarea 
                v-model="formData.content"
                rows="4"
                class="form-input"
                :class="{ 'border-red-500': errors.content }"
              ></textarea>
              <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
            </div>

            <div class="flex justify-center mt-8">
              <button
                type="submit"
                class="btn-primary relative"
                :disabled="isSubmitting"
              >
                <span :class="{ 'opacity-0': isSubmitting }">Send Message</span>
                <div v-if="isSubmitting" class="absolute inset-0 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToastStore } from '../stores/toast'
import { useApi } from '../composables/useApi'
import type { FeedbackCreate } from '../types/feedback'
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'

const toastStore = useToastStore()
const { feedbackService } = useApi()

const isSubmitting = ref(false)
const formData = reactive<FeedbackCreate>({
  name: '',
  email: '',
  content: '',
  type: 'other'
})

const errors = reactive({
  name: '',
  email: '',
  content: ''
})

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.content = ''

  if (!formData.name) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!formData.content) {
    errors.content = 'Message is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    await feedbackService.submit(formData)
    toastStore.showToast('Thank you for your feedback! We will get back to you soon.', 'success')
    
    // Reset form
    formData.name = ''
    formData.email = ''
    formData.content = ''
  } catch (error) {
    toastStore.showToast('Failed to send feedback. Please try again later.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>