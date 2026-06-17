/**
 * Representa un día específico dentro del horario mensual
 * de un trabajador.
 */
export interface DiaHorario {
  fecha: string
  diaSemana: string
  turno: string
  descripcion: string
}

/**
 * Representa el registro completo de horario de un trabajador.
 *
 * Importante:
 * Antes usábamos "patio", pero ahora el sistema trabaja con "lugar".
 */
export interface RegistroHorario {
  id: number
  rut: string
  partida: string | null
  nombre: string
  cargo: string | null
  lugar: string | null

  /**
   * Datos personales importados desde el Excel.
   * Se conservan como objeto para poder reutilizarlos
   * en futuras vistas o exportaciones.
   */
  datosPersona: {
    partida?: string
    rut?: string
    nombre?: string
    cargo?: string
    lugar?: string
  }

  /**
   * Contiene todos los días del mes y el turno asignado
   * en cada fecha.
   */
  horarioMensual: DiaHorario[]
}

/**
 * Información general de la carga Excel desde donde
 * provienen los horarios mostrados.
 */
export interface CargaHorarios {
  id: number
  archivoOriginal: string
  hoja: string
  columnas: unknown
  totalFilas: number
  creadoEn: string
}

/**
 * Estructura de respuesta que entrega el backend
 * cuando consultamos los horarios.
 */
export interface RespuestaHorarios {
  mensaje: string
  carga: CargaHorarios | null
  horarios: RegistroHorario[]
}