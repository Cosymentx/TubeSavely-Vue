<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const users = ref<Array<{ username: string }>>([])

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:8000/admin/users', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    if (response.ok) {
      users.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="form-container">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">管理员面板</h1>
      
      <div class="space-y-4">
        <div class="bg-white rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">用户列表</h2>
          <div class="space-y-2">
            <div v-for="user in users" :key="user.username" 
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-gray-700">{{ user.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 