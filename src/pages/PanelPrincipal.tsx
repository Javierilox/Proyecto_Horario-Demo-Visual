import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  Users,
  UserCheck,
  CalendarOff,
  TriangleAlert,
  BriefcaseBusiness,
  MapPin,
  RefreshCw,
  Filter,
  CalendarDays,
  FileSpreadsheet,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  TrendingDown,
  TrendingUp,
  ClipboardList,
} from "lucide-react"

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import type { RespuestaMetricasDashboard } from "../types/metrica"
import { mockMetricasDashboard } from "../data/mockData" // <- IMPORTAMOS LOS DATOS FALSOS

const coloresEstadoDia = [
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#71717a",
]

const mesesAbreviados = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
]

const obtenerFechaActualDelEquipo = () => {
  const fechaActual = new Date()
  const dia = String(fechaActual.getDate()).padStart(2, "0")
  const mes = mesesAbreviados[fechaActual.getMonth()]
  return `${dia}-${mes}`
}

const formatearFechaCarga = (valor?: string) => {
  if (!valor) return "Sin información"
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return "Sin información"
  return fecha.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
}

const obtenerClaseEstadoCobertura = (estado: string) => {
  if (estado === "DEFICIT") return "bg-red-500/10 text-red-400 border-red-500/30"
  if (estado === "SUPERAVIT") return "bg-blue-500/10 text-blue-400 border-blue-500/30"
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
}

