<template>
  <div class="relative min-h-screen overflow-x-clip">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center justify-center min-h-screen max-w-md mx-auto px-4 py-16">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Welcome</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Sign in to continue</p>
      </div>

      <!-- Login Form -->
      <div
        class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
            <input v-model="form.email" type="email" required class="form-input" autocomplete="email" />
          </div>

          <div>
            <label class="block text-gray-600 dark:text-gray-300 mb-2">Password</label>
            <input v-model="form.password" type="password" required class="form-input" autocomplete="current-password" />
          </div>

          <button type="submit" :disabled="userStore.isLoading" class="w-full btn-primary">
            {{ userStore.isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 font-medium">Or continue
              with</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4">
          <button @click="handleSocialLogin('google')" :disabled="isProcessingOAuth"
            class="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-white/80 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon icon="ri:google-fill" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#f32b2b]" />
            <span class="group-hover:text-[#f32b2b]">Google</span>
          </button>

          <button @click="handleSocialLogin('github')" :disabled="isProcessingOAuth"
            class="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-white/80 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon icon="ri:github-fill" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#f32b2b]" />
            <span class="group-hover:text-[#f32b2b]">GitHub</span>
          </button>

          <button @click="handleSocialLogin('wechat')" :disabled="isProcessingOAuth"
            class="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-white/80 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-colors group col-span-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon icon="ri:wechat-fill" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#f32b2b]" />
            <span class="group-hover:text-[#f32b2b]">WeChat</span>
          </button>
          <button @click="handleSocialLogin('facebook')" :disabled="isProcessingOAuth"
            class="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-white/80 dark:bg-gray-800/50 hover:bg-gray-50/90 dark:hover:bg-gray-700/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-colors group col-span-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon icon="ri:facebook-fill" class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#f32b2b]" />
            <span class="group-hover:text-[#f32b2b]">Facebook</span>
          </button>
        </div>

        <div class="mt-6 text-center">
          <p class="text-gray-600 dark:text-gray-300">
            Don't have an account?
            <router-link to="/register" class="text-[#f32b2b] hover:text-[#ff4b4b] transition-colors">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <Footer />

    <!-- OAuth Processing Dialog -->
    <OAuthProcessDialog :is-open="showOAuthDialog" :state="oauthState" :message="oauthMessage"
      @close="handleOAuthClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'
import { useThemeStore } from '../stores/theme'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'
import OAuthProcessDialog from '../components/oauth/OAuthProcessDialog.vue'
import type { UserLogin } from '../types/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
useThemeStore()

const form = ref<UserLogin>({
  email: '',
  password: ''
})

// OAuth 相关状态
const showOAuthDialog = ref(false)
const oauthState = ref<'loading' | 'success' | 'error'>('loading')
const oauthMessage = ref('')
const isProcessingOAuth = ref(false)

const handleSubmit = async () => {
  try {
    const success = await userStore.login(form.value)
    if (success) {
      await router.push('/')
    }
  } catch (error: Error | unknown) {
    console.error('Login error:', error)
    toastStore.showToast('Login failed: ' + ((error as Error)?.message || 'Unknown error'), 'error')
  }
}

const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook' | 'wechat') => {
  try {
    isProcessingOAuth.value = true
    showOAuthDialog.value = true
    oauthState.value = 'loading'
    oauthMessage.value = 'Preparing login...'

    // 延迟一会再跳转，让用户看到加载状态
    await new Promise(resolve => setTimeout(resolve, 800))
    await userStore.socialLogin(provider)
  } catch (err) {
    oauthState.value = 'error'
    oauthMessage.value = 'Failed to initiate login'
    toastStore.showToast('Login failed', 'error')
  } finally {
    isProcessingOAuth.value = false
  }
}

const handleOAuthClose = () => {
  showOAuthDialog.value = false
  isProcessingOAuth.value = false
  oauthState.value = 'loading'
  oauthMessage.value = ''
  // 清除 URL 中的 OAuth 参数
  if (window.history.replaceState) {
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
}

// 处理 OAuth 回调
onMounted(() => {
  const { code, state, error } = route.query
  if (code || state || error) {
    showOAuthDialog.value = true
    handleOAuthCallback()
  }
})

const handleOAuthCallback = async () => {
  const { oauth_provider } = route.query
  const { code, state, error } = route.query

  if (error) {
    oauthState.value = 'error'
    oauthMessage.value = 'Login failed'
    toastStore.showToast(`Login failed: ${error}`, 'error')
    return
  }

  if (!code || !state || !oauth_provider) {
    oauthState.value = 'error'
    oauthMessage.value = 'Invalid callback parameters'
    toastStore.showToast('Invalid callback parameters', 'error')
    return
  }

  try {
    oauthState.value = 'loading'
    oauthMessage.value = 'Processing login...'

    const success = await userStore.handleOAuthCallback(
      oauth_provider as string,
      code as string,
      state as string
    )

    if (success) {
      oauthState.value = 'success'
      oauthMessage.value = 'Login successful!'
      const redirectUrl = userStore.getRedirectUrl()
      setTimeout(() => {
        showOAuthDialog.value = false
        router.push(redirectUrl)
      }, 1500)
    } else {
      oauthState.value = 'error'
      oauthMessage.value = 'Login failed'
    }
  } catch (error) {
    oauthState.value = 'error'
    oauthMessage.value = 'Login failed'
    toastStore.showToast('Login failed', 'error')
  }
}

// 监听路由变化，处理 OAuth 回调
watch(
  () => route.query,
  (query) => {
    if (query.code || query.state || query.error) {
      showOAuthDialog.value = true
      handleOAuthCallback()
    }
  }
)
</script>