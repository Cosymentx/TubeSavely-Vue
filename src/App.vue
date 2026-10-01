<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <Toast 
    :show="toastStore.show"
    :message="toastStore.message"
    :type="toastStore.type"
  />
</template>

<script setup lang="ts">
import Toast from '@/components/common/Toast.vue'
import { useToastStore } from './stores/toast'
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const toastStore = useToastStore()
const userStore = useUserStore()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    const profileLoaded = await userStore.fetchProfile()
    if (profileLoaded) return
  }

  // The refresh token is HttpOnly, so the browser can restore a session
  // without exposing the long-lived credential to JavaScript.
  await userStore.restoreSession()
})
</script>

<style>
@import './assets/main.css';
</style>
