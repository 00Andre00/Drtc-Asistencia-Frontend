import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface Empleado {
  id: string
  dni: string
  nombre: string
  apellido: string
  departamento: string
  puesto: string
  tipoHorario: string
  fechaIngreso: Date
  activo?: boolean
}

export interface Horario {
  id: string
  nombre: string
  entradaManana: string
  salidaManana: string
  entradaTarde: string | null
  salidaTarde: string | null
  tolerancia: number
  activo: boolean
  descripcion?: string | null
}

export interface Asistencia {
  id: string
  empleadoId: string
  fecha: Date
  horaEntrada: string
  horaSalida: string | null
  estado: 'presente' | 'tardanza' | 'falta'
  foto?: string
}

export const useAsistenciaStore = defineStore('asistencia', () => {
  // Estado
  const empleados: Ref<Empleado[]> = ref([])
  const asistencias: Ref<Asistencia[]> = ref([])
  const horarios: Ref<Horario[]> = ref([])
  const papeletas: Ref<any[]> = ref([])

  // Getters
  const empleadosActivos = computed(() => 
    empleados.value.filter(emp => emp.activo !== false)
  )

  const asistenciasHoy = computed(() => {
    const hoy = new Date().toDateString()
    return asistencias.value.filter(a => 
      new Date(a.fecha).toDateString() === hoy
    )
  })

  // Función helper para hacer requests
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const token = localStorage.getItem('auth_token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }

    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Acciones
  const cargarEmpleados = async () => {
    try {
      const data = await apiRequest('/admin/empleados')
      empleados.value = data
    } catch (error) {
      console.error('Error cargando empleados:', error)
      empleados.value = []
    }
  }

  const cargarAsistencias = async () => {
    try {
      const data = await apiRequest('/admin/asistencias')
      asistencias.value = data
    } catch (error) {
      console.error('Error cargando asistencias:', error)
      asistencias.value = []
    }
  }

  const cargarHorarios = async () => {
    try {
      const data = await apiRequest('/admin/horarios')
      horarios.value = data
    } catch (error) {
      console.error('Error cargando horarios:', error)
      // Datos por defecto en caso de error
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
          nombre: 'Administrativo',
          descripcion: 'Horario administrativo',
          entradaManana: '09:00',
          salidaManana: '17:00',
          entradaTarde: null,
          salidaTarde: null,
          tolerancia: 15,
          activo: true
        }
      ]
    }
  }

  const cargarPapeletas = async () => {
    try {
      const data = await apiRequest('/admin/papeletas')
      papeletas.value = data
    } catch (error) {
      console.error('Error cargando papeletas:', error)
      papeletas.value = []
    }
  }

  const verificarEmpleado = async (dni: string): Promise<boolean> => {
    try {
      // Primero verificar localmente
      const existeLocal = empleados.value.some(emp => emp.dni === dni)
      if (existeLocal) return true

      // Luego verificar en el backend
      const data = await apiRequest(`/admin/empleados/verificar/${dni}`)
      return data.existe || false
    } catch (error) {
      console.error('Error verificando empleado:', error)
      // Si hay error, verificar solo localmente
      return empleados.value.some(emp => emp.dni === dni)
    }
  }

  const consultarDni = async (dni: string): Promise<any> => {
    try {
      const data = await apiRequest(`/admin/reniec/${dni}`)
      return data
    } catch (error) {
      console.error('Error consultando DNI en RENIEC:', error)
      throw error
    }
  }

  const registrarEmpleado = async (empleadoData: any) => {
    try {
      const data = await apiRequest('/admin/empleados', {
        method: 'POST',
        body: JSON.stringify(empleadoData)
      })
      
      // Agregar al estado local
      empleados.value.push(data)
      
      return data
    } catch (error) {
      console.error('Error registrando empleado:', error)
      throw error
    }
  }

  const marcarAsistencia = async (dni: string, foto: string) => {
    try {
      const data = await apiRequest('/asistencias/marcar', {
        method: 'POST',
        body: JSON.stringify({ dni, foto })
      })
      
      // Agregar al estado local
      if (data.asistencia) {
        asistencias.value.push(data.asistencia)
      }
      
      return data
    } catch (error) {
      console.error('Error marcando asistencia:', error)
      throw error
    }
  }

  const registrarSalida = async (dni: string, motivo: string) => {
    try {
      const data = await apiRequest('/asistencias/salida', {
        method: 'POST',
        body: JSON.stringify({ dni, motivo })
      })
      return data
    } catch (error) {
      console.error('Error registrando salida:', error)
      throw error
    }
  }

  const eliminarEmpleado = async (id: string) => {
    try {
      await apiRequest(`/admin/empleados/${id}`, { method: 'DELETE' })
      // Remover del estado local
      empleados.value = empleados.value.filter(emp => emp.id !== id)
    } catch (error) {
      console.error('Error eliminando empleado:', error)
      throw error
    }
  }

  const actualizarEmpleado = async (id: string, datos: Partial<Empleado>) => {
    try {
      const data = await apiRequest(`/admin/empleados/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
      })
      
      // Actualizar en el estado local
      const index = empleados.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        empleados.value[index] = { ...empleados.value[index], ...data }
      }
      
      return data
    } catch (error) {
      console.error('Error actualizando empleado:', error)
      throw error
    }
  }

  // Acciones para gestión de horarios
  const crearHorario = async (horarioData: any) => {
    try {
      const data = await apiRequest('/admin/horarios', {
        method: 'POST',
        body: JSON.stringify(horarioData)
      })
      
      // Agregar al estado local
      horarios.value.push(data)
      
      return data
    } catch (error) {
      console.error('Error creando horario:', error)
      throw error
    }
  }

  const actualizarHorario = async (id: string, datos: Partial<Horario>) => {
    try {
      const data = await apiRequest(`/admin/horarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
      })
      
      // Actualizar en el estado local
      const index = horarios.value.findIndex(horario => horario.id === id)
      if (index !== -1) {
        horarios.value[index] = { ...horarios.value[index], ...data }
      }
      
      return data
    } catch (error) {
      console.error('Error actualizando horario:', error)
      throw error
    }
  }

  const eliminarHorario = async (id: string) => {
    try {
      await apiRequest(`/admin/horarios/${id}`, { method: 'DELETE' })
      // Remover del estado local
      horarios.value = horarios.value.filter(horario => horario.id !== id)
    } catch (error) {
      console.error('Error eliminando horario:', error)
      throw error
    }
  }

  return {
    // Estado
    empleados,
    asistencias,
    horarios,
    papeletas,

    // Getters
    empleadosActivos,
    asistenciasHoy,

    // Acciones
    cargarEmpleados,
    cargarAsistencias,
    cargarHorarios,
    cargarPapeletas,
    verificarEmpleado,
    consultarDni,
    registrarEmpleado,
    marcarAsistencia,
    registrarSalida,
    eliminarEmpleado,
    actualizarEmpleado,
    crearHorario,
    actualizarHorario,
    eliminarHorario
  }
})