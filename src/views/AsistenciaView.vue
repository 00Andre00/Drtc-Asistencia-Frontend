<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header con navegación -->
    <header class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-xl font-bold text-gray-900">Sistema de Asistencias</h1>
          <div class="flex items-center space-x-4">
            <!-- Botones de navegación -->
            <div class="flex space-x-2">
              <button
                @click="vistaActiva = 'asistencia'"
                :class="[
                  'px-4 py-2 rounded-md font-medium transition-colors',
                  vistaActiva === 'asistencia' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                Marcación
              </button>
              <button
                @click="vistaActiva = 'justificacion'"
                :class="[
                  'px-4 py-2 rounded-md font-medium transition-colors',
                  vistaActiva === 'justificacion' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                Justificación
              </button>
            </div>
            <!-- Botón de logout -->
            <button
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Notificación -->
      <div v-if="notificacion.mostrar" 
           :class="[
             'mb-6 p-4 rounded-lg border transition-all duration-300',
             notificacion.tipo === 'exito' 
               ? 'bg-green-50 border-green-200 text-green-800' 
               : 'bg-red-50 border-red-200 text-red-800'
           ]">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ notificacion.titulo }}</p>
            <p class="text-sm mt-1">{{ notificacion.mensaje }}</p>
          </div>
          <button @click="ocultarNotificacion" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      </div>

      <!-- Vista de Marcación -->
      <div v-if="vistaActiva === 'asistencia'" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Marcar Asistencia</h2>
        
        <div class="space-y-6">
          <!-- DNI Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <input
              v-model="dni"
              type="text"
              @keyup.enter="marcarEntrada"
              class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-semibold text-gray-900 bg-white"
              placeholder="Ingrese su DNI"
              maxlength="8"
            >
          </div>

          <!-- Cámara más pequeña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cámara de Seguridad
            </label>
            <div class="border-2 border-gray-300 rounded-md p-2 max-w-md mx-auto">
              <video ref="videoRef" class="w-full rounded-md" autoplay style="max-height: 200px;"></video>
              <canvas ref="canvasRef" class="hidden"></canvas>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex space-x-4 pt-4">
            <button
              @click="marcarEntrada"
              :disabled="!dni || dni.length !== 8"
              class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-lg font-medium transition-colors"
            >
              Marcar Entrada
            </button>
            <button
              @click="marcarSalida"
              :disabled="!dni || dni.length !== 8"
              class="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 text-lg font-medium transition-colors"
            >
              Marcar Salida
            </button>
          </div>
        </div>
      </div>

      <!-- Vista de Justificación -->
      <div v-if="vistaActiva === 'justificacion'" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Justificar Salida</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <input
              v-model="dniJustificacion"
              type="text"
              class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-semibold text-gray-900 bg-white"
              placeholder="Ingrese su DNI"
              maxlength="8"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motivo de salida
            </label>
            <select v-model="motivoJustificacion" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Seleccione un motivo</option>
              <option value="comision">Comisión de servicio</option>
              <option value="permiso">Permiso personal</option>
              <option value="medico">Consulta médica</option>
              <option value="familiar">Asunto familiar</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div v-if="motivoJustificacion === 'otro'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Especifique el motivo
            </label>
            <input
              v-model="motivoPersonalizado"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describa el motivo"
            >
          </div>

          <button
            @click="justificarSalida"
            :disabled="!dniJustificacion || dniJustificacion.length !== 8 || !motivoJustificacion"
            class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 text-lg font-medium transition-colors"
          >
            Justificar Salida
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAsistenciaStore } from '@/stores/asistencia'
import { useAuthStore } from '@/stores/auth' // ← AGREGAR ESTA IMPORTACIÓN

const router = useRouter()
const asistenciaStore = useAsistenciaStore()
const authStore = useAuthStore() // ← AGREGAR ESTA LÍNEA

const vistaActiva = ref<'asistencia' | 'justificacion'>('asistencia')
const dni = ref('')
const dniJustificacion = ref('')
const motivoJustificacion = ref('')
const motivoPersonalizado = ref('')

const notificacion = ref({
  mostrar: false,
  tipo: 'exito', // 'exito' | 'error'
  titulo: '',
  mensaje: ''
})

const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const stream = ref<MediaStream>()
let timeoutNotificacion: any = null

