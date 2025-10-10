import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/auth'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password)
      user.value = response.user
      token.value = response.token
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})