import clienteApi from "./clienteApi"
import type { RespuestaHorarios } from "../types/horario"

export const obtenerHorariosServicio = async (
  buscar = ""
): Promise<RespuestaHorarios> => {
  const { data } = await clienteApi.get<RespuestaHorarios>("/horarios", {
    params: {
      buscar,
    },
  })

  return data
}

export const descargarPdfHorarioServicio = async (
  id: number
): Promise<Blob> => {
  const { data } = await clienteApi.get(`/horarios/${id}/pdf`, {
    responseType: "blob",
  })

  return data
}

export const descargarExcelHorarioServicio = async (
  id: number
): Promise<Blob> => {
  const { data } = await clienteApi.get(`/horarios/${id}/excel`, {
    responseType: "blob",
  })

  return data
}