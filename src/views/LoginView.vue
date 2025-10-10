<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Sistema de Asistencias
        </h2>
        <p class="text-sm text-gray-600 mt-2">
          Ingrese sus credenciales
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <input
            id="username"
            v-model="username"
            name="username"
            type="text"
            required
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese su usuario"
          >
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            required
            class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ingrese su contraseña"
          >
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </div>
        
        <div v-if="error" class="text-red-600 text-center text-sm">
          {{ error }}
        </div>
      </form>

      <!-- Credenciales de prueba -->
      <div class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Credenciales de prueba:</h3>
        <div class="text-xs text-gray-600 space-y-1">
          <div><strong>Estación:</strong> operador / operador123</div>
          <div><strong>Administrativo:</strong> admin / admin123</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login(username.value, password.value)
    
    // Redirigir según el rol del usuario
    if (authStore.user?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/asistencia')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>