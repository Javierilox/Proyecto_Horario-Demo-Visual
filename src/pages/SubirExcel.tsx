import { useState } from "react"
import axios from "axios"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Database,
  CalendarDays,
  Users,
  ListChecks,
  ClipboardCheck,
  XCircle,
} from "lucide-react"

import clienteApi from "../services/clienteApi"
  /**
   * Resultado de validación de la plantilla oficial.
   */
  interface ValidacionPlantilla {
    esValida: boolean
    errores: string[]
    advertencias: string[]
    hojasDetectadas: Array<{
      esperada: string
      encontrada: string
    }>
    hojasTurnosDetectadas: string[]
  }
  /**
 * Respuesta que entrega el backend cuando subimos el archivo.
 * En esta primera etapa solo recibimos:
 * - Nombre del archivo
 * - Nombre interno guardado
 * - Hojas disponibles
 */
interface RespuestaSubirExcel {
  mensaje: string
  archivoOriginal: string
  archivoGuardado: string
  rutaArchivo: string
  hojas: string[]
  validacionPlantilla: ValidacionPlantilla
}

/**
 * Resumen real de lo que ocurrió al importar la hoja.
 * Estos datos vienen desde controladorExcel.ts.
 */
interface ResumenImportacion {
  trabajadoresImportados: number
  fechasDetectadas: number
  turnosDiariosGenerados: number
  requerimientosDetectados?: number
  requerimientosGuardados?: number
  filasNecesidadDescartadas?: number
}

/**
 * Respuesta que entrega el backend después de importar.
 */
interface RespuestaImportarExcel {
  mensaje: string
  carga: {
    id: number
    archivoOriginal: string
    archivoGuardado: string
    hoja: string
    totalFilas: number
    creadoEn: string
  }
  resumen: ResumenImportacion
  advertenciaNecesidad?: string | null
}

/**
 * Tarjeta pequeña para mostrar un número del resumen.
 */
interface TarjetaResumenProps {
  titulo: string
  valor: number
  icono: React.ReactNode
  descripcion?: string
}

function TarjetaResumen({
  titulo,
  valor,
  icono,
  descripcion,
}: TarjetaResumenProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="text-zinc-400 text-sm">{titulo}</div>

        <div className="bg-blue-600/10 text-blue-400 p-2 rounded-xl">
          {icono}
        </div>
      </div>

      <p className="text-3xl font-bold text-white">{valor}</p>

      {descripcion && (
        <p className="text-xs text-zinc-500 mt-2">{descripcion}</p>
      )}
    </div>
  )
}

