export interface Empleado {
  id: string
  dni: string
  nombre: string
  apellido: string
  departamento: string
  puesto: string
  tipoHorario: string 
  fechaIngreso: Date
}

export interface Asistencia {
  id: string
  empleadoId: string
  fecha: Date
  horaEntrada: string
  horaSalida?: string
  fotoEntrada: string
  fotoSalida?: string
  tardanza: boolean
  faltante: boolean
  estado: 'presente' | 'tardanza' | 'falta'
  empleado?: {
    nombre: string
    apellido: string
  }
}

export interface Papeleta {
  id: string
  empleadoId: string
  fecha: Date
  tipo: 'comision' | 'permiso' | 'vacaciones'
  motivo: string
  aprobado: boolean
  horas?: number
  empleado?: {
    nombre: string
    apellido: string
  }
}