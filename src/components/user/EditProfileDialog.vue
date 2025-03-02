<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeDialog" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-2xl p-6 text-left align-middle shadow-xl dark:border-gray-700/30 will-change-transform">
              <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                Edit Profile
              </DialogTitle>

              <div class="space-y-6">
                <!-- Avatar Section -->
                <div class="flex items-center space-x-4 will-change-transform transform-none">
                  <UserAvatar :username="profile.username" :avatar="profile.avatar" size="md"
                    class="w-16 h-16 will-change-transform transform-none" />
                  <div>
                    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleAvatarChange" />
                    <button @click="$refs.fileInput.click()" class="btn-secondary text-sm" :disabled="isLoading">
                      Change Avatar
                    </button>
                    <p class="text-xs text-gray-500 mt-1">
                      JPG or PNG, max 2MB
                    </p>
                  </div>
                </div>

                <!-- Password Section -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ hasPassword ? 'Change Password' : 'Set Password' }}
                    </h4>
                  </div>

                  <!-- 已设置密码的用户显示修改密码表单 -->
                  <template v-if="hasPassword">
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Current Password</label>
                      <input v-model="password.current" type="password" class="form-input w-full"
                        :disabled="isLoading" />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                      <input v-model="password.new" type="password" class="form-input w-full" :disabled="isLoading" />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm New Password</label>
                      <input v-model="password.confirm" type="password" class="form-input w-full"
                        :disabled="isLoading" />
                    </div>
                  </template>

                  <!-- 未设置密码的用户显示设置密码表单 -->
                  <template v-else>
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
                      <input v-model="password.new" type="password" class="form-input w-full" :disabled="isLoading" />
                    </div>
                    <div>
                      <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm Password</label>
                      <input v-model="password.confirm" type="password" class="form-input w-full"
                        :disabled="isLoading" />
                    </div>
                  </template>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-4">
                <button type="button" class="btn-secondary" @click="closeDialog" :disabled="isLoading">
                  Cancel
                </button>
                <button type="button" class="btn-primary" @click="saveChanges"
                  :disabled="isLoading || !hasChanges || (hasPasswordInput && !isPasswordValid)">
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { useToastStore } from '../../stores/toast'
import { useUserStore } from '../../stores/user'
import UserAvatar from './UserAvatar.vue'
import type { UserPasswordUpdate } from '../../types/user'

interface Props {
  isOpen: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const userStore = useUserStore()
const toastStore = useToastStore()
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const newAvatar = ref<File | null>(null)

// 添加hasPassword状态
const hasPassword = computed(() => userStore.localUser?.has_password ?? false)

const password = ref({
  current: '',
  new: '',
  confirm: ''
})

const profile = ref({
  username: userStore.localUser?.username || '',
  avatar: userStore.localUser?.avatar || ''
})

const hasPasswordInput = computed(() => {
  return !!(password.value.current || password.value.new || password.value.confirm)
})

const hasChanges = computed(() => {
  return !!(newAvatar.value || hasPasswordInput.value)
})

// 修改密码验证逻辑
const isPasswordValid = computed(() => {
  if (!hasPasswordInput.value) return true

  if (hasPassword.value) {
    // 已设置密码的用户需要输入当前密码
    return (
      password.value.current &&
      password.value.new.length >= 6 &&
      password.value.new === password.value.confirm
    )
  } else {
    // 未设置密码的用户只需要输入新密码
    return (
      password.value.new.length >= 6 &&
      password.value.new === password.value.confirm
    )
  }
})

// Reset form when dialog opens
onMounted(() => {
  profile.value.username = userStore.localUser?.username || ''
  profile.value.avatar = userStore.localUser?.avatar || ''
})

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    toastStore.showToast('Avatar file size must be less than 2MB', 'error')
    target.value = ''
    return
  }

  // Validate file type
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    toastStore.showToast('Only JPG and PNG files are supported', 'error')
    target.value = ''
    return
  }

  newAvatar.value = file
}

const saveChanges = async () => {
  try {
    isLoading.value = true
    let avatarUpdated = false
    let passwordUpdated = false

    // 更新头像
    if (newAvatar.value) {
      try {
        const avatarResult = await userStore.updateAvatar(newAvatar.value)
        avatarUpdated = !!avatarResult // 根据返回结果判断是否成功
        if (!avatarUpdated) {
          toastStore.showToast('Failed to update avatar', 'error')
        }
      } catch (error) {
        toastStore.showToast('Failed to update avatar', 'error')
      }
    }

    // 更新密码
    if (hasPasswordInput.value) {
      if (password.value.new !== password.value.confirm) {
        toastStore.showToast('New passwords do not match', 'error')
        return
      }

      try {
        const passwordData = hasPassword.value
          ? {
              current_password: password.value.current,
              new_password: password.value.new
            }
          : {
              new_password: password.value.new
            }
        
        const passwordResult = await userStore.updatePassword(passwordData as UserPasswordUpdate)
        passwordUpdated = !!passwordResult // 根据返回结果判断是否成功
      } catch (error) {
        toastStore.showToast(
          error instanceof Error ? error.message : 'Failed to update password',
          'error'
        )
      }
    }

    // 根据实际更新结果决定是否关闭对话框
    if (avatarUpdated || passwordUpdated) {
      const successMessage = [
        avatarUpdated && 'Avatar',
        passwordUpdated && 'Password'
      ].filter(Boolean).join(' and ') + ' updated successfully'
      
      toastStore.showToast(successMessage, 'success')
      emit('saved')
      closeDialog()
    } else if (newAvatar.value || hasPasswordInput.value) {
      // 有尝试更新但都失败了
      // toastStore.showToast('No changes were saved failed', 'error')
    } else {
      // 没有任何更改
      toastStore.showToast('No changes were made', 'info')
    }

  } catch (error) {
    toastStore.showToast('An unexpected error occurred', 'error')
  } finally {
    isLoading.value = false
  }
}

const closeDialog = () => {
  // Reset form
  password.value = {
    current: '',
    new: '',
    confirm: ''
  }
  newAvatar.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('close')
}
</script>
