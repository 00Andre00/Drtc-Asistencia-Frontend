<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ empleado?.nombre }} {{ empleado?.apellido }}
            </h1>
            <p class="text-gray-600">{{ empleado?.puesto }} - {{ empleado?.departamento }}</p>
          </div>
          <router-link 
            to="/admin"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Volver al Panel
          </router-link>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-sm text-gray-600">Total Asistencias</p>
          <p class="text-2xl font-bold">{{ estadisticas.asistencias }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-sm text-gray-600">Tardanzas</p>
          <p class="text-2xl font-bold text-yellow-600">{{ estadisticas.tardanzas }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-sm text-gray-600">Faltas</p>
          <p class="text-2xl font-bold text-red-600">{{ estadisticas.faltas }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-sm text-gray-600">Salidas Justificadas</p>
          <p class="text-2xl font-bold text-blue-600">{{ estadisticas.salidas }}</p>
        </div>
      </div>

      <!-- Historial de Asistencias -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Historial de Asistencias</h2>
        </div>
        <div class="p-6">
          <div v-if="asistencias.length === 0" class="text-center text-gray-500 py-4">
            No hay asistencias registradas
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="asistencia in asistencias" 
              :key="asistencia.id"
              class="border rounded-lg p-4"
              :class="{
                'border-green-200 bg-green-50': asistencia.estado === 'presente',
                'border-yellow-200 bg-yellow-50': asistencia.estado === 'tardanza',
                'border-red-200 bg-red-50': asistencia.estado === 'falta'
              }"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ new Date(asistencia.fecha).toLocaleDateString() }}</p>
                  <p class="text-sm text-gray-600">
                    Entrada: {{ asistencia.horaEntrada }}
                    <span v-if="asistencia.horaSalida"> | Salida: {{ asistencia.horaSalida }}</span>
                  </p>
                </div>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': asistencia.estado === 'presente',
                    'bg-yellow-100 text-yellow-800': asistencia.estado === 'tardanza',
                    'bg-red-100 text-red-800': asistencia.estado === 'falta'
                  }"
                >
                  {{ asistencia.estado }}
                </span>
              </div>
              <div v-if="asistencia.fotoEntrada" class="mt-2">
                <img 
                  :src="asistencia.fotoEntrada" 
                  alt="Foto de entrada"
                  class="w-20 h-20 object-cover rounded border"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Papeletas/Salidas -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="px-6 py-4 border-b">
          <h2 class="text-lg font-semibold">Salidas Justificadas</h2>
        </div>
        <div class="p-6">
          <div v-if="papeletas.length === 0" class="text-center text-gray-500 py-4">
            No hay salidas justificadas
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="papeleta in papeletas" 
              :key="papeleta.id"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ new Date(papeleta.fecha).toLocaleDateString() }}</p>
                  <p class="text-sm text-gray-600">{{ papeleta.motivo }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ papeleta.tipo }}</p>
                </div>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': papeleta.aprobado,
                    'bg-yellow-100 text-yellow-800': !papeleta.aprobado
                  }"
                >
                  {{ papeleta.aprobado ? 'Aprobado' : 'Pendiente' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAsistenciaStore } from '@/stores/asistencia'

const route = useRoute()
const asistenciaStore = useAsistenciaStore()

const empleado = ref<any>(null)
const asistencias = ref<any[]>([])
const papeletas = ref<any[]>([])

const estadisticas = computed(() => {
  return {
    asistencias: asistencias.value.filter(a => a.estado === 'presente').length,
    tardanzas: asistencias.value.filter(a => a.estado === 'tardanza').length,
    faltas: asistencias.value.filter(a => a.estado === 'falta').length,
    salidas: papeletas.value.filter(p => p.aprobado).length
  }
})

onMounted(async () => {
  const empleadoId = route.params.id as string
  // En una implementación real, harías una llamada API aquí
  // Por ahora usamos datos de ejemplo
  empleado.value = {
    id: empleadoId,
    nombre: 'Juan',
    apellido: 'Pérez',
    puesto: 'Desarrollador',
    departamento: 'TI'
  }
})
</script>