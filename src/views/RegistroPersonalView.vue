<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-2xl font-bold text-gray-900">Registro de Personal</h1>
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
               : notificacion.tipo === 'error'
               ? 'bg-red-50 border-red-200 text-red-800'
               : 'bg-blue-50 border-blue-200 text-blue-800'
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

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Registrar Nuevo Empleado</h2>
        
        <div class="space-y-6">
          <!-- Búsqueda por DNI -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Búsqueda por DNI</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ingrese DNI
                </label>
                <input
                  v-model="dniBusqueda"
                  type="text"
                  maxlength="8"
                  @keyup.enter="buscarDni"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Ej: 12345678"
                  :disabled="buscando"
                >
              </div>
              <div>
                <button
                  @click="buscarDni"
                  :disabled="!dniBusqueda || dniBusqueda.length !== 8 || buscando"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <svg v-if="buscando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ buscando ? 'Buscando...' : 'Buscar DNI' }}
                </button>
              </div>
              <div class="text-sm text-gray-500">
                Ingrese DNI de 8 dígitos para consultar en RENIEC
              </div>
            </div>
          </div>

          <!-- Información del DNI encontrado -->
          <div v-if="informacionDNI" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-sm font-medium text-green-800">
                  DNI encontrado: {{ informacionDNI.numero }}
                </p>
                <p class="text-sm text-green-600 mt-1">
                  {{ informacionDNI.nombre_completo }}
                </p>
                <p class="text-xs text-green-500 mt-1">
                  Los campos se han llenado automáticamente
                </p>
              </div>
            </div>
          </div>

          <!-- Formulario de registro -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-800 mb-4">Datos del Empleado</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombres *
                </label>
                <input
                  v-model="empleado.nombre"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                  placeholder="Se llenará automáticamente"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos *
                </label>
                <input
                  v-model="empleado.apellido"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                  placeholder="Se llenará automáticamente"
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-100"
                  required
                  readonly
                  placeholder="Se llenará automáticamente"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  v-model="empleado.departamento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                >
                  <option value="">Seleccione departamento</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Puesto *
                </label>
                <select
                  v-model="empleado.puesto"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                >
                  <option value="">Seleccione puesto</option>
                  <option value="Desarrollador">Desarrollador</option>
                  <option value="Analista">Analista</option>
                  <option value="Diseñador">Diseñador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Asistente">Asistente</option>
                  <option value="Practicante">Practicante</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Horario *
                </label>
                <select
                  v-model="empleado.tipoHorario"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  required
                >
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-6">
              <button
                @click="limpiarFormulario"
                class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Limpiar Todo
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAsistenciaStore } from '@/stores/asistencia'

const router = useRouter()
const authStore = useAuthStore()
const asistenciaStore = useAsistenciaStore()

const dniBusqueda = ref('')
const buscando = ref(false)
const informacionDNI = ref<any>(null)
const horariosDisponibles = ref<any[]>([])
const empleado = ref({
  dni: '',
  nombre: '',
  apellido: '',
  departamento: '',
  puesto: '',
  tipoHorario: '',
  fechaIngreso: new Date().toISOString().split('T')[0]
})

const notificacion = ref({
  mostrar: false,
  tipo: 'exito' as 'exito' | 'error' | 'info',
  titulo: '',
  mensaje: ''
})

const formularioValido = computed(() => {
  return empleado.value.dni && 
         empleado.value.nombre && 
         empleado.value.apellido && 
         empleado.value.departamento && 
         empleado.value.puesto && 
         empleado.value.tipoHorario
})

const mostrarNotificacion = (tipo: 'exito' | 'error' | 'info', titulo: string, mensaje: string) => {
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

const buscarDni = async () => {
  if (!dniBusqueda.value || dniBusqueda.value.length !== 8) {
    mostrarNotificacion('error', 'DNI inválido', 'Por favor ingrese un DNI válido de 8 dígitos')
    return
  }

  buscando.value = true
  informacionDNI.value = null

  try {
    // Verificar si el empleado ya existe
    const empleadoExistente = await asistenciaStore.verificarEmpleado(dniBusqueda.value)
    
    if (empleadoExistente) {
      mostrarNotificacion('error', 'DNI ya registrado', 'Este DNI ya pertenece a un empleado registrado')
      return
    }

    // Consultar datos del DNI desde la API
    const resultado = await asistenciaStore.consultarDni(dniBusqueda.value)
    
    if (resultado && resultado.success && resultado.data) {
      informacionDNI.value = resultado.data
      
      // Llenar automáticamente los campos con datos reales de la API
      empleado.value.dni = resultado.data.numero
      empleado.value.nombre = resultado.data.nombres
      empleado.value.apellido = `${resultado.data.apellido_paterno} ${resultado.data.apellido_materno}`
      
      mostrarNotificacion('exito', 'DNI encontrado', 'Los datos se han cargado automáticamente desde RENIEC')
    } else {
      mostrarNotificacion('error', 'DNI no encontrado', 'No se encontraron datos para este DNI')
    }
    
  } catch (error: any) {
    console.error('Error consultando DNI:', error)
    mostrarNotificacion('error', 'Error en consulta', error.message || 'No se pudo consultar el DNI')
  } finally {
    buscando.value = false
  }
}

const cargarHorarios = async () => {
  try {
    // Cargar horarios desde el store
    await asistenciaStore.cargarHorarios()
    horariosDisponibles.value = asistenciaStore.horarios || []
  } catch (error) {
    console.error('Error cargando horarios:', error)
    // Si no hay horarios, mostrar opciones básicas
    horariosDisponibles.value = [
      { id: '1', nombre: 'CAS', entradaManana: '08:00', salidaManana: '13:00' },
      { id: '2', nombre: 'Administrativo', entradaManana: '09:00', salidaManana: '17:00' }
    ]
  }
}

const registrarEmpleado = async () => {
  try {
    // Validar que el DNI no esté duplicado
    const empleadoExistente = await asistenciaStore.verificarEmpleado(empleado.value.dni)
    if (empleadoExistente) {
      mostrarNotificacion('error', 'DNI duplicado', 'Este DNI ya pertenece a un empleado registrado')
      return
    }

    // Registrar empleado usando el store
    await asistenciaStore.registrarEmpleado(empleado.value)
    
    mostrarNotificacion('exito', 'Empleado registrado', 'El empleado ha sido registrado correctamente')
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/admin')
    }, 2000)
  } catch (error: any) {
    console.error('Error registrando empleado:', error)
    const mensaje = error.response?.data?.message || error.message || 'Error al registrar empleado'
    mostrarNotificacion('error', 'Error al registrar', mensaje)
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
  informacionDNI.value = null
}

onMounted(() => {
  cargarHorarios()
})
</script>