import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  RefreshCw,
  CalendarDays,
  User,
  FileSpreadsheet,
  Eye,
  MoveHorizontal,
} from "lucide-react"

import type { RegistroHorario } from "../types/horario"

// === DATOS FALSOS INYECTADOS PARA EL PORTAFOLIO ===
const fechasGenerales = [
  { fecha: "01-jun", diaSemana: "Lun" }, { fecha: "02-jun", diaSemana: "Mar" },
  { fecha: "03-jun", diaSemana: "Mié" }, { fecha: "04-jun", diaSemana: "Jue" },
  { fecha: "05-jun", diaSemana: "Vie" }, { fecha: "06-jun", diaSemana: "Sáb" },
  { fecha: "07-jun", diaSemana: "Dom" }, { fecha: "08-jun", diaSemana: "Lun" },
  { fecha: "09-jun", diaSemana: "Mar" }, { fecha: "10-jun", diaSemana: "Mié" },
  { fecha: "11-jun", diaSemana: "Jue" }, { fecha: "12-jun", diaSemana: "Vie" },
  { fecha: "13-jun", diaSemana: "Sáb" }, { fecha: "14-jun", diaSemana: "Dom" },
  { fecha: "15-jun", diaSemana: "Lun" },
];

const mockHorariosData = {
  carga: {
    archivoOriginal: "Matriz_Turnos_Junio_2026.xlsx",
    hoja: "Sábana_Operativa_Junio",
    totalFilas: 245
  },
  horarios: [
    {
      id: 1, rut: "12.345.678-9", nombre: "Juan Pérez", cargo: "Conductor", lugar: "Condell",
      horarioMensual: fechasGenerales.map((f, i) => ({ ...f, turno: ["M", "M", "M", "M", "L", "L", "T", "T", "T", "T", "N", "L", "L", "VAC", "VAC"][i] }))
    },
    {
      id: 2, rut: "98.765.432-1", nombre: "María González", cargo: "Administrativo", lugar: "Oficina Central",
      horarioMensual: fechasGenerales.map((f, i) => ({ ...f, turno: ["M", "M", "M", "M", "M", "L", "L", "M", "M", "M", "M", "M", "L", "L", "M"][i] }))
    },
    {
      id: 3, rut: "15.555.555-5", nombre: "Carlos Soto", cargo: "Mecánico", lugar: "Maipu",
      horarioMensual: fechasGenerales.map((f, i) => ({ ...f, turno: ["T", "T", "T", "T", "T", "L", "L", "T", "T", "T", "LM", "LM", "LM", "LM", "LM"][i] }))
    },
    {
      id: 4, rut: "19.999.999-9", nombre: "Ana Silva", cargo: "Conductor", lugar: "Condell",
      horarioMensual: fechasGenerales.map((f, i) => ({ ...f, turno: ["N", "N", "N", "N", "L", "L", "M", "M", "M", "M", "L", "L", "T", "T", "T"][i] }))
    },
    {
      id: 5, rut: "22.222.222-2", nombre: "Javier Orellana", cargo: "Operador de Flota", lugar: " Condell",
      horarioMensual: fechasGenerales.map((f, i) => ({ ...f, turno: ["M", "M", "M", "M", "L", "L", "T", "T", "T", "T", "N", "L", "L", "VAC", "VAC"][i] }))
    }
  ] as RegistroHorario[]
};
// =================================================

/**
 * Devuelve las clases visuales que usaremos para
 * colorear cada tipo de turno dentro de la tabla.
 */
const obtenerClaseTurno = (turno: string) => {
  const codigo = turno.trim().toUpperCase()

  if (codigo === "L") return "bg-green-500/80 text-black font-bold"
  if (codigo === "LM") return "bg-red-600 text-white font-bold"
  if (codigo === "VAC") return "bg-yellow-400 text-black font-bold"
  if (codigo === "N") return "bg-blue-900 text-white font-bold"
  if (codigo === "M") return "bg-zinc-800 text-white"
  if (codigo === "T") return "bg-zinc-700 text-white"

  return "bg-zinc-900 text-zinc-400"
}

/**
 * Traduce el código del turno a un texto legible.
 * Se usa como tooltip al dejar el cursor encima de una celda.
 */
const obtenerTextoTurno = (turno: string) => {
  const codigo = turno.trim().toUpperCase()
  const turnos: Record<string, string> = {
    M: "AM", T: "PM", N: "Noche", L: "Libre", LM: "Licencia médica", VAC: "Vacaciones",
  }
  return turnos[codigo] || "Sin definir"
}