export default function SubirExcel() {
  const [archivo, setArchivo] = useState<File | null>(null)

  const [archivoOriginal, setArchivoOriginal] = useState("")
  const [archivoGuardado, setArchivoGuardado] = useState("")

  const [hojas, setHojas] = useState<string[]>([])
  const [hojaSeleccionada, setHojaSeleccionada] = useState("")

  const [subiendo, setSubiendo] = useState(false)
  const [importando, setImportando] = useState(false)

  const [mensajeExito, setMensajeExito] = useState("")
  const [error, setError] = useState("")

  const [resumenImportacion, setResumenImportacion] =
    useState<ResumenImportacion | null>(null)

  const [advertenciaNecesidad, setAdvertenciaNecesidad] = useState<
    string | null
  >(null)

  const [validacionPlantilla, setValidacionPlantilla] =
    useState<ValidacionPlantilla | null>(null)
  /**
   * Cuando el usuario elige un archivo, limpiamos los resultados anteriores.
   * Así evitamos que se mezclen datos de una importación anterior.
   */
  const seleccionarArchivo = (
    evento: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivoSeleccionado = evento.target.files?.[0] || null

    setArchivo(archivoSeleccionado)
    setArchivoOriginal("")
    setArchivoGuardado("")
    setHojas([])
    setHojaSeleccionada("")
    setMensajeExito("")
    setError("")
    setResumenImportacion(null)
    setAdvertenciaNecesidad(null)
    setValidacionPlantilla(null)
  }

  /**
   * Sube el archivo Excel al backend.
   * Todavía no importa datos, solo detecta las hojas disponibles.
   */
  const subirArchivo = async () => {
    if (!archivo) {
      setError("Debes seleccionar un archivo Excel antes de subirlo.")
      return
    }

    try {
      setSubiendo(true)
      setError("")
      setMensajeExito("")
      setResumenImportacion(null)
      setAdvertenciaNecesidad(null)

      const formulario = new FormData()

      /**
       * El backend espera que el archivo venga en el campo "archivo".
       */
      formulario.append("archivo", archivo)

      const { data } = await clienteApi.post<RespuestaSubirExcel>(
        "/excel/subir",
        formulario
      )

      setArchivoOriginal(data.archivoOriginal)
      setArchivoGuardado(data.archivoGuardado)
      setHojas(data.hojas)
      setValidacionPlantilla(data.validacionPlantilla)
    
      /**
     * Seleccionamos automáticamente la primera hoja de turnos válida.
     * Esto evita elegir por error NECESIDAD, CARGO, LUGAR o Resumen_Horario.
     */
      const primeraHojaTurnos =
        data.validacionPlantilla.hojasTurnosDetectadas[0]

      setHojaSeleccionada(primeraHojaTurnos || "")

      setMensajeExito(
        "Archivo subido correctamente. Ahora selecciona la hoja de turnos e importa los datos."
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
            "No se pudo subir el archivo Excel."
        )
      } else {
        setError("Ocurrió un error inesperado al subir el archivo.")
      }
    } finally {
      setSubiendo(false)
    }
  }

  /**
   * Importa la hoja seleccionada.
   *
   * Importante:
   * Aunque seleccionemos solo la hoja de turnos,
   * el backend también leerá automáticamente la hoja NECESIDAD.
   */
  const importarHoja = async () => {
    if (!archivoGuardado || !archivoOriginal || !hojaSeleccionada) {
      setError("Debes subir un archivo y seleccionar una hoja antes de importar.")
      return
    }

    try {
      setImportando(true)
      setError("")
      setMensajeExito("")
      setResumenImportacion(null)
      setAdvertenciaNecesidad(null)

      const { data } = await clienteApi.post<RespuestaImportarExcel>(
        "/excel/importar",
        {
          archivoGuardado,
          archivoOriginal,
          hoja: hojaSeleccionada,
        }
      )

      setResumenImportacion(data.resumen)
      setAdvertenciaNecesidad(data.advertenciaNecesidad || null)

      setMensajeExito(
        `Importación completada correctamente. Carga creada con ID ${data.carga.id}.`
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
            "No se pudo importar la hoja seleccionada."
        )
      } else {
        setError("Ocurrió un error inesperado al importar la hoja.")
      }
    } finally {
      setImportando(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Subir Excel
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
          Sube la plantilla oficial de ShiftFlow, selecciona la hoja de turnos
          e importa los horarios junto con la hoja NECESIDAD.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Panel de subida */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
              <Upload size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                1. Seleccionar archivo
              </h2>

              <p className="text-sm text-zinc-400">
                Usa la plantilla oficial de ShiftFlow.
              </p>
            </div>
          </div>

          <label className="block border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-2xl p-6 cursor-pointer transition-all">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={seleccionarArchivo}
              className="hidden"
            />

            <div className="flex flex-col items-center text-center">
              <FileSpreadsheet size={42} className="text-zinc-500 mb-4" />

              <p className="text-white font-semibold mb-1">
                {archivo ? archivo.name : "Haz clic para seleccionar un Excel"}
              </p>

              <p className="text-sm text-zinc-500">
                Formatos permitidos: .xlsx o .xls
              </p>
            </div>
          </label>

          <button
            type="button"
            onClick={subirArchivo}
            disabled={!archivo || subiendo}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            {subiendo ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Subiendo archivo...
              </>
            ) : (
              <>
                <Upload size={18} />
                Subir archivo
              </>
            )}
          </button>
        </section>

        {/* Panel de selección de hoja */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-600/10 text-emerald-400 p-3 rounded-xl">
              <Database size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                2. Importar hoja
              </h2>

              <p className="text-sm text-zinc-400">
                Selecciona la hoja de turnos. NECESIDAD se leerá automáticamente.
              </p>
            </div>
          </div>

          {archivoGuardado ? (
            <>
              <div className="mb-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">
                  Archivo cargado
                </p>

                <p className="text-white font-semibold break-words">
                  {archivoOriginal}
                </p>
              </div>

              <label className="block text-sm text-zinc-400 mb-2">
                Hoja de horarios
              </label>

              <select
                value={hojaSeleccionada}
                onChange={(evento) =>
                  setHojaSeleccionada(evento.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
              >
                {hojas.map((hoja) => (
                  <option key={hoja} value={hoja}>
                    {hoja}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={importarHoja}
                disabled={
                  !hojaSeleccionada ||
                  importando ||
                  validacionPlantilla?.esValida === false
                }
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {importando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Importando datos...
                  </>
                ) : (
                  <>
                    <ClipboardCheck size={18} />
                    Importar hoja seleccionada
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-zinc-500 text-center">
              Primero sube un archivo Excel para ver sus hojas disponibles.
            </div>
          )}
        </section>
      </div>

      {/* Mensajes */}
      <div className="mt-6 space-y-4">
        {mensajeExito && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl flex items-start gap-3">
            <XCircle size={22} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {advertenciaNecesidad && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle size={22} className="mt-0.5 shrink-0" />
            <span>{advertenciaNecesidad}</span>
          </div>
        )}
      </div>
{validacionPlantilla && (
  <section className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`p-3 rounded-xl ${
          validacionPlantilla.esValida
            ? "bg-emerald-600/10 text-emerald-400"
            : "bg-red-600/10 text-red-400"
        }`}
      >
        {validacionPlantilla.esValida ? (
          <CheckCircle2 size={24} />
        ) : (
          <XCircle size={24} />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">
          Validación de plantilla
        </h2>

        <p className="text-sm text-zinc-400">
          Revisión de hojas y columnas mínimas requeridas por ShiftFlow.
        </p>
      </div>
    </div>

    {validacionPlantilla.esValida ? (
      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-2xl mb-5">
        El archivo corresponde a la plantilla oficial de ShiftFlow.
      </div>
    ) : (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl mb-5">
        El archivo no cumple con la estructura mínima requerida.
      </div>
    )}

    {validacionPlantilla.errores.length > 0 && (
      <div className="mb-5">
        <h3 className="font-semibold text-red-400 mb-2">
          Errores encontrados
        </h3>

        <ul className="space-y-2 text-sm text-red-300">
          {validacionPlantilla.errores.map((error) => (
            <li key={error} className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </li>
          ))}
        </ul>
      </div>
    )}
      {validacionPlantilla.advertencias.length > 0 && (
        <div className="mb-5">
          <h3 className="font-semibold text-amber-400 mb-2">
            Advertencias
          </h3>

          <ul className="space-y-2 text-sm text-amber-300">
            {validacionPlantilla.advertencias.map((advertencia) => (
              <li key={advertencia} className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                {advertencia}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <h3 className="font-semibold mb-3">
            Hojas obligatorias detectadas
          </h3>

          {validacionPlantilla.hojasDetectadas.length > 0 ? (
            <ul className="space-y-2 text-sm text-zinc-300">
              {validacionPlantilla.hojasDetectadas.map((hoja) => (
                <li key={hoja.esperada}>
                  {hoja.esperada}:{" "}
                  <span className="text-emerald-400">
                    {hoja.encontrada}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">
              No se detectaron hojas obligatorias.
            </p>
          )}
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <h3 className="font-semibold mb-3">
            Hojas de turnos detectadas
          </h3>

          {validacionPlantilla.hojasTurnosDetectadas.length > 0 ? (
            <ul className="space-y-2 text-sm text-zinc-300">
              {validacionPlantilla.hojasTurnosDetectadas.map((hoja) => (
                <li key={hoja} className="text-emerald-400">
                  {hoja}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">
              No se detectó ninguna hoja que comience con Turnos_.
            </p>
          )}
        </div>
      </div>
    </section>
  )}
        {/* Resumen de importación */}
      {resumenImportacion && (
        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
              <ListChecks size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Resumen de importación
              </h2>

              <p className="text-sm text-zinc-400">
                Validación rápida de lo que se guardó en la base de datos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <TarjetaResumen
              titulo="Trabajadores importados"
              valor={resumenImportacion.trabajadoresImportados}
              icono={<Users size={20} />}
              descripcion="Filas válidas detectadas en la hoja de turnos."
            />

            <TarjetaResumen
              titulo="Fechas detectadas"
              valor={resumenImportacion.fechasDetectadas}
              icono={<CalendarDays size={20} />}
              descripcion="Columnas de calendario mensual detectadas."
            />

            <TarjetaResumen
              titulo="Turnos diarios generados"
              valor={resumenImportacion.turnosDiariosGenerados}
              icono={<Database size={20} />}
              descripcion="Registros usados para métricas y gráficos."
            />

            <TarjetaResumen
              titulo="Requerimientos detectados"
              valor={resumenImportacion.requerimientosDetectados ?? 0}
              icono={<ClipboardCheck size={20} />}
              descripcion="Filas válidas leídas desde NECESIDAD."
            />

            <TarjetaResumen
              titulo="Requerimientos guardados"
              valor={resumenImportacion.requerimientosGuardados ?? 0}
              icono={<CheckCircle2 size={20} />}
              descripcion="Filas guardadas en requerimientos_dotacion."
            />

            <TarjetaResumen
              titulo="Filas NECESIDAD descartadas"
              valor={resumenImportacion.filasNecesidadDescartadas ?? 0}
              icono={<AlertTriangle size={20} />}
              descripcion="Filas incompletas o inválidas."
            />
          </div>

          {(resumenImportacion.requerimientosGuardados ?? 0) === 0 && (
            <div className="mt-5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-5 py-4 rounded-2xl">
              No se guardaron requerimientos de dotación. Revisa que la hoja
              NECESIDAD tenga las columnas LUGAR, TURNO, CARGO y CANTIDAD
              REQUERIDA.
            </div>
          )}
        </section>
      )}
    </div>
  )
}