import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  MapPin,
  CreditCard,
  MoveHorizontal,
  Hash,
  Download,
  FileSpreadsheet,
} from "lucide-react"

import clienteApi from "../services/clienteApi"
import {
  descargarPdfHorarioServicio,
  descargarExcelHorarioServicio,
} from "../services/horariosServicio"
import type { RegistroHorario } from "../types/horario"

/**
 * Estructura esperada al consultar un horario individual.
 */
interface RespuestaDetalleHorario {
  mensaje: string
  horario: RegistroHorario & {
    carga?: {
      id: number
      archivoOriginal: string
      hoja: string
      creadoEn: string
    }
  }
}

/**
 * Define el color visual de cada turno.
 */
const obtenerClaseTurno = (turno: string) => {
  const codigo = turno.trim().toUpperCase()

  if (codigo === "L") {
    return "bg-green-500/80 text-black font-bold"
  }

  if (codigo === "LM") {
    return "bg-red-600 text-white font-bold"
  }

  if (codigo === "VAC") {
    return "bg-yellow-400 text-black font-bold"
  }

  if (codigo === "N") {
    return "bg-blue-900 text-white font-bold"
  }

  if (codigo === "M") {
    return "bg-zinc-800 text-white"
  }

  if (codigo === "T") {
    return "bg-zinc-700 text-white"
  }

  return "bg-zinc-900 text-zinc-400"
}

/**
 * Traduce los códigos del horario a texto legible.
 */
const obtenerTextoTurno = (turno: string) => {
  const codigo = turno.trim().toUpperCase()

  const turnos: Record<string, string> = {
    M: "AM",
    T: "PM",
    N: "Noche",
    L: "Libre",
    LM: "Licencia médica",
    VAC: "Vacaciones",
  }

  return turnos[codigo] || "Sin definir"
}

/**
 * Limpia caracteres raros para crear nombres de archivo seguros
 * al descargar PDF o Excel.
 */
const limpiarNombreArchivo = (valor: string) => {
  return valor.replace(/\s+/g, "_").replace(/[^\w.-]/g, "")
}

