<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Horarios</h1>
          <div class="flex space-x-4">
            <router-link 
              to="/admin"
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Volver al Panel
            </router-link>
            <button
              @click="mostrarModalCrear = true"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nuevo Horario
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

      <!-- Lista de horarios -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Horarios Configurados</h3>
        </div>
        <div class="border-t border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario Mañana
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario Tarde
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tolerancia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="horario in horarios" :key="horario.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ horario.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ horario.descripcion }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ horario.entradaManana }} - {{ horario.salidaManana }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ horario.entradaTarde ? `${horario.entradaTarde} - ${horario.salidaTarde}` : 'No aplica' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ horario.tolerancia }} minutos
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        :class="horario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ horario.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editarHorario(horario)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    @click="eliminarHorario(horario)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Crear/Editar Horario -->
    <div v-if="mostrarModalCrear || mostrarModalEditar" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ mostrarModalEditar ? 'Editar Horario' : 'Nuevo Horario' }}
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input v-model="horarioForm.nombre" type="text" class="w-full px-3 py-2 border rounded-md">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input v-model="horarioForm.descripcion" type="text" class="w-full px-3 py-2 border rounded-md">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Entrada Mañana *</label>
                <input v-model="horarioForm.entradaManana" type="time" class="w-full px-3 py-2 border rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Salida Mañana *</label>
                <input v-model="horarioForm.salidaManana" type="time" class="w-full px-3 py-2 border rounded-md">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Entrada Tarde</label>
                <input v-model="horarioForm.entradaTarde" type="time" class="w-full px-3 py-2 border rounded-md">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Salida Tarde</label>
                <input v-model="horarioForm.salidaTarde" type="time" class="w-full px-3 py-2 border rounded-md">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tolerancia (minutos)</label>
              <input v-model="horarioForm.tolerancia" type="number" class="w-full px-3 py-2 border rounded-md">
            </div>

            <div class="flex items-center">
              <input v-model="horarioForm.activo" type="checkbox" class="mr-2">
              <label class="text-sm text-gray-700">Horario activo</label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="cerrarModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              @click="guardarHorario"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {{ mostrarModalEditar ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const horarios = ref<any[]>([])
const mostrarModalCrear = ref(false)
const mostrarModalEditar = ref(false)
const horarioEditando = ref<any>(null)

const horarioForm = ref({
  nombre: '',
  descripcion: '',
  entradaManana: '08:00',
  salidaManana: '13:00',
  entradaTarde: '15:00',
  salidaTarde: '18:00',
  tolerancia: 15,
  activo: true
})

const notificacion = ref({
  mostrar: false,
  tipo: 'exito',
  titulo: '',
  mensaje: ''
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
    // Simular datos por ahora
    horarios.value = [
      {
        id: '1',
        nombre: 'CAS',
        descripcion: 'Contrato Administrativo de Servicios',
        entradaManana: '08:00',
        salidaManana: '13:00',
        entradaTarde: '15:00',
        salidaTarde: '18:00',
        tolerancia: 15,
        activo: true
      },
      {
        id: '2', 
        nombre: 'Practicante CAS',
        descripcion: 'Practicante con contrato CAS',
        entradaManana: '08:00',
        salidaManana: '13:00',
        entradaTarde: '15:00',
        salidaTarde: '18:00',
        tolerancia: 15,
        activo: true
      }
    ]
  } catch (error) {
    console.error('Error cargando horarios:', error)
  }
}

const editarHorario = (horario: any) => {
  horarioEditando.value = horario
  horarioForm.value = { ...horario }
  mostrarModalEditar.value = true
}

const eliminarHorario = async (horario: any) => {
  if (confirm(`¿Está seguro de eliminar el horario "${horario.nombre}"?`)) {
    try {
      // Aquí iría la llamada al backend
      mostrarNotificacion('exito', 'Horario eliminado', 'El horario ha sido eliminado correctamente')
      await cargarHorarios()
    } catch (error) {
      mostrarNotificacion('error', 'Error al eliminar', 'No se pudo eliminar el horario')
    }
  }
}

const guardarHorario = async () => {
  try {
    // Aquí iría la llamada al backend
    if (mostrarModalEditar.value) {
      mostrarNotificacion('exito', 'Horario actualizado', 'El horario ha sido actualizado correctamente')
    } else {
      mostrarNotificacion('exito', 'Horario creado', 'El horario ha sido creado correctamente')
    }
    cerrarModal()
    await cargarHorarios()
  } catch (error) {
    mostrarNotificacion('error', 'Error al guardar', 'No se pudo guardar el horario')
  }
}

const cerrarModal = () => {
  mostrarModalCrear.value = false
  mostrarModalEditar.value = false
  horarioEditando.value = null
  horarioForm.value = {
    nombre: '',
    descripcion: '',
    entradaManana: '08:00',
    salidaManana: '13:00',
    entradaTarde: '15:00',
    salidaTarde: '18:00',
    tolerancia: 15,
    activo: true
  }
}

onMounted(() => {
  cargarHorarios()
})
</script>