export interface RespuestaSubidaExcel {
  mensaje: string
  archivoOriginal: string
  archivoGuardado: string
  rutaArchivo: string
  hojas: string[]
}

export interface SolicitudImportarHoja {
  archivoGuardado: string
  archivoOriginal: string
  hoja: string
}

export interface RespuestaImportacionExcel {
  mensaje: string
  carga: {
    id: number
    archivoOriginal: string
    archivoGuardado: string
    hoja: string
    columnas: string[]
    totalFilas: number
    creadoEn: string
  }
}