import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }).then(res => res.data),
  
  verifyToken: () => 
    api.post('/auth/verify').then(res => res.data),
}

export const asistenciaAPI = {
  marcarAsistencia: (dni: string, foto: string) =>
    api.post('/asistencia/entrada', { dni, foto }).then(res => res.data),
  
  registrarSalida: (dni: string, motivo: string, foto?: string) =>
    api.post('/asistencia/salida', { dni, motivo, foto }).then(res => res.data),
  
  getEmpleados: () => api.get('/admin/empleados').then(res => res.data),
  getAsistencias: () => api.get('/admin/asistencias').then(res => res.data),
  getPapeletas: () => api.get('/admin/papeletas').then(res => res.data),
  getEmpleadoDetalle: (id: string) => 
    api.get(`/admin/empleados/${id}`).then(res => res.data),
}

export default api