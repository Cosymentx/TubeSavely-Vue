<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center justify-center min-h-screen max-w-md mx-auto px-4 py-16">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Create Account</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Join us today</p>
      </div>

      <!-- Register Form -->
      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Username</label>
            <input 
              v-model="form.username"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
            <input 
              v-model="form.email"
              type="email"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Password</label>
            <input 
              v-model="form.password"
              type="password"
              required
              class="form-input"
            />
          </div>

          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Confirm Password</label>
            <input 
              v-model="form.confirmPassword"
              type="password"
              required
              class="form-input"
            />
          </div>

          <button
            type="submit"
            :disabled="userStore.isLoading || !isFormValid"
            class="w-full btn-primary py-3"
          >
            {{ userStore.isLoading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-300">
            Already have an account?
            <router-link 
              to="/login" 
              class="text-[#f32b2b] hover:text-[#ff4b4b] transition-colors"
            >
              Sign in
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useThemeStore } from '../stores/theme'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'
import type { UserCreate } from '../types/user'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
useThemeStore()

const form = ref<UserCreate>({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return (
    form.value.username.length >= 3 &&
    form.value.email.includes('@') &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toastStore.showToast('Please check your input', 'error')
    return
  }

  const success = await userStore.register(form.value)
  if (success) {
    router.push('/')
  }
}
</script> 