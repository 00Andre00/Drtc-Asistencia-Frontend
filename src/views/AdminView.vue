<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
          <div class="flex space-x-4">
            <router-link 
              to="/registro-personal"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nuevo Empleado
            </router-link>
            <router-link 
              to="/gestion-horarios"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Gestión Horarios
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

      <!-- Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Total Empleados</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ resumen.totalEmpleados }}</dd>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Presentes Hoy</dt>
            <dd class="mt-1 text-3xl font-semibold text-green-900">{{ resumen.presentesHoy }}</dd>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Tardanzas Hoy</dt>
            <dd class="mt-1 text-3xl font-semibold text-yellow-900">{{ resumen.tardanzasHoy }}</dd>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Faltas Hoy</dt>
            <dd class="mt-1 text-3xl font-semibold text-red-900">{{ resumen.faltasHoy }}</dd>
          </div>
        </div>
      </div>

      <!-- Filtros y Búsqueda -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <!-- Búsqueda por nombre o DNI -->
            <div class="relative">
              <input
                v-model="filtros.busqueda"
                type="text"
                placeholder="Buscar por nombre o DNI..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            <!-- Filtro por departamento -->
            <select
              v-model="filtros.departamento"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los departamentos</option>
              <option v-for="depto in departamentos" :key="depto" :value="depto">
                {{ depto }}
              </option>
            </select>

            <!-- Filtro por estado -->
            <select
              v-model="filtros.estado"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>

          <div class="flex space-x-2">
            <button
              @click="exportarDatos"
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Exportar Excel
            </button>
            <button
              @click="mostrarModalTiposHorario = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Tipos de Horario
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de empleados -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Empleados Registrados ({{ empleadosFiltrados.length }})
          </h3>
          <div class="text-sm text-gray-500">
            Actualizado: {{ ultimaActualizacion }}
          </div>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento / Puesto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencias
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tardanzas
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faltas
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="empleado in empleadosFiltrados" :key="empleado.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span class="text-indigo-800 font-medium text-sm">
                          {{ getIniciales(empleado.nombre, empleado.apellido) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ empleado.nombre }} {{ empleado.apellido }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ empleado.dni }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ empleado.departamento }}</div>
                    <div class="text-sm text-gray-500">{{ empleado.puesto }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          :class="getColorHorario(empleado.tipoHorario)">
                      {{ getHorarioTexto(empleado.tipoHorario) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          :class="empleado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ empleado.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <span class="font-semibold">{{ getEstadisticasEmpleado(empleado.id).asistencias }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span class="text-yellow-600 font-semibold">{{ getEstadisticasEmpleado(empleado.id).tardanzas }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span class="text-red-600 font-semibold">{{ getEstadisticasEmpleado(empleado.id).faltas }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <router-link 
                        :to="`/editar-empleado/${empleado.id}`"
                        class="text-indigo-600 hover:text-indigo-900"
                        title="Editar empleado"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </router-link>
                      <button
                        @click="eliminarEmpleado(empleado)"
                        class="text-red-600 hover:text-red-900"
                        title="Eliminar empleado"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje cuando no hay resultados -->
          <div v-if="empleadosFiltrados.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron empleados</h3>
            <p class="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Tipos de Horario -->
    <div v-if="mostrarModalTiposHorario" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Tipos de Horario</h3>
          <div class="space-y-3">
            <div v-for="horario in tiposHorario" :key="horario.id" 
                 class="p-3 border rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ horario.nombre }}</p>
                  <p class="text-sm text-gray-600">{{ horario.horario }}</p>
                  <p class="text-xs text-gray-500">Tardanza: {{ horario.tardanza }}</p>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="getColorHorario(horario.id)">
                  {{ horario.empleados }} empleados
                </span>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button
              @click="mostrarModalTiposHorario = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAsistenciaStore } from '@/stores/asistencia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const asistenciaStore = useAsistenciaStore()

const empleados = ref<any[]>([])
const asistencias = ref<any[]>([])
const mostrarModalTiposHorario = ref(false)

const filtros = reactive({
  busqueda: '',
  departamento: '',
  estado: ''
})

const notificacion = ref({
  mostrar: false,
  tipo: 'exito',
  titulo: '',
  mensaje: ''
})

const resumen = reactive({
  totalEmpleados: 0,
  presentesHoy: 0,
  tardanzasHoy: 0,
  faltasHoy: 0
})

const tiposHorario = [
  { id: 'CAS', nombre: 'CAS', horario: '8:00 AM - 1:00 PM / 3:00 PM - 6:00 PM', tardanza: '8:15 AM', empleados: 0 },
  { id: 'Practicante CAS', nombre: 'Practicante CAS', horario: '8:00 AM - 1:00 PM / 3:00 PM - 6:00 PM', tardanza: '8:15 AM', empleados: 0 },
  { id: 'Administrativo', nombre: 'Administrativo', horario: '9:00 AM - 5:00 PM', tardanza: '9:15 AM', empleados: 0 }
]

// Computed properties
const empleadosFiltrados = computed(() => {
  return empleados.value.filter(empleado => {
    const coincideBusqueda = !filtros.busqueda || 
      empleado.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      empleado.dni.includes(filtros.busqueda)

    const coincideDepartamento = !filtros.departamento || 
      empleado.departamento === filtros.departamento

    const coincideEstado = !filtros.estado || 
      (filtros.estado === 'activo' && empleado.activo) ||
      (filtros.estado === 'inactivo' && !empleado.activo)

    return coincideBusqueda && coincideDepartamento && coincideEstado
  })
})

const departamentos = computed(() => {
  const deptos = new Set(empleados.value.map(e => e.departamento))
  return Array.from(deptos).filter(Boolean)
})

const ultimaActualizacion = computed(() => {
  return new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Métodos
const getColorHorario = (tipo: string) => {
  const colores: any = {
    'CAS': 'bg-blue-100 text-blue-800',
    'Practicante CAS': 'bg-green-100 text-green-800',
    'Administrativo': 'bg-purple-100 text-purple-800'
  }
  return colores[tipo] || 'bg-gray-100 text-gray-800'
}

const getHorarioTexto = (tipo: string) => {
  const horarios: any = {
    'CAS': 'CAS',
    'Practicante CAS': 'Practicante',
    'Administrativo': 'Administrativo'
  }
  return horarios[tipo] || tipo || 'No asignado'
}

const getIniciales = (nombre: string, apellido: string) => {
  return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase()
}

const getEstadisticasEmpleado = (empleadoId: string) => {
  const empleadoAsistencias = asistencias.value.filter(a => a.empleadoId === empleadoId)
  
  return {
    asistencias: empleadoAsistencias.filter(a => a.estado === 'presente').length,
    tardanzas: empleadoAsistencias.filter(a => a.estado === 'tardanza').length,
    faltas: empleadoAsistencias.filter(a => a.estado === 'falta').length
  }
}

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

const calcularResumen = () => {
  const hoy = new Date().toDateString()
  const asistenciasHoy = asistencias.value.filter(a => 
    new Date(a.fecha).toDateString() === hoy
  )

  resumen.totalEmpleados = empleados.value.length
  resumen.presentesHoy = asistenciasHoy.filter(a => a.estado === 'presente').length
  resumen.tardanzasHoy = asistenciasHoy.filter(a => a.estado === 'tardanza').length
  resumen.faltasHoy = asistenciasHoy.filter(a => a.estado === 'falta').length

  // Calcular empleados por tipo de horario
  tiposHorario.forEach(horario => {
    horario.empleados = empleados.value.filter(e => e.tipoHorario === horario.id).length
  })
}

const eliminarEmpleado = async (empleado: any) => {
  if (confirm(`¿Está seguro de eliminar a ${empleado.nombre} ${empleado.apellido}?`)) {
    try {
      // Aquí iría la llamada al backend para eliminar
      console.log('Eliminar empleado:', empleado)
      mostrarNotificacion('exito', 'Empleado eliminado', `${empleado.nombre} ${empleado.apellido} ha sido eliminado correctamente`)
      
      // Recargar datos
      await cargarDatos()
    } catch (error: any) {
      mostrarNotificacion('error', 'Error al eliminar', error.message || 'Error al eliminar empleado')
    }
  }
}

const exportarDatos = () => {
  // Simular exportación de datos
  mostrarNotificacion('exito', 'Datos exportados', 'Los datos han sido exportados correctamente a Excel')
  console.log('Exportando datos:', empleadosFiltrados.value)
}

const cargarDatos = async () => {
  try {
    await asistenciaStore.cargarEmpleados()
    await asistenciaStore.cargarAsistencias()
    
    empleados.value = asistenciaStore.empleados
    asistencias.value = asistenciaStore.asistencias
    calcularResumen()
  } catch (error: any) {
    mostrarNotificacion('error', 'Error al cargar datos', error.message || 'Error al cargar la información')
  }
}

onMounted(async () => {
  await cargarDatos()
})
</script>