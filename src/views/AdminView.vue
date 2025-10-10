<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
          <button
            @click="authStore.logout()"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

      <!-- Tabla de empleados -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Empleados</h3>
        </div>
        <div class="border-t border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asistencias
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tardanzas
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faltas
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="empleado in empleados" :key="empleado.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getEstadisticasEmpleado(empleado.id).asistencias }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getEstadisticasEmpleado(empleado.id).tardanzas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getEstadisticasEmpleado(empleado.id).faltas }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useAsistenciaStore } from '@/stores/asistencia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const asistenciaStore = useAsistenciaStore()

const empleados = ref<any[]>([])
const asistencias = ref<any[]>([])
const resumen = reactive({
  totalEmpleados: 0,
  presentesHoy: 0,
  tardanzasHoy: 0,
  faltasHoy: 0
})

const getEstadisticasEmpleado = (empleadoId: string) => {
  const empleadoAsistencias = asistencias.value.filter(a => a.empleadoId === empleadoId)
  
  return {
    asistencias: empleadoAsistencias.filter(a => a.estado === 'presente').length,
    tardanzas: empleadoAsistencias.filter(a => a.estado === 'tardanza').length,
    faltas: empleadoAsistencias.filter(a => a.estado === 'falta').length
  }
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
}

onMounted(async () => {
  await asistenciaStore.cargarEmpleados()
  await asistenciaStore.cargarAsistencias()
  
  empleados.value = asistenciaStore.empleados
  asistencias.value = asistenciaStore.asistencias
  calcularResumen()
})
</script>