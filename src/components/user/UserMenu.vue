<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 p-2 rounded-xl hover:bg-[#f32b2b]/5 dark:hover:bg-[#f32b2b]/10 transition-colors"
    >
      <UserAvatar 
        :username="user.username"
        size="sm"
      />
      <div class="text-left">
        <span class="text-gray-600 dark:text-gray-300">{{ user.username }}</span>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Points: {{ user.points }}
        </div>
      </div>
      <Icon 
        :icon="isOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
        class="w-5 h-5 text-gray-400 dark:text-gray-500"
      />
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 py-2"
      >
        <router-link
          to="/profile"
          class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-[#f32b2b]/5 dark:hover:bg-[#f32b2b]/10 transition-colors"
        >
          <Icon icon="ri:user-line" class="w-5 h-5 mr-2" />
          Profile
        </router-link>
        
        <router-link
          to="/settings"
          class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-[#f32b2b]/5 dark:hover:bg-[#f32b2b]/10 transition-colors"
        >
          <Icon icon="ri:settings-line" class="w-5 h-5 mr-2" />
          Settings
        </router-link>

        <div class="border-t border-gray-100 dark:border-gray-700 my-2"></div>

        <button
          @click="handleLogout"
          class="w-full flex items-center px-4 py-2 text-[#f32b2b] hover:bg-[#f32b2b]/5 dark:hover:bg-[#f32b2b]/10 transition-colors"
        >
          <Icon icon="ri:logout-box-line" class="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useUserStore } from '../../stores/user'
import UserAvatar from './UserAvatar.vue'
import type { User } from '../../types/user'

const router = useRouter()
const userStore = useUserStore()
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

defineProps<{
  user: User
}>()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = async () => {
  userStore.logout()
  router.push('/login')
}
</script> 