import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  RefreshCw,
  User,
} from "lucide-react"

// Importamos el tipo desde el servicio original para mantener TypeScript contento,
// pero usamos nuestros datos falsos para renderizar.
import type { RespuestaMiHorario } from "../services/miHorarioServicio"
import { mockMiHorario } from "../data/mockData"

const obtenerClaseTurno = (turno: string) => {
  const codigo = turno.trim().toUpperCase()
  if (codigo === "M") return "bg-blue-600/20 text-blue-300 border-blue-500/30"
  if (codigo === "T") return "bg-emerald-600/20 text-emerald-300 border-emerald-500/30"
  if (codigo === "N") return "bg-violet-600/20 text-violet-300 border-violet-500/30"
  if (codigo === "L") return "bg-zinc-700/40 text-zinc-300 border-zinc-600"
  if (codigo === "LM") return "bg-amber-600/20 text-amber-300 border-amber-500/30"
  if (codigo === "VAC") return "bg-cyan-600/20 text-cyan-300 border-cyan-500/30"
  return "bg-red-600/20 text-red-300 border-red-500/30"
}

const obtenerNombreTurno = (turno: string, descripcion?: string) => {
  const codigo = turno.trim().toUpperCase()
  const nombres: Record<string, string> = {
    M: "AM", T: "PM", N: "Noche", L: "Libre", LM: "Licencia médica", VAC: "Vacaciones",
  }
  return nombres[codigo] || descripcion || "Sin definir"
}

const formatearFechaCarga = (valor?: string) => {
  if (!valor) return "Sin información"
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return "Sin información"
  return fecha.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
}

const limpiarNombreArchivo = (valor: string) => {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}

