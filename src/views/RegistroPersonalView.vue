<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Registro de Personal</h1>
          <router-link 
            to="/admin"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Volver al Panel
          </router-link>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Registrar Nuevo Empleado</h2>
        
        <div class="space-y-6">
          <!-- Búsqueda por DNI -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                DNI
              </label>
              <input
                v-model="dniBusqueda"
                type="text"
                maxlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese DNI"
              >
            </div>
            <div>
              <button
                @click="buscarEnReniec"
                :disabled="!dniBusqueda || dniBusqueda.length !== 8"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Buscar en RENIEC
              </button>
            </div>
            <div class="text-sm text-gray-500">
              Los datos se autocompletarán
            </div>
          </div>

          <!-- Formulario de registro -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombres
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
                Apellidos
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
                Departamento
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
                Puesto
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
                Tipo de Horario
              </label>
              <select
                v-model="empleado.tipoHorario"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Seleccione horario</option>
                <option value="matutino">Matutino (7:00 AM - 3:00 PM)</option>
                <option value="vespertino">Vespertino (3:00 PM - 11:00 PM)</option>
                <option value="nocturno">Nocturno (11:00 PM - 7:00 AM)</option>
                <option value="administrativo">Administrativo (8:00 AM - 5:00 PM)</option>
                <option value="flexible">Flexible (6:00 AM - 2:00 PM)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Ingreso
              </label>
              <input
                v-model="empleado.fechaIngreso"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
            </div>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button
              @click="limpiarFormulario"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              @click="registrarEmpleado"
              :disabled="!formularioValido"
              class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Registrar Empleado
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const dniBusqueda = ref('')
const empleado = ref({
  dni: '',
  nombre: '',
  apellido: '',
  departamento: '',
  puesto: '',
  tipoHorario: '',
  fechaIngreso: new Date().toISOString().split('T')[0]
})

const formularioValido = computed(() => {
  return empleado.value.dni && 
         empleado.value.nombre && 
         empleado.value.apellido && 
         empleado.value.departamento && 
         empleado.value.puesto && 
         empleado.value.tipoHorario
})

const buscarEnReniec = async () => {
  try {
    // Aquí iría la llamada a la API RENIEC
    // Por ahora simulamos datos
    empleado.value.dni = dniBusqueda.value
    empleado.value.nombre = 'Nombres del empleado'
    empleado.value.apellido = 'Apellidos del empleado'
    
    alert('Datos encontrados en RENIEC y autocompletados')
  } catch (error) {
    alert('Error al buscar en RENIEC: ' + error)
  }
}

const registrarEmpleado = async () => {
  try {
    // Aquí iría la llamada al backend para registrar
    alert('Empleado registrado correctamente')
    limpiarFormulario()
  } catch (error) {
    alert('Error al registrar empleado: ' + error)
  }
}

const limpiarFormulario = () => {
  empleado.value = {
    dni: '',
    nombre: '',
    apellido: '',
    departamento: '',
    puesto: '',
    tipoHorario: '',
    fechaIngreso: new Date().toISOString().split('T')[0]
  }
  dniBusqueda.value = ''
}
</script>