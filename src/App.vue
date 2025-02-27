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
  // 初始化用户认证状态
  const token = localStorage.getItem('token')
  if (token) {
    try {
      await userStore.fetchProfile()  // 获取用户信息
    } catch (error) {
      // 如果获取用户信息失败，清除无效的token
      localStorage.removeItem('token')
      userStore.logout()  // 使用 logout 方法代替 setUser
    }
  }
})
</script>

<style>
@import './assets/main.css';
</style> 