export default function MiHorario() {
  const [datosHorario, setDatosHorario] = useState<RespuestaMiHorario | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  /**
   * Carga simulada del horario para el portafolio.
   */
  const cargarMiHorario = () => {
    setCargando(true)
    setError("")

    setTimeout(() => {
      // Inyectamos los datos del mock
      setDatosHorario(mockMiHorario as RespuestaMiHorario)
      setCargando(false)
    }, 800)
  }

  useEffect(() => {
    cargarMiHorario()
  }, [])

  const resumenTurnos = useMemo(() => {
    const resumen = { am: 0, pm: 0, noche: 0, libre: 0, licencia: 0, vacaciones: 0, otros: 0 }
    datosHorario?.horarioMensual.forEach((dia) => {
      const turno = dia.turno.trim().toUpperCase()
      if (turno === "M") resumen.am += 1
      else if (turno === "T") resumen.pm += 1
      else if (turno === "N") resumen.noche += 1
      else if (turno === "L") resumen.libre += 1
      else if (turno === "LM") resumen.licencia += 1
      else if (turno === "VAC") resumen.vacaciones += 1
      else resumen.otros += 1
    })
    return resumen
  }, [datosHorario])

  const descargarHorarioExcel = () => {
    if (!datosHorario) return

    const trabajador = datosHorario.trabajador
    const nombreArchivo = limpiarNombreArchivo(trabajador.nombre)

    const datosTrabajador = [
      ["Nombre", trabajador.nombre],
      ["RUT", trabajador.rut],
      ["Cargo", trabajador.cargo || "Sin cargo"],
      ["Lugar", trabajador.lugar || "Sin lugar"],
      ["Partida", trabajador.partida || "Sin partida"],
      ["Archivo", datosHorario.carga.archivoOriginal],
      ["Hoja", datosHorario.carga.hoja],
      ["Última importación", formatearFechaCarga(datosHorario.carga.creadoEn)],
    ]

    const resumen = [
      ["Turno", "Cantidad"],
      ["AM", resumenTurnos.am],
      ["PM", resumenTurnos.pm],
      ["Noche", resumenTurnos.noche],
      ["Libre", resumenTurnos.libre],
      ["Licencia médica", resumenTurnos.licencia],
      ["Vacaciones", resumenTurnos.vacaciones],
      ["Otros", resumenTurnos.otros],
    ]

    const filasHorario = datosHorario.horarioMensual.map((dia) => ({
      Fecha: dia.fecha,
      Día: dia.diaSemana || "",
      Turno: dia.turno || "",
      Descripción: obtenerNombreTurno(dia.turno, dia.descripcion),
    }))

    const hojaDatos = XLSX.utils.aoa_to_sheet(datosTrabajador)
    const hojaResumen = XLSX.utils.aoa_to_sheet(resumen)
    const hojaHorario = XLSX.utils.json_to_sheet(filasHorario)

    hojaDatos["!cols"] = [{ wch: 22 }, { wch: 45 }]
    hojaResumen["!cols"] = [{ wch: 22 }, { wch: 15 }]
    hojaHorario["!cols"] = [{ wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 24 }]

    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hojaDatos, "Datos")
    XLSX.utils.book_append_sheet(libro, hojaResumen, "Resumen")
    XLSX.utils.book_append_sheet(libro, hojaHorario, "Horario")

    XLSX.writeFile(libro, `Horario_${nombreArchivo}.xlsx`)
  }

  const descargarHorarioPDF = () => {
    if (!datosHorario) return

    const trabajador = datosHorario.trabajador
    const nombreArchivo = limpiarNombreArchivo(trabajador.nombre)

    const documento = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

    documento.setFontSize(18)
    documento.text("Horario mensual", 14, 16)

    documento.setFontSize(10)
    documento.text(`Nombre: ${trabajador.nombre}`, 14, 26)
    documento.text(`RUT: ${trabajador.rut}`, 14, 32)
    documento.text(`Cargo: ${trabajador.cargo || "Sin cargo"}`, 14, 38)
    documento.text(`Lugar: ${trabajador.lugar || "Sin lugar"}`, 14, 44)
    documento.text(`Partida: ${trabajador.partida || "Sin partida"}`, 14, 50)

    documento.text(`Archivo: ${datosHorario.carga.archivoOriginal}`, 150, 26)
    documento.text(`Hoja: ${datosHorario.carga.hoja}`, 150, 32)
    documento.text(`Última importación: ${formatearFechaCarga(datosHorario.carga.creadoEn)}`, 150, 38)

    autoTable(documento, {
      startY: 58,
      head: [["AM", "PM", "Noche", "Libre", "Licencia", "Vacaciones", "Otros"]],
      body: [[resumenTurnos.am, resumenTurnos.pm, resumenTurnos.noche, resumenTurnos.libre, resumenTurnos.licencia, resumenTurnos.vacaciones, resumenTurnos.otros]],
      styles: { fontSize: 9, halign: "center", cellPadding: 3 },
      headStyles: { fillColor: [39, 39, 42], textColor: 255, fontStyle: "bold" },
    })

    const filasTabla = datosHorario.horarioMensual.map((dia) => [
      dia.fecha, dia.diaSemana || "", dia.turno || "", obtenerNombreTurno(dia.turno, dia.descripcion),
    ])

    autoTable(documento, {
      startY: 82,
      head: [["Fecha", "Día", "Turno", "Descripción"]],
      body: filasTabla,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 24 }, 2: { cellWidth: 22, halign: "center" }, 3: { cellWidth: 55 } },
    })

    documento.save(`Horario_${nombreArchivo}.pdf`)
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col gap-5 mb-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mi horario</h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
            Consulta tu programación mensual. (Modo Demo Activo)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={descargarHorarioExcel}
            disabled={!datosHorario}
            className="w-full sm:w-fit bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} /> Excel
          </button>

          <button
            type="button"
            onClick={descargarHorarioPDF}
            disabled={!datosHorario}
            className="w-full sm:w-fit bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <FileText size={18} /> PDF
          </button>

          <button
            type="button"
            onClick={cargarMiHorario}
            disabled={cargando}
            className="w-full sm:w-fit bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-60 px-5 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className={cargando ? "animate-spin" : ""} />
            {cargando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl flex gap-3">
          <AlertTriangle size={22} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {cargando && !datosHorario && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-zinc-400">
          Cargando tu horario...
        </div>
      )}

      {datosHorario && (
        <div className={`transition-opacity duration-500 ${cargando ? "opacity-40" : "opacity-100"}`}>
          {/* Datos del trabajador */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:col-span-2">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <User size={20} />
                <span className="text-sm">Trabajador</span>
              </div>
              <p className="text-2xl font-bold text-white">{datosHorario.trabajador.nombre}</p>
              <p className="text-sm text-zinc-400 mt-1">RUT: {datosHorario.trabajador.rut}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <BriefcaseBusiness size={20} />
                <span className="text-sm">Cargo</span>
              </div>
              <p className="text-white font-semibold">{datosHorario.trabajador.cargo || "Sin cargo"}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <MapPin size={20} />
                <span className="text-sm">Lugar</span>
              </div>
              <p className="text-white font-semibold">{datosHorario.trabajador.lugar || "Sin lugar"}</p>
            </div>
          </section>

          {/* Información de la carga activa */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <FileSpreadsheet size={20} />
                <span className="text-sm">Archivo</span>
              </div>
              <p className="text-white font-semibold truncate" title={datosHorario.carga.archivoOriginal}>
                {datosHorario.carga.archivoOriginal}
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <CalendarDays size={20} />
                <span className="text-sm">Hoja</span>
              </div>
              <p className="text-white font-semibold">{datosHorario.carga.hoja}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 text-zinc-400 mb-2">
                <Clock size={20} />
                <span className="text-sm">Última importación</span>
              </div>
              <p className="text-white font-semibold">{formatearFechaCarga(datosHorario.carga.creadoEn)}</p>
            </div>
          </section>

          {/* Resumen de turnos */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">AM</p>
              <p className="text-3xl font-bold text-blue-300">{resumenTurnos.am}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">PM</p>
              <p className="text-3xl font-bold text-emerald-300">{resumenTurnos.pm}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Noche</p>
              <p className="text-3xl font-bold text-violet-300">{resumenTurnos.noche}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Libre</p>
              <p className="text-3xl font-bold text-zinc-300">{resumenTurnos.libre}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Licencia</p>
              <p className="text-3xl font-bold text-amber-300">{resumenTurnos.licencia}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <p className="text-sm text-zinc-400 mb-1">Vacaciones</p>
              <p className="text-3xl font-bold text-cyan-300">{resumenTurnos.vacaciones}</p>
            </div>
          </section>

          {/* Tabla mensual */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
                <BadgeCheck size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Programación mensual</h2>
                <p className="text-sm text-zinc-400">Detalle de tus turnos día por día.</p>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full min-w-225 border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-800 text-zinc-200">
                    <th className="border border-zinc-700 px-4 py-3 text-left">Fecha</th>
                    <th className="border border-zinc-700 px-4 py-3 text-left">Día</th>
                    <th className="border border-zinc-700 px-4 py-3 text-center">Turno</th>
                    <th className="border border-zinc-700 px-4 py-3 text-left">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {datosHorario.horarioMensual.map((dia, indice) => (
                    <tr key={`${dia.fecha}-${indice}`} className="hover:bg-zinc-800/60">
                      <td className="border border-zinc-800 px-4 py-3">{dia.fecha}</td>
                      <td className="border border-zinc-800 px-4 py-3">{dia.diaSemana || "-"}</td>
                      <td className="border border-zinc-800 px-4 py-3 text-center">
                        <span className={`inline-flex min-w-16 justify-center px-3 py-1 rounded-full border text-xs font-bold ${obtenerClaseTurno(dia.turno)}`}>
                          {dia.turno || "-"}
                        </span>
                      </td>
                      <td className="border border-zinc-800 px-4 py-3">
                        {obtenerNombreTurno(dia.turno, dia.descripcion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}