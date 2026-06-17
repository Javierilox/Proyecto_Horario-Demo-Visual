import clienteApi from "./clienteApi"

/**
 * Representa los datos principales del trabajador
 * asociados al horario encontrado.
 */
export interface TrabajadorMiHorario {
  idRegistro: number
  rut: string
  partida?: string | null
  nombre: string
  cargo?: string | null
  lugar?: string | null
}

/**
 * Representa cada día del horario mensual.
 */
export interface DiaHorario {
  fecha: string
  diaSemana?: string
  turno: string
  descripcion: string
}

/**
 * Respuesta completa del endpoint:
 * GET /api/horarios/mi-horario
 */
export interface RespuestaMiHorario {
  mensaje: string
  carga: {
    id: number
    archivoOriginal: string
    hoja: string
    creadoEn: string
  }
  trabajador: TrabajadorMiHorario
  datosPersona: Record<string, unknown>
  horarioMensual: DiaHorario[]
}

/**
 * Consulta el horario del trabajador autenticado.
 *
 * El backend usa el RUT guardado en el token,
 * por eso no necesitamos enviar RUT desde el frontend.
 */
export const obtenerMiHorarioServicio = async () => {
  const { data } = await clienteApi.get<RespuestaMiHorario>(
    "/horarios/mi-horario"
  )

  return data
}