// Función de logout - CORREGIDA
const logout = () => {
  if (confirm('¿Está seguro de que desea cerrar sesión?')) {
    authStore.logout()
    router.push('/')
  }
}

// Mostrar notificación
const mostrarNotificacion = (tipo: 'exito' | 'error', titulo: string, mensaje: string) => {
  notificacion.value = {
    mostrar: true,
    tipo,
    titulo,
    mensaje
  }

  // Auto-ocultar después de 5 segundos
  if (timeoutNotificacion) {
    clearTimeout(timeoutNotificacion)
  }
  timeoutNotificacion = setTimeout(ocultarNotificacion, 5000)
}

const ocultarNotificacion = () => {
  notificacion.value.mostrar = false
  if (timeoutNotificacion) {
    clearTimeout(timeoutNotificacion)
    timeoutNotificacion = null
  }
}

// Iniciar cámara automáticamente
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 320, height: 240 } 
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (error) {
    console.error('Error al acceder a la cámara:', error)
    mostrarNotificacion('error', 'Error de cámara', 'No se pudo acceder a la cámara. Por favor, permita el acceso.')
  }
}

const capturePhoto = (): string => {
  if (!videoRef.value || !canvasRef.value) return ''

  const context = canvasRef.value.getContext('2d')
  if (!context) return ''

  canvasRef.value.width = videoRef.value.videoWidth
  canvasRef.value.height = videoRef.value.videoHeight
  context.drawImage(videoRef.value, 0, 0)

  return canvasRef.value.toDataURL('image/jpeg')
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
}

const marcarEntrada = async () => {
  if (!dni.value || dni.value.length !== 8) {
    mostrarNotificacion('error', 'DNI inválido', 'Por favor ingrese un DNI válido de 8 dígitos')
    return
  }

  try {
    const foto = capturePhoto()
    const resultado = await asistenciaStore.marcarAsistencia(dni.value, foto)
    
    const hora = new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
    
    mostrarNotificacion(
      'exito', 
      '✅ Marcación exitosa', 
      `${resultado.asistencia.empleado.nombre} ${resultado.asistencia.empleado.apellido} - Hora: ${hora} - Estado: ${resultado.asistencia.estado}`
    )
    
    dni.value = ''
  } catch (error: any) {
    const mensajeError = error.response?.data?.message || 'Error al registrar asistencia'
    mostrarNotificacion('error', '❌ Error en marcación', mensajeError)
    console.error(error)
  }
}

const marcarSalida = async () => {
  if (!dni.value || dni.value.length !== 8) {
    mostrarNotificacion('error', 'DNI inválido', 'Por favor ingrese un DNI válido de 8 dígitos')
    return
  }

  const motivo = prompt('Motivo de la salida:')
  if (!motivo) return

  try {
    await asistenciaStore.registrarSalida(dni.value, motivo)
    
    const hora = new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
    
    mostrarNotificacion('exito', '✅ Salida registrada', `Salida justificada a las ${hora}`)
    dni.value = ''
  } catch (error: any) {
    const mensajeError = error.response?.data?.message || 'Error al registrar salida'
    mostrarNotificacion('error', '❌ Error en salida', mensajeError)
    console.error(error)
  }
}

const justificarSalida = async () => {
  if (!dniJustificacion.value || dniJustificacion.value.length !== 8) {
    mostrarNotificacion('error', 'DNI inválido', 'Por favor ingrese un DNI válido de 8 dígitos')
    return
  }

  if (!motivoJustificacion.value) {
    mostrarNotificacion('error', 'Motivo requerido', 'Por favor seleccione un motivo')
    return
  }

  const motivoFinal = motivoJustificacion.value === 'otro' 
    ? motivoPersonalizado.value 
    : motivoJustificacion.value

  try {
    await asistenciaStore.registrarSalida(dniJustificacion.value, motivoFinal)
    
    const hora = new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
    
    mostrarNotificacion('exito', '✅ Salida justificada', `Salida registrada a las ${hora}`)
    
    // Limpiar formulario
    dniJustificacion.value = ''
    motivoJustificacion.value = ''
    motivoPersonalizado.value = ''
  } catch (error: any) {
    const mensajeError = error.response?.data?.message || 'Error al justificar salida'
    mostrarNotificacion('error', '❌ Error en justificación', mensajeError)
    console.error(error)
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  stopCamera()
  if (timeoutNotificacion) {
    clearTimeout(timeoutNotificacion)
  }
})
</script>