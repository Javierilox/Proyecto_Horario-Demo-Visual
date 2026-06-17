import clienteApi from "./clienteApi"

import type {
  RespuestaSubidaExcel,
  SolicitudImportarHoja,
  RespuestaImportacionExcel,
} from "../types/excel"

export const subirExcelServicio = async (
  archivo: File
): Promise<RespuestaSubidaExcel> => {
  const formData = new FormData()

  formData.append("archivo", archivo)

  const { data } = await clienteApi.post<RespuestaSubidaExcel>(
    "/excel/subir",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return data
}

export const importarHojaExcelServicio = async (
  solicitud: SolicitudImportarHoja
): Promise<RespuestaImportacionExcel> => {
  const { data } = await clienteApi.post<RespuestaImportacionExcel>(
    "/excel/importar",
    solicitud
  )

  return data
}