export default function Horarios() {
  const navigate = useNavigate()

  const [horarios, setHorarios] = useState<RegistroHorario[]>([])
  const [buscar, setBuscar] = useState("")
  const [busquedaAplicada, setBusquedaAplicada] = useState("")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [archivo, setArchivo] = useState("")
  const [hoja, setHoja] = useState("")
  const [totalFilas, setTotalFilas] = useState(0)

  const fechas = useMemo(() => {
    const primerHorario = horarios[0]
    if (!primerHorario) return []
    return primerHorario.horarioMensual
  }, [horarios])

  /**
   * Consulta simulada de horarios.
   */
  const cargarHorarios = (textoBusqueda = "") => {
    setCargando(true)
    setError("")

    setTimeout(() => {
      let filtrados = mockHorariosData.horarios;

      if (textoBusqueda.trim() !== "") {
        const query = textoBusqueda.toLowerCase()
        filtrados = filtrados.filter((h) => 
          h.id.toString() === query || 
          h.rut.toLowerCase().includes(query) || 
          h.nombre.toLowerCase().includes(query)
        )
      }

      setHorarios(filtrados)
      setArchivo(mockHorariosData.carga.archivoOriginal)
      setHoja(mockHorariosData.carga.hoja)
      setTotalFilas(mockHorariosData.carga.totalFilas)
      setCargando(false)
    }, 600) // 0.6s de delay para animar el loading
  }

  useEffect(() => {
    cargarHorarios()
  }, [])

  const buscarTrabajador = () => {
    setBusquedaAplicada(buscar)
    cargarHorarios(buscar)
  }

  const limpiarBusqueda = () => {
    setBuscar("")
    setBusquedaAplicada("")
    cargarHorarios()
  }

  return (
    <div>
      <div className="flex flex-col gap-5 mb-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Horarios</h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
            Consulta horarios mensuales por ID, RUT o nombre del trabajador. (Modo Demo Activo)
          </p>
        </div>

        <button
          type="button"
          onClick={() => cargarHorarios(busquedaAplicada)}
          className="w-full sm:w-fit bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-6 transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <FileSpreadsheet size={20} />
            <span className="text-sm">Archivo</span>
          </div>
          <p className="text-white font-semibold truncate" title={archivo}>
            {archivo || "Sin archivo"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CalendarDays size={20} />
            <span className="text-sm">Hoja importada</span>
          </div>
          <p className="text-white font-semibold truncate" title={hoja}>
            {hoja || "Sin hoja"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <User size={20} />
            <span className="text-sm">Trabajadores</span>
          </div>
          <p className="text-white font-semibold">
            {horarios.length} visibles / {totalFilas} importados
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={buscar}
              onChange={(evento) => setBuscar(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key === "Enter") buscarTrabajador()
              }}
              placeholder="Buscar por ID, RUT o nombre..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 outline-none text-white focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:flex">
            <button
              type="button"
              onClick={buscarTrabajador}
              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={limpiarBusqueda}
              className="w-full lg:w-auto bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Limpiar
            </button>
          </div>
        </div>

        {busquedaAplicada && (
          <p className="text-sm text-zinc-400 mt-4 break-words">
            Búsqueda aplicada: <span className="text-white font-semibold">{busquedaAplicada}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!cargando && horarios.length > 0 && (
        <div className="lg:hidden mb-4 flex items-center gap-2 text-sm text-zinc-400">
          <MoveHorizontal size={18} />
          Desliza horizontalmente para ver todo el horario.
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {cargando ? (
          <div className="p-10 text-center text-zinc-400">
            Cargando horarios...
          </div>
        ) : horarios.length === 0 ? (
          <div className="p-8 sm:p-10 text-center text-zinc-500">
            No se encontraron trabajadores con esa búsqueda.
          </div>
        ) : (
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full min-w-max border-collapse text-xs sm:text-sm">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th colSpan={6} className="sticky left-0 z-30 bg-blue-900 text-white border border-zinc-700 px-3 py-2 text-left">
                    Datos del trabajador
                  </th>
                  {fechas.map((dia) => (
                    <th key={dia.fecha} className="bg-zinc-800 text-white border border-zinc-700 px-3 py-2 min-w-20 text-center">
                      {dia.fecha}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="sticky left-0 z-30 bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-16 sm:min-w-20">ID</th>
                  <th className="bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-32">RUT</th>
                  <th className="bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-52 sm:min-w-60 text-left">Nombre</th>
                  <th className="bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-36">Cargo</th>
                  <th className="bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-32">Lugar</th>
                  <th className="bg-blue-800 text-white border border-zinc-700 px-3 py-2 min-w-36">Acción</th>
                  {fechas.map((dia) => (
                    <th key={`${dia.fecha}-${dia.diaSemana}`} className="bg-zinc-700 text-zinc-200 border border-zinc-600 px-3 py-2 text-center">
                      {dia.diaSemana}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horarios.map((horario) => (
                  <tr key={horario.id} className="hover:bg-zinc-800/70">
                    <td className="sticky left-0 z-10 bg-zinc-950 border border-zinc-800 px-3 py-2 text-center font-semibold">
                      {horario.id}
                    </td>
                    <td className="border border-zinc-800 px-3 py-2 whitespace-nowrap">{horario.rut}</td>
                    <td className="border border-zinc-800 px-3 py-2 whitespace-nowrap font-semibold">{horario.nombre}</td>
                    <td className="border border-zinc-800 px-3 py-2 whitespace-nowrap">{horario.cargo || "-"}</td>
                    <td className="border border-zinc-800 px-3 py-2 whitespace-nowrap">{horario.lugar || "-"}</td>
                    <td className="border border-zinc-800 px-3 py-2 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/horarios/${horario.id}`)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                      >
                        <Eye size={16} /> Ver horario
                      </button>
                    </td>
                    {horario.horarioMensual.map((dia) => (
                      <td
                        key={`${horario.id}-${dia.fecha}`}
                        title={obtenerTextoTurno(dia.turno)}
                        className={`border border-zinc-800 px-3 py-2 text-center min-w-16 ${obtenerClaseTurno(dia.turno)}`}
                      >
                        {dia.turno || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><span className="font-bold">M</span> = AM</div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><span className="font-bold">T</span> = PM</div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"><span className="font-bold">N</span> = Noche</div>
        <div className="bg-green-500/80 text-black rounded-xl px-4 py-3"><span className="font-bold">L</span> = Libre</div>
        <div className="bg-red-600 text-white rounded-xl px-4 py-3"><span className="font-bold">LM</span> = Licencia médica</div>
        <div className="bg-yellow-400 text-black rounded-xl px-4 py-3"><span className="font-bold">VAC</span> = Vacaciones</div>
      </div>
    </div>
  )
}