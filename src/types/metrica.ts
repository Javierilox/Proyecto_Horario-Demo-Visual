/**
 * Información de la carga Excel que está alimentando
 * las métricas del dashboard.
 */
export interface CargaMetricas {
  id: number
  archivoOriginal: string
  hoja: string
  creadoEn: string
}

/**
 * Filtros disponibles y activos en el dashboard.
 *
 * - fechaSeleccionada: fecha que se está analizando.
 * - lugarSeleccionado: lugar filtrado o "TODOS".
 * - fechasDisponibles: fechas detectadas desde el Excel.
 * - lugaresDisponibles: lugares detectados en la carga importada.
 * - cargosDisponibles: cargos detectados en la carga importada.
 * - turnosDisponibles: turnos detectados en la carga importada.
 */
export interface FiltrosMetricas {
  fechaSeleccionada: string
  lugarSeleccionado: string
  cargoSeleccionado: string
  turnoSeleccionado: string
  fechasDisponibles: string[]
  lugaresDisponibles: string[]
  cargosDisponibles: string[]
  turnosDisponibles: Array<{
    codigo: string
    nombre: string
  }>
}

/**
 * Resumen general del día seleccionado.
 */
export interface ResumenMetricas {
  totalPersonas: number
  trabajando: number
  libre: number
  ausente: number
  sinAsignacion: number
}

/**
 * Datos utilizados en el gráfico de torta.
 * Muestra la distribución general del día.
 */
export interface GraficoEstadoDia {
  categoria: string
  cantidad: number
}

/**
 * Datos utilizados en el gráfico de barras por rango horario.
 */
export interface GraficoTurnos {
  turno: string
  cantidad: number
}

/**
 * Datos agrupados por lugar.
 *
 * Sirve para comparar cómo se distribuyen
 * los turnos entre distintas bases o ubicaciones.
 */
export interface GraficoPorLugar {
  lugar: string
  totalPersonas: number
  trabajando: number
  libre: number
  ausente: number
  sinAsignacion: number
  am: number
  pm: number
  noche: number
}

/**
 * Datos agrupados por cargo.
 *
 * Sirve para ver cuánta gente está disponible,
 * libre o ausente según su función.
 */
export interface GraficoPorCargo {
  cargo: string
  totalPersonas: number
  trabajando: number
  libre: number
  ausente: number
  sinAsignacion: number
}

/**
 * Resumen global del análisis de dotación requerida
 * versus dotación realmente programada.
 */
export interface ResumenDotacion {
  requeridos: number
  programados: number
  deficit: number
  superavit: number
  combinacionesConDeficit: number
}

/**
 * Comparación de dotación por turno.
 *
 * Ejemplo:
 * AM: requeridos 40, programados 35, déficit 5.
 */
export interface GraficoDeficitPorTurno {
  turno: string
  nombreTurno: string
  requeridos: number
  programados: number
  deficit: number
  superavit: number
}

/**
 * Comparación de dotación por lugar.
 *
 * Sirve para detectar qué terminal, patio o zona
 * necesita más trabajadores.
 */
export interface GraficoDeficitPorLugar {
  lugar: string
  requeridos: number
  programados: number
  deficit: number
  superavit: number
}

/**
 * Comparación de dotación por cargo.
 *
 * Sirve para detectar cargos donde falta mayor cobertura.
 */
export interface GraficoDeficitPorCargo {
  cargo: string
  requeridos: number
  programados: number
  deficit: number
  superavit: number
}

/**
 * Detalle exacto de cada combinación:
 * Lugar + Cargo + Turno.
 *
 * Esta tabla nos permite saber exactamente dónde
 * existe déficit o superávit.
 */
export interface DetalleDeficit {
  idRequerimiento: number
  lugar: string
  cargo: string
  turno: string
  nombreTurno: string
  requeridos: number
  programados: number
  deficit: number
  superavit: number
  diferencia: number
  estado: "DEFICIT" | "CUBIERTO" | "SUPERAVIT"
}

/**
 * Respuesta completa que entrega el backend
 * desde /api/metricas/dashboard.
 */
export interface RespuestaMetricasDashboard {
  mensaje: string
  carga: CargaMetricas | null
  filtros: FiltrosMetricas
  resumen: ResumenMetricas
  graficoEstadoDia: GraficoEstadoDia[]
  graficoTurnos: GraficoTurnos[]
  graficoPorLugar: GraficoPorLugar[]
  graficoPorCargo: GraficoPorCargo[]

  resumenDotacion: ResumenDotacion
  graficoDeficitPorTurno: GraficoDeficitPorTurno[]
  graficoDeficitPorLugar: GraficoDeficitPorLugar[]
  graficoDeficitPorCargo: GraficoDeficitPorCargo[]
  detalleDeficit: DetalleDeficit[]
}