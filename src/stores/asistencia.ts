import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Asistencia, Empleado, Papeleta } from '@/types/asistencia'
import { asistenciaAPI } from '@/services/api'

export const useAsistenciaStore = defineStore('asistencia', () => {
  const empleados = ref<Empleado[]>([])
  const asistencias = ref<Asistencia[]>([])
  const papeletas = ref<Papeleta[]>([])

  const marcarAsistencia = async (dni: string, foto: string) => {
    return await asistenciaAPI.marcarAsistencia(dni, foto)
  }

  const registrarSalida = async (dni: string, motivo: string, foto?: string) => {
    return await asistenciaAPI.registrarSalida(dni, motivo, foto)
  }

  const cargarEmpleados = async () => {
    empleados.value = await asistenciaAPI.getEmpleados()
  }

  const cargarAsistencias = async () => {
    asistencias.value = await asistenciaAPI.getAsistencias()
  }

  const cargarPapeletas = async () => {
    papeletas.value = await asistenciaAPI.getPapeletas()
  }

  return {
    empleados,
    asistencias,
    papeletas,
    marcarAsistencia,
    registrarSalida,
    cargarEmpleados,
    cargarAsistencias,
    cargarPapeletas
  }
})