<template>
  <div class="fixed top-0 left-0 right-0 px-2 sm:px-4 z-50">
    <div class="max-w-7xl mx-auto">
      <!-- 背景层 -->
      <div class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-b border-white/10 dark:border-gray-800/50"></div>
      
      <!-- 内容层 -->
      <div class="relative flex items-center justify-between h-14 sm:h-16">
        <!-- Logo and Main Nav -->
        <div class="flex items-center">
          <router-link 
            to="/"
            class="text-lg sm:text-xl font-bold text-[#f32b2b] hover:text-[#ff4b4b] transition-colors"
          >
            TubeSavely
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-6 ml-8">
            <!-- Theme Toggle Button -->
            <button
              @click="themeStore.toggleTheme"
              class="text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] transition-colors"
            >
              <Icon 
                :icon="themeStore.isDark ? 'ri:sun-line' : 'ri:moon-line'" 
                class="w-4 h-4 opacity-60"
              />
            </button>

            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path" 
              class="relative group py-2 flex items-center gap-1.5"
              :class="[
                $route.path === item.path 
                  ? 'text-[#f32b2b]' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b]'
              ]"
            >
              <Icon 
                :icon="item.icon" 
                class="w-4 h-4 opacity-60 transition-colors" 
                :class="{ 'opacity-100': $route.path === item.path }"
              />
              <span class="transition-colors">{{ item.name }}</span>
              <div class="absolute bottom-0 left-0 w-full h-0.5 bg-[#f32b2b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                   :class="{ 'scale-x-100': $route.path === item.path }">
              </div>
            </router-link>
          </nav>
        </div>

        <!-- Auth Buttons or User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Mobile Menu Button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] transition-colors"
          >
            <Icon 
              :icon="isMobileMenuOpen ? 'ri:close-line' : 'ri:menu-line'" 
              class="w-6 h-6"
            />
          </button>

          <template v-if="userStore.localUser">
            <UserMenu :user="userStore.localUser" />
          </template>
          <template v-else>
            <div class="hidden md:flex items-center space-x-4">
              <router-link 
                to="/login"
                class="text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] transition-colors"
              >
                Login
              </router-link>
              <router-link 
                to="/register"
                class="btn-primary"
              >
                Sign Up
              </router-link>
            </div>
          </template>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg py-4 px-4 md:hidden">
          <nav class="flex flex-col space-y-4">
            <button
              @click="themeStore.toggleTheme"
              class="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] transition-colors"
            >
              <Icon 
                :icon="themeStore.isDark ? 'ri:sun-line' : 'ri:moon-line'" 
                class="w-4 h-4 opacity-60"
              />
              <span>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>

            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path" 
              class="flex items-center gap-1.5 transition-colors"
              :class="[
                $route.path === item.path 
                  ? 'text-[#f32b2b]' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b]'
              ]"
              @click="isMobileMenuOpen = false"
            >
              <Icon 
                :icon="item.icon" 
                class="w-4 h-4 opacity-60 transition-colors" 
                :class="{ 'opacity-100': $route.path === item.path }"
              />
              <span class="transition-colors">{{ item.name }}</span>
            </router-link>

            <template v-if="!userStore.localUser">
              <div class="pt-4 flex flex-col space-y-4">
                <router-link 
                  to="/login"
                  class="text-gray-700 dark:text-gray-200 hover:text-[#f32b2b] dark:hover:text-[#f32b2b] transition-colors"
                  @click="isMobileMenuOpen = false"
                >
                  Login
                </router-link>
                <router-link 
                  to="/register"
                  class="btn-primary text-center"
                  @click="isMobileMenuOpen = false"
                >
                  Sign Up
                </router-link>
              </div>
            </template>
          </nav>
        </div>
      </Transition>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-16"></div>

  <!-- 将模态框移到这里，并增加 z-index -->
  <Teleport to="body">
    <SupportedServices 
      :is-open="showPlatform" 
      @close="showPlatform = false" 
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useUserStore } from '../../stores/user'
import { useThemeStore } from '../../stores/theme'
import UserMenu from '@/components/user/UserMenu.vue'
import SupportedServices from '../common/SupportedPlatform.vue'

const userStore = useUserStore()
const themeStore = useThemeStore()
const showPlatform = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  {
    name: 'Platforms',
    path: '/platforms',
    icon: 'ri:menu-line'
  },
  {
    name: 'About',
    path: '/about',
    icon: 'ri:question-line'
  },
  {
    name: 'Terms',
    path: '/terms',
    icon: 'ri:article-line'
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: 'ri:chat-1-line'
  }
]
</script>