export default function DetalleHorario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [horario, setHorario] =
    useState<RespuestaDetalleHorario["horario"] | null>(null)

  const [cargando, setCargando] = useState(true)
  const [descargandoPdf, setDescargandoPdf] = useState(false)
  const [descargandoExcel, setDescargandoExcel] = useState(false)
  const [error, setError] = useState("")

  /**
   * Carga el detalle del horario apenas se abre la vista.
   */
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setCargando(true)
        setError("")

        const { data } = await clienteApi.get<RespuestaDetalleHorario>(
          `/horarios/${id}`
        )

        setHorario(data.horario)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.mensaje ||
              "No se pudo obtener el horario del trabajador."
          )
        } else {
          setError("Ocurrió un error inesperado.")
        }
      } finally {
        setCargando(false)
      }
    }

    cargarDetalle()
  }, [id])

  /**
   * Dejamos el horario mensual listo para renderizarlo
   * en la tabla visual.
   */
  const horarioMensual = useMemo(() => {
    return horario?.horarioMensual || []
  }, [horario])

  /**
   * Descarga el PDF generado por el backend.
   */
  const descargarPdf = async () => {
    if (!horario) {
      return
    }

    try {
      setDescargandoPdf(true)
      setError("")

      const archivoPdf = await descargarPdfHorarioServicio(horario.id)

      const urlTemporal = window.URL.createObjectURL(archivoPdf)

      const enlace = document.createElement("a")
      enlace.href = urlTemporal
      enlace.download =
        limpiarNombreArchivo(
          `horario_${horario.rut}_${horario.nombre}`
        ) + ".pdf"

      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()

      window.URL.revokeObjectURL(urlTemporal)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
            "No se pudo descargar el PDF del horario."
        )
      } else {
        setError("Ocurrió un error inesperado al descargar el PDF.")
      }
    } finally {
      setDescargandoPdf(false)
    }
  }

  /**
   * Descarga el Excel generado por el backend.
   */
  const descargarExcel = async () => {
    if (!horario) {
      return
    }

    try {
      setDescargandoExcel(true)
      setError("")

      const archivoExcel = await descargarExcelHorarioServicio(horario.id)

      const urlTemporal = window.URL.createObjectURL(archivoExcel)

      const enlace = document.createElement("a")
      enlace.href = urlTemporal
      enlace.download =
        limpiarNombreArchivo(
          `horario_${horario.rut}_${horario.nombre}`
        ) + ".xlsx"

      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()

      window.URL.revokeObjectURL(urlTemporal)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.mensaje ||
            "No se pudo descargar el Excel del horario."
        )
      } else {
        setError("Ocurrió un error inesperado al descargar el Excel.")
      }
    } finally {
      setDescargandoExcel(false)
    }
  }

  if (cargando) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 text-center text-zinc-400">
        Cargando horario del trabajador...
      </div>
    )
  }

  if (error || !horario) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate("/horarios")}
          className="mb-6 w-full sm:w-fit flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-300 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
          Volver a horarios
        </button>

        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl">
          {error || "No se encontró información del horario."}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/horarios")}
          className="w-full sm:w-fit flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-3 rounded-xl text-zinc-300 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
          Volver a horarios
        </button>

        <button
          type="button"
          onClick={descargarPdf}
          disabled={descargandoPdf}
          className="w-full sm:w-fit flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed px-4 py-3 rounded-xl text-white font-semibold transition-all"
        >
          <Download size={18} />
          {descargandoPdf ? "Descargando PDF..." : "Descargar PDF"}
        </button>

        <button
          type="button"
          onClick={descargarExcel}
          disabled={descargandoExcel}
          className="w-full sm:w-fit flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed px-4 py-3 rounded-xl text-white font-semibold transition-all"
        >
          <FileSpreadsheet size={18} />
          {descargandoExcel ? "Descargando Excel..." : "Descargar Excel"}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 break-words">
          Horario de {horario.nombre}
        </h1>

        <p className="text-sm sm:text-base text-zinc-400">
          Consulta individual del horario mensual del trabajador.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 sm:gap-5 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Hash size={20} />
            <span className="text-sm">ID</span>
          </div>

          <p className="text-white font-semibold">{horario.id}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CreditCard size={20} />
            <span className="text-sm">RUT</span>
          </div>

          <p className="text-white font-semibold break-words">
            {horario.rut}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 sm:col-span-2 xl:col-span-2">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <UserRound size={20} />
            <span className="text-sm">Nombre</span>
          </div>

          <p className="text-white font-semibold break-words">
            {horario.nombre}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <BriefcaseBusiness size={20} />
            <span className="text-sm">Cargo</span>
          </div>

          <p className="text-white font-semibold break-words">
            {horario.cargo || "-"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <MapPin size={20} />
            <span className="text-sm">Lugar</span>
          </div>

          <p className="text-white font-semibold break-words">
            {/* Mostramos el lugar importado desde el Excel */}
            {horario.lugar || "-"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 sm:col-span-2 xl:col-span-2">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CalendarDays size={20} />
            <span className="text-sm">Partida</span>
          </div>

          <p className="text-white font-semibold break-words">
            {horario.partida || "-"}
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-zinc-800">
          <h2 className="text-xl sm:text-2xl font-bold">
            Horario mensual
          </h2>
        </div>

        {horarioMensual.length > 0 && (
          <div className="lg:hidden px-4 pt-4 flex items-center gap-2 text-sm text-zinc-400">
            <MoveHorizontal size={18} />
            Desliza horizontalmente para ver todos los días.
          </div>
        )}

        <div className="overflow-auto">
          <table className="w-full min-w-max border-collapse text-sm">
            <thead>
              <tr>
                {horarioMensual.map((dia) => (
                  <th
                    key={`fecha-${dia.fecha}`}
                    className="bg-zinc-800 text-white border border-zinc-700 px-4 py-3 min-w-24 text-center"
                  >
                    {dia.fecha}
                  </th>
                ))}
              </tr>

              <tr>
                {horarioMensual.map((dia) => (
                  <th
                    key={`semana-${dia.fecha}`}
                    className="bg-zinc-700 text-zinc-200 border border-zinc-600 px-4 py-3 text-center"
                  >
                    {dia.diaSemana}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {horarioMensual.map((dia) => (
                  <td
                    key={`turno-${dia.fecha}`}
                    title={obtenerTextoTurno(dia.turno)}
                    className={`border border-zinc-800 px-4 py-5 text-center text-base min-w-24 ${obtenerClaseTurno(
                      dia.turno
                    )}`}
                  >
                    {dia.turno || "-"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="font-bold">M</span> = AM
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="font-bold">T</span> = PM
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="font-bold">N</span> = Noche
        </div>

        <div className="bg-green-500/80 text-black rounded-xl px-4 py-3">
          <span className="font-bold">L</span> = Libre
        </div>

        <div className="bg-red-600 text-white rounded-xl px-4 py-3">
          <span className="font-bold">LM</span> = Licencia médica
        </div>

        <div className="bg-yellow-400 text-black rounded-xl px-4 py-3">
          <span className="font-bold">VAC</span> = Vacaciones
        </div>
      </div>
    </div>
  )
}