export default function PanelPrincipal() {
  const [metricas, setMetricas] = useState<RespuestaMetricasDashboard | null>(null)

  const [fechaSeleccionada, setFechaSeleccionada] = useState("")
  const [lugarSeleccionado, setLugarSeleccionado] = useState("TODOS")
  const [cargoSeleccionado, setCargoSeleccionado] = useState("TODOS")
  const [turnoSeleccionado, setTurnoSeleccionado] = useState("TODOS")

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  // SIMULACIÓN DE LLAMADA AL BACKEND
  const cargarMetricas = (
    fecha = "",
    lugar = "TODOS",
    cargo = "TODOS",
    turno = "TODOS"
  ) => {
    setCargando(true)
    setError("")

    setTimeout(() => {
      // Inyectamos los datos del portafolio en lugar de la respuesta de axios
      setMetricas(mockMetricasDashboard as RespuestaMetricasDashboard)
      
      // Actualizamos los selectores visuales
      setFechaSeleccionada(fecha || mockMetricasDashboard.filtros.fechaSeleccionada)
      setLugarSeleccionado(lugar)
      setCargoSeleccionado(cargo)
      setTurnoSeleccionado(turno)
      
      setCargando(false)
    }, 800) // Animación fluida de 800ms
  }

  useEffect(() => {
    const fechaActualEquipo = obtenerFechaActualDelEquipo()
    cargarMetricas(fechaActualEquipo, "TODOS", "TODOS", "TODOS")
  }, [])

  const aplicarFiltros = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    cargarMetricas(fechaSeleccionada, lugarSeleccionado, cargoSeleccionado, turnoSeleccionado)
  }

  const volverAHoy = () => {
    const fechaActualEquipo = obtenerFechaActualDelEquipo()
    cargarMetricas(fechaActualEquipo, "TODOS")
  }

  const datosGraficoEstado = useMemo(() => {
    return metricas?.graficoEstadoDia.filter((item) => item.cantidad > 0) || []
  }, [metricas])

  const altoGraficoLugar = Math.max(320, (metricas?.graficoPorLugar.length || 0) * 52)
  const altoGraficoCargo = Math.max(320, (metricas?.graficoPorCargo.length || 0) * 52)
  const altoGraficoDeficitLugar = Math.max(320, (metricas?.graficoDeficitPorLugar.length || 0) * 52)
  const altoGraficoDeficitCargo = Math.max(320, (metricas?.graficoDeficitPorCargo.length || 0) * 52)

  const resumen = metricas?.resumen
  const resumenDotacion = metricas?.resumenDotacion

  const hayRequerimientosImportados =
    (resumenDotacion?.requeridos || 0) > 0 ||
    (metricas?.detalleDeficit.length || 0) > 0

  return (
    <div>
      {/* Encabezado principal */}
      <div className="flex flex-col gap-5 mb-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Dashboard operativo
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-4xl">
            Analiza la dotación diaria de trabajadores por fecha, lugar,
            turno, cargo y cobertura requerida.
          </p>
        </div>

        <button
          type="button"
          onClick={() => cargarMetricas(fechaSeleccionada, lugarSeleccionado, cargoSeleccionado, turnoSeleccionado)}
          className="w-full sm:w-fit bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {/* Información de la carga activa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <FileSpreadsheet size={20} />
            <span className="text-sm">Archivo analizado</span>
          </div>
          <p className="text-white font-semibold truncate">
            {metricas?.carga?.archivoOriginal || "Sin carga disponible"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <CalendarDays size={20} />
            <span className="text-sm">Hoja importada</span>
          </div>
          <p className="text-white font-semibold truncate">
            {metricas?.carga?.hoja || "Sin hoja"}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <RefreshCw size={20} />
            <span className="text-sm">Última importación</span>
          </div>
          <p className="text-white font-semibold">
            {formatearFechaCarga(metricas?.carga?.creadoEn)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <form onSubmit={aplicarFiltros} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
            <Filter size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Filtros del dashboard</h2>
            <p className="text-sm text-zinc-400">
              La fecha se ajusta automáticamente al día actual del equipo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Fecha</label>
            <select
              value={fechaSeleccionada}
              onChange={(evento) => setFechaSeleccionada(evento.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            >
              {metricas?.filtros.fechasDisponibles.map((fecha) => (
                <option key={fecha} value={fecha}>{fecha}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Lugar</label>
            <select
              value={lugarSeleccionado}
              onChange={(evento) => setLugarSeleccionado(evento.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              {metricas?.filtros.lugaresDisponibles.map((lugar) => (
                <option key={lugar} value={lugar}>{lugar}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Cargo</label>
            <select
              value={cargoSeleccionado}
              onChange={(evento) => setCargoSeleccionado(evento.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              {metricas?.filtros.cargosDisponibles.map((cargo) => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Turno</label>
            <select
              value={turnoSeleccionado}
              onChange={(evento) => setTurnoSeleccionado(evento.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              {metricas?.filtros.turnosDisponibles.map((turno) => (
                <option key={turno.codigo} value={turno.codigo}>{turno.nombre}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 xl:col-span-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={cargando}
              className="w-full sm:w-fit bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all"
            >
              {cargando ? "Cargando..." : "Aplicar filtros"}
            </button>

            <button
              type="button"
              onClick={volverAHoy}
              disabled={cargando}
              className="w-full sm:w-fit bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Volver a hoy
            </button>
          </div>
        </div>
      </form>

      {/* Resumen general del día */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5 mb-6 transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Total personas</p>
              <p className="text-4xl font-bold">{resumen?.totalPersonas ?? 0}</p>
            </div>
            <div className="bg-blue-600/10 text-blue-400 p-4 rounded-2xl"><Users size={28} /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Trabajando</p>
              <p className="text-4xl font-bold">{resumen?.trabajando ?? 0}</p>
            </div>
            <div className="bg-emerald-600/10 text-emerald-400 p-4 rounded-2xl"><UserCheck size={28} /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Libres</p>
              <p className="text-4xl font-bold">{resumen?.libre ?? 0}</p>
            </div>
            <div className="bg-green-600/10 text-green-400 p-4 rounded-2xl"><CalendarOff size={28} /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Licencia / Vac</</p>
              <p className="text-4xl font-bold">{resumen?.ausente ?? 0}</p>
            </div>
            <div className="bg-amber-600/10 text-amber-400 p-4 rounded-2xl"><BriefcaseBusiness size={28} /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Sin asignación</p>
              <p className="text-4xl font-bold">{resumen?.sinAsignacion ?? 0}</p>
            </div>
            <div className="bg-zinc-600/10 text-zinc-400 p-4 rounded-2xl"><TriangleAlert size={28} /></div>
          </div>
        </div>
      </div>

      {/* Gráficos generales */}
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 mb-6 transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-purple-600/10 text-purple-400 p-3 rounded-xl"><PieChartIcon size={22} /></div>
            <div>
              <h2 className="text-xl font-semibold">Estado del día</h2>
              <p className="text-sm text-zinc-400">Trabajando, libre, ausente o sin asignación.</p>
            </div>
          </div>
          {datosGraficoEstado.length > 0 ? (
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={datosGraficoEstado} dataKey="cantidad" nameKey="categoria" cx="50%" cy="50%" outerRadius={110} label>
                    {datosGraficoEstado.map((item, indice) => (
                      <Cell key={`${item.categoria}-${indice}`} fill={coloresEstadoDia[indice % coloresEstadoDia.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[360px] flex items-center justify-center text-zinc-500">No hay datos para mostrar.</div>
          )}
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl"><BarChart3 size={22} /></div>
            <div>
              <h2 className="text-xl font-semibold">Distribución por turno</h2>
              <p className="text-sm text-zinc-400">Cantidad de trabajadores en AM, PM y Noche.</p>
            </div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas?.graficoTurnos || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="turno" stroke="#d4d4d8" />
                <YAxis stroke="#d4d4d8" />
                <Tooltip />
                <Bar dataKey="cantidad" name="Trabajadores" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Gráficos por lugar y cargo */}
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 mb-10 transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-emerald-600/10 text-emerald-400 p-3 rounded-xl"><MapPin size={22} /></div>
            <div>
              <h2 className="text-xl font-semibold">Turnos por lugar</h2>
              <p className="text-sm text-zinc-400">Comparación AM, PM y Noche entre lugares.</p>
            </div>
          </div>
          <div style={{ height: altoGraficoLugar }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas?.graficoPorLugar || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis type="number" stroke="#d4d4d8" />
                <YAxis type="category" dataKey="lugar" width={120} stroke="#d4d4d8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="am" name="AM" fill="#2563eb" />
                <Bar dataKey="pm" name="PM" fill="#16a34a" />
                <Bar dataKey="noche" name="Noche" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-600/10 text-amber-400 p-3 rounded-xl"><BriefcaseBusiness size={22} /></div>
            <div>
              <h2 className="text-xl font-semibold">Estado por cargo</h2>
              <p className="text-sm text-zinc-400">Trabajando, libre y ausente por cargo.</p>
            </div>
          </div>
          <div style={{ height: altoGraficoCargo }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas?.graficoPorCargo || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis type="number" stroke="#d4d4d8" />
                <YAxis type="category" dataKey="cargo" width={150} stroke="#d4d4d8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="trabajando" name="Trabajando" fill="#2563eb" />
                <Bar dataKey="libre" name="Libre" fill="#16a34a" />
                <Bar dataKey="ausente" name="Licencia / Vacaciones" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Sección de déficit */}
      <div className={`mb-6 transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Análisis de déficit de dotación</h2>
        <p className="text-sm sm:text-base text-zinc-400">Comparación entre la hoja NECESIDAD y los trabajadores programados.</p>
      </div>

      {!hayRequerimientosImportados ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
          No se encontraron requerimientos importados desde la hoja NECESIDAD.
        </div>
      ) : (
        <div className={`transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-5 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Requeridos</p>
                  <p className="text-4xl font-bold">{resumenDotacion?.requeridos ?? 0}</p>
                </div>
                <div className="bg-indigo-600/10 text-indigo-400 p-4 rounded-2xl"><Target size={28} /></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Programados</p>
                  <p className="text-4xl font-bold">{resumenDotacion?.programados ?? 0}</p>
                </div>
                <div className="bg-blue-600/10 text-blue-400 p-4 rounded-2xl"><UserCheck size={28} /></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Déficit</p>
                  <p className="text-4xl font-bold text-red-400">{resumenDotacion?.deficit ?? 0}</p>
                </div>
                <div className="bg-red-600/10 text-red-400 p-4 rounded-2xl"><TrendingDown size={28} /></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Superávit</p>
                  <p className="text-4xl font-bold text-emerald-400">{resumenDotacion?.superavit ?? 0}</p>
                </div>
                <div className="bg-emerald-600/10 text-emerald-400 p-4 rounded-2xl"><TrendingUp size={28} /></div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Críticas</p>
                  <p className="text-4xl font-bold text-amber-400">{resumenDotacion?.combinacionesConDeficit ?? 0}</p>
                </div>
                <div className="bg-amber-600/10 text-amber-400 p-4 rounded-2xl"><TriangleAlert size={28} /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 mb-6">
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-red-600/10 text-red-400 p-3 rounded-xl"><BarChart3 size={22} /></div>
                <div>
                  <h3 className="text-xl font-semibold">Déficit por turno</h3>
                  <p className="text-sm text-zinc-400">Requeridos vs Programados.</p>
                </div>
              </div>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricas?.graficoDeficitPorTurno || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis dataKey="nombreTurno" stroke="#d4d4d8" />
                    <YAxis stroke="#d4d4d8" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requeridos" name="Requeridos" fill="#6366f1" />
                    <Bar dataKey="programados" name="Programados" fill="#2563eb" />
                    <Bar dataKey="deficit" name="Déficit" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-orange-600/10 text-orange-400 p-3 rounded-xl"><MapPin size={22} /></div>
                <div>
                  <h3 className="text-xl font-semibold">Déficit por lugar</h3>
                  <p className="text-sm text-zinc-400">Cobertura por recintos operativos.</p>
                </div>
              </div>
              <div style={{ height: altoGraficoDeficitLugar }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricas?.graficoDeficitPorLugar || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis type="number" stroke="#d4d4d8" />
                    <YAxis type="category" dataKey="lugar" width={120} stroke="#d4d4d8" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requeridos" name="Requeridos" fill="#6366f1" />
                    <Bar dataKey="programados" name="Programados" fill="#2563eb" />
                    <Bar dataKey="deficit" name="Déficit" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-rose-600/10 text-rose-400 p-3 rounded-xl"><BriefcaseBusiness size={22} /></div>
              <div>
                <h3 className="text-xl font-semibold">Déficit por cargo</h3>
                <p className="text-sm text-zinc-400">Diferencia entre necesidad y programación.</p>
              </div>
            </div>
            <div style={{ height: altoGraficoDeficitCargo }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricas?.graficoDeficitPorCargo || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis type="number" stroke="#d4d4d8" />
                  <YAxis type="category" dataKey="cargo" width={160} stroke="#d4d4d8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requeridos" name="Requeridos" fill="#6366f1" />
                  <Bar dataKey="programados" name="Programados" fill="#2563eb" />
                  <Bar dataKey="deficit" name="Déficit" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-yellow-600/10 text-yellow-400 p-3 rounded-xl"><ClipboardList size={22} /></div>
              <div>
                <h3 className="text-xl font-semibold">Detalle de cobertura</h3>
                <p className="text-sm text-zinc-400">Comparación exacta por lugar, cargo y turno.</p>
              </div>
            </div>

            {metricas?.detalleDeficit.length ? (
              <div className="overflow-auto">
                <table className="w-full min-w-[950px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-800 text-zinc-200">
                      <th className="border border-zinc-700 px-4 py-3 text-left">Lugar</th>
                      <th className="border border-zinc-700 px-4 py-3 text-left">Cargo</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Turno</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Requeridos</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Programados</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Déficit</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Superávit</th>
                      <th className="border border-zinc-700 px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricas.detalleDeficit.map((item) => (
                      <tr key={item.idRequerimiento} className="hover:bg-zinc-800/60">
                        <td className="border border-zinc-800 px-4 py-3">{item.lugar}</td>
                        <td className="border border-zinc-800 px-4 py-3">{item.cargo}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center">{item.nombreTurno}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center">{item.requeridos}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center">{item.programados}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center text-red-400 font-semibold">{item.deficit}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center text-emerald-400 font-semibold">{item.superavit}</td>
                        <td className="border border-zinc-800 px-4 py-3 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${obtenerClaseEstadoCobertura(item.estado)}`}>
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-zinc-500">No hay detalle de cobertura para mostrar.</div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}