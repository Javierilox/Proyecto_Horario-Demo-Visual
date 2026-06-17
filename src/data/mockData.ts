export const mockUsuarioAdmin = {
  id: 1,
  correo: "admin@demo.com",
  rol: "ADMIN",
  rut: "11.111.111-1"
}

export const mockUsuarioTrabajador = {
  id: 2,
  correo: "trabajador@demo.com",
  rol: "TRABAJADOR",
  rut: "22.222.222-2"
}

export const mockTrabajadores = [
  { id: 1, rut: "12.345.678-9", nombre: "Juan Pérez", correo: "jperez@demo.com", cargo: "Conductor", lugar: "Condell", estado: "Activo" },
  { id: 2, rut: "98.765.432-1", nombre: "María González", correo: "mgonzalez@demo.com", cargo: "Administrativo", lugar: "Oficina Central", estado: "Activo" },
  { id: 3, rut: "15.555.555-5", nombre: "Carlos Soto", correo: "csoto@demo.com", cargo: "Mecánico", lugar: "Santiago Centro", estado: "Licencia" },
  { id: 4, rut: "19.999.999-9", nombre: "Ana Silva", correo: "asilva@demo.com", cargo: "Conductor", lugar: "Santiago Centro", estado: "Activo" },
]

export const mockSolicitudes = [
  {
    id: 101,
    tipo: "VACACIONES",
    estado: "APROBADA",
    fechaInicio: "2026-07-10T00:00:00",
    fechaTermino: "2026-07-25T00:00:00",
    motivo: "Vacaciones de invierno anuales.",
    respuestaAdmin: "Aprobado, disfruta tus días.",
    creadoEn: "2026-06-15T10:30:00"
  },
  {
    id: 102,
    tipo: "LICENCIA_MEDICA",
    estado: "PENDIENTE",
    fechaInicio: "2026-06-20T00:00:00",
    fechaTermino: "2026-06-25T00:00:00",
    motivo: "Folio 88776655 - Reposo por gripe severa.",
    respuestaAdmin: null,
    creadoEn: "2026-06-19T08:15:00"
  },
  {
    id: 103,
    tipo: "AYUDA",
    estado: "RECHAZADA",
    fechaInicio: null,
    fechaTermino: null,
    motivo: "Necesito cambiar mi turno del viernes por favor.",
    respuestaAdmin: "No es posible, la cuota de cambios de esta semana está al límite.",
    creadoEn: "2026-06-10T14:20:00"
  }
]

export const mockMetricasDashboard = {
  filtros: {
    fechasDisponibles: ["17-jun", "18-jun", "19-jun", "20-jun"],
    lugaresDisponibles: ["Condell", "Santiago Centro", "Oficina Central"],
    cargosDisponibles: ["Conductor", "Administrativo", "Mecánico", "Jefe de Area Operaciones"],
    turnosDisponibles: [
      { codigo: "M", nombre: "AM" },
      { codigo: "T", nombre: "PM" },
      { codigo: "N", nombre: "Noche" }
    ],
    fechaSeleccionada: "17-jun",
    lugarSeleccionado: "TODOS",
    cargoSeleccionado: "TODOS",
    turnoSeleccionado: "TODOS"
  },
  carga: {
    archivoOriginal: "Matriz_Turnos_Junio_2026.xlsx",
    hoja: "Turnos_Junio",
    creadoEn: "2026-06-16T18:30:00"
  },
  resumen: { totalPersonas: 245, trabajando: 198, libre: 35, ausente: 12, sinAsignacion: 0 },
  resumenDotacion: { requeridos: 205, programados: 198, deficit: 7, superavit: 0, combinacionesConDeficit: 3 },
  graficoEstadoDia: [
    { categoria: "Trabajando", cantidad: 198 },
    { categoria: "Libre", cantidad: 35 },
    { categoria: "Ausente", cantidad: 12 }
  ],
  graficoTurnos: [
    { turno: "AM", cantidad: 85 },
    { turno: "PM", cantidad: 80 },
    { turno: "Noche", cantidad: 33 }
  ],
  graficoPorLugar: [
    { lugar: "Condell", am: 45, pm: 40, noche: 20 },
    { lugar: "Santiago Centro", am: 30, pm: 30, noche: 10 },
    { lugar: "Oficina Central", am: 10, pm: 10, noche: 3 }
  ],
  graficoPorCargo: [
    { cargo: "Conductor", trabajando: 160, libre: 25, ausente: 10 },
    { cargo: "Mecánico", trabajando: 20, libre: 5, ausente: 2 },
    { cargo: "Administrativo", trabajando: 12, libre: 3, ausente: 0 },
    { cargo: "Jefe de Area Operaciones", trabajando: 6, libre: 2, ausente: 0 }
  ],
  graficoDeficitPorTurno: [
    { nombreTurno: "AM", requeridos: 88, programados: 85, deficit: 3 },
    { nombreTurno: "PM", requeridos: 84, programados: 80, deficit: 4 },
    { nombreTurno: "Noche", requeridos: 33, programados: 33, deficit: 0 }
  ],
  graficoDeficitPorLugar: [
    { lugar: "Condell", requeridos: 110, programados: 105, deficit: 5 },
    { lugar: "Santiago Centro", requeridos: 72, programados: 70, deficit: 2 },
    { lugar: "Oficina Central", requeridos: 23, programados: 23, deficit: 0 }
  ],
  graficoDeficitPorCargo: [
    { cargo: "Conductor", requeridos: 167, programados: 160, deficit: 7 },
    { cargo: "Mecánico", requeridos: 20, programados: 20, deficit: 0 },
    { cargo: "Administrativo", requeridos: 12, programados: 12, deficit: 0 },
    { cargo: "Jefe de Area Operaciones", requeridos: 6, programados: 6, deficit: 0 }
  ],
  detalleDeficit: [
    { idRequerimiento: 1, lugar: "Condell", cargo: "Conductor", nombreTurno: "AM", requeridos: 48, programados: 45, deficit: 3, superavit: 0, estado: "DEFICIT" },
    { idRequerimiento: 2, lugar: "Santiago Centro", cargo: "Conductor", nombreTurno: "PM", requeridos: 42, programados: 40, deficit: 2, superavit: 0, estado: "DEFICIT" },
    { idRequerimiento: 3, lugar: "Santiago Centro", cargo: "Conductor", nombreTurno: "PM", requeridos: 32, programados: 30, deficit: 2, superavit: 0, estado: "DEFICIT" },
    { idRequerimiento: 4, lugar: "Oficina Central", cargo: "Administrativo", nombreTurno: "AM", requeridos: 10, programados: 10, deficit: 0, superavit: 0, estado: "CUBIERTO" }
  ]
};

export const mockMiHorario = {
  trabajador: {
    nombre: "Trabajador Demo",
    rut: "22.222.222-2",
    cargo: "Operador",
    lugar: "Lugar de trabajado",
    partida: "Planta 1"
  },
  carga: {
    archivoOriginal: "ejemplo_de_excel.xlsx",
    hoja: "Turnos_Junio",
    creadoEn: "2026-06-16T18:30:00"
  },
  horarioMensual: [
    { fecha: "01-jun", diaSemana: "Lun", turno: "M", descripcion: "Turno AM regular" },
    { fecha: "02-jun", diaSemana: "Mar", turno: "M", descripcion: "Turno AM regular" },
    { fecha: "03-jun", diaSemana: "Mié", turno: "M", descripcion: "Turno AM regular" },
    { fecha: "04-jun", diaSemana: "Jue", turno: "M", descripcion: "Turno AM regular" },
    { fecha: "05-jun", diaSemana: "Vie", turno: "L", descripcion: "Día Libre" },
    { fecha: "06-jun", diaSemana: "Sáb", turno: "L", descripcion: "Día Libre" },
    { fecha: "07-jun", diaSemana: "Dom", turno: "T", descripcion: "Turno PM regular" },
    { fecha: "08-jun", diaSemana: "Lun", turno: "T", descripcion: "Turno PM regular" },
    { fecha: "09-jun", diaSemana: "Mar", turno: "T", descripcion: "Turno PM regular" },
    { fecha: "10-jun", diaSemana: "Mié", turno: "T", descripcion: "Turno PM regular" },
    { fecha: "11-jun", diaSemana: "Jue", turno: "N", descripcion: "Turno Noche" },
    { fecha: "12-jun", diaSemana: "Vie", turno: "L", descripcion: "Día Libre" },
    { fecha: "13-jun", diaSemana: "Sáb", turno: "L", descripcion: "Día Libre" },
    { fecha: "14-jun", diaSemana: "Dom", turno: "VAC", descripcion: "Vacaciones Legales" },
    { fecha: "15-jun", diaSemana: "Lun", turno: "VAC", descripcion: "Vacaciones Legales" }
  ]
};