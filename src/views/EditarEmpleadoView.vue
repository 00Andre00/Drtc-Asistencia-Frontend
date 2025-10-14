<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Editar Empleado</h1>
          <div class="flex space-x-4">
            <router-link 
              to="/admin"
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Volver al Panel
            </router-link>
            <button
              @click="authStore.logout()"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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

      <!-- Cargando -->
      <div v-if="cargando" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando información del empleado...</p>
      </div>

      <!-- Formulario de edición -->
      <div v-else class="bg-white shadow rounded-lg p-6">
        <div class="mb-6 pb-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">{{ empleado.nombre }} {{ empleado.apellido }}</h2>
          <p class="text-gray-600">DNI: {{ empleado.dni }}</p>
        </div>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombres *
              </label>
              <input
                v-model="empleado.nombre"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellidos *
              </label>
              <input
                v-model="empleado.apellido"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                DNI *
              </label>
              <input
                v-model="empleado.dni"
                type="text"
                maxlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <input
                v-model="empleado.departamento"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Puesto *
              </label>
              <input
                v-model="empleado.puesto"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Horario *
              </label>
              <select
                v-model="empleado.tipoHorario"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccione horario</option>
                <option v-for="horario in horariosDisponibles" :key="horario.id" :value="horario.nombre">
                  {{ horario.nombre }} - {{ horario.entradaManana }} a {{ horario.salidaManana }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Ingreso *
              </label>
              <input
                v-model="empleado.fechaIngreso"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                v-model="empleado.activo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Información de Asistencias</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Total Asistencias:</span>
                <p class="text-gray-900">{{ estadisticas.totalAsistencias }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Tardanzas:</span>
                <p class="text-orange-600">{{ estadisticas.tardanzas }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Faltas:</span>
                <p class="text-red-600">{{ estadisticas.faltas }}</p>
              </div>
              <div>
                <span class="font-medium text-gray-700">Última Asistencia:</span>
                <p class="text-gray-900">{{ estadisticas.ultimaAsistencia || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-6">
            <button
              @click="confirmarEliminacion"
              class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Eliminar Empleado
            </button>
            <button
              @click="limpiarCambios"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Deshacer Cambios
            </button>
            <button
              @click="actualizarEmpleado"
              :disabled="!formularioValido"
              class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Actualizar Empleado
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminar" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">¿Eliminar Empleado?</h3>
          <p class="text-sm text-gray-500 mt-2">
            ¿Está seguro de que desea eliminar a {{ empleado.nombre }} {{ empleado.apellido }}? 
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-center space-x-4 mt-6">
            <button
              @click="mostrarModalEliminar = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              @click="eliminarEmpleado"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const empleadoId = route.params.id as string
const cargando = ref(true)
const mostrarModalEliminar = ref(false)

const horariosDisponibles = ref<any[]>([])
const empleadoOriginal = ref<any>(null)
const empleado = ref({
  id: '',
  dni: '',
  nombre: '',
  apellido: '',
  departamento: '',
  puesto: '',
  tipoHorario: '',
  fechaIngreso: '',
  activo: true
})

const estadisticas = ref({
  totalAsistencias: 0,
  tardanzas: 0,
  faltas: 0,
  ultimaAsistencia: ''
})

const notificacion = ref({
  mostrar: false,
  tipo: 'exito',
  titulo: '',
  mensaje: ''
})

const formularioValido = computed(() => {
  return empleado.value.dni && 
         empleado.value.nombre && 
         empleado.value.apellido && 
         empleado.value.departamento && 
         empleado.value.puesto && 
         empleado.value.tipoHorario &&
         empleado.value.fechaIngreso
})

const mostrarNotificacion = (tipo: 'exito' | 'error', titulo: string, mensaje: string) => {
  notificacion.value = {
    mostrar: true,
    tipo,
    titulo,
    mensaje
  }
  setTimeout(() => {
    notificacion.value.mostrar = false
  }, 5000)
}

const ocultarNotificacion = () => {
  notificacion.value.mostrar = false
}

const cargarHorarios = async () => {
  try {
    // Simular datos de horarios
    horariosDisponibles.value = [
      { id: '1', nombre: 'CAS', entradaManana: '08:00', salidaManana: '13:00', entradaTarde: '15:00', salidaTarde: '18:00' },
      { id: '2', nombre: 'Practicante CAS', entradaManana: '08:00', salidaManana: '13:00', entradaTarde: '15:00', salidaTarde: '18:00' },
      { id: '3', nombre: 'Administrativo', entradaManana: '09:00', salidaManana: '17:00', entradaTarde: '', salidaTarde: '' }
    ]
  } catch (error) {
    console.error('Error cargando horarios:', error)
  }
}

const cargarEmpleado = async () => {
  try {
    cargando.value = true
    
    // Simular llamada al backend
    setTimeout(() => {
      // Datos de ejemplo
      empleadoOriginal.value = {
        id: empleadoId,
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        departamento: 'TI',
        puesto: 'Desarrollador',
        tipoHorario: 'CAS',
        fechaIngreso: '2024-01-15',
        activo: true
      }
      
      empleado.value = { ...empleadoOriginal.value }
      
      // Simular estadísticas
      estadisticas.value = {
        totalAsistencias: 45,
        tardanzas: 3,
        faltas: 2,
        ultimaAsistencia: '2024-03-20 08:05'
      }
      
      cargando.value = false
    }, 1000)
    
  } catch (error) {
    mostrarNotificacion('error', 'Error', 'No se pudo cargar la información del empleado')
    router.push('/admin')
  }
}

const actualizarEmpleado = async () => {
  try {
    // Aquí iría la llamada al backend para actualizar
    console.log('Actualizando empleado:', empleado.value)
    
    mostrarNotificacion('exito', 'Empleado actualizado', 'La información del empleado ha sido actualizada correctamente')
    empleadoOriginal.value = { ...empleado.value }
    
  } catch (error: any) {
    mostrarNotificacion('error', 'Error al actualizar', error.message || 'Error al actualizar empleado')
  }
}

const confirmarEliminacion = () => {
  mostrarModalEliminar.value = true
}

const eliminarEmpleado = async () => {
  try {
    // Aquí iría la llamada al backend para eliminar
    console.log('Eliminando empleado:', empleadoId)
    
    mostrarNotificacion('exito', 'Empleado eliminado', 'El empleado ha sido eliminado correctamente')
    mostrarModalEliminar.value = false
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
    
  } catch (error: any) {
    mostrarNotificacion('error', 'Error al eliminar', error.message || 'Error al eliminar empleado')
    mostrarModalEliminar.value = false
  }
}

const limpiarCambios = () => {
  if (empleadoOriginal.value) {
    empleado.value = { ...empleadoOriginal.value }
    mostrarNotificacion('info', 'Cambios revertidos', 'Se han restaurado los valores originales')
  }
}

onMounted(() => {
  cargarHorarios()
  cargarEmpleado()
})
</script>