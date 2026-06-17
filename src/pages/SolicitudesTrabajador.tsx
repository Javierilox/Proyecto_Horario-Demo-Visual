import React, { useState, useEffect } from "react"
import { CalendarDays, FileText, ClipboardCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Interfaz para la estructura de las solicitudes que llegan desde la base de datos
interface Solicitud {
  id: number
  tipo: string
  estado: string
  fechaInicio: string | null
  fechaTermino: string | null
  motivo: string | null
  respuestaAdmin: string | null
  creadoEn: string
}

export default function SolicitudesTrabajador() {
  // === ESTADOS PARA EL HISTORIAL ===
  const [misSolicitudes, setMisSolicitudes] = useState<Solicitud[]>([])
  const [cargandoHistorial, setCargandoHistorial] = useState(false)

  // === ESTADOS PARA LOS FORMULARIOS ===
  const [cargandoEnvio, setCargandoEnvio] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" })

  // Estado independiente para el formulario de Vacaciones
  const [formVacaciones, setFormVacaciones] = useState({
    inicio: "",
    termino: "",
    motivo: "",
  })

  // Estado independiente para el formulario de Licencias
  const [formLicencia, setFormLicencia] = useState({
    inicio: "",
    termino: "",
    motivo: "",
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

  // 1. Cargar el historial al entrar a la pantalla
  const cargarHistorial = async () => {
    setCargandoHistorial(true)
    try {
      const token = localStorage.getItem("token")
      const respuesta = await fetch(`${API_URL}/api/solicitudes/mis-solicitudes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await respuesta.json()
      if (data.solicitudes) {
        setMisSolicitudes(data.solicitudes)
      }
    } catch (error) {
      console.error("Error al cargar historial:", error)
    } finally {
      setCargandoHistorial(false)
    }
  }

  useEffect(() => {
    cargarHistorial()
  }, [])

  // 2. Función maestra para enviar cualquier tipo de solicitud
  const enviarSolicitud = async (
    e: React.FormEvent,
    tipo: "VACACIONES" | "LICENCIA_MEDICA",
    datosForm: { inicio: string; termino: string; motivo: string }
  ) => {
    e.preventDefault()
    setCargandoEnvio(true)
    setMensaje({ texto: "", tipo: "" })

    try {
      const token = localStorage.getItem("token")
      const respuesta = await fetch(`${API_URL}/api/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          fechaInicio: datosForm.inicio,
          fechaTermino: datosForm.termino,
          motivo: datosForm.motivo,
        }),
      })

      const data = await respuesta.json()

      if (respuesta.ok) {
        setMensaje({ texto: `¡Solicitud de ${tipo.replace("_", " ")} enviada con éxito!`, tipo: "exito" })
        
        // Limpiamos los formularios
        if (tipo === "VACACIONES") setFormVacaciones({ inicio: "", termino: "", motivo: "" })
        if (tipo === "LICENCIA_MEDICA") setFormLicencia({ inicio: "", termino: "", motivo: "" })
        
        // Refrescamos la tabla de abajo
        cargarHistorial()

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => setMensaje({ texto: "", tipo: "" }), 5000)
      } else {
        setMensaje({ texto: data.mensaje || "Error al enviar la solicitud.", tipo: "error" })
      }
    } catch (error) {
      setMensaje({ texto: "Error de conexión con el servidor.", tipo: "error" })
    } finally {
      setCargandoEnvio(false)
    }
  }

  // Funciones visuales para la tabla de historial adaptadas al tema oscuro
  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case "APROBADA": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "RECHAZADA": return "bg-red-500/10 text-red-400 border-red-500/20"
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20" // PENDIENTE
    }
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case "APROBADA": return <CheckCircle className="w-4 h-4 mr-1.5" />
      case "RECHAZADA": return <XCircle className="w-4 h-4 mr-1.5" />
      default: return <Clock className="w-4 h-4 mr-1.5" />
    }
  }

  return (
    <div>
      {/* Encabezado original */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Solicitudes</h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
          Desde aquí podrás solicitar vacaciones o enviar información para validar licencias médicas.
        </p>
      </div>

      {/* Alerta global de mensajes */}
      {mensaje.texto && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
          mensaje.tipo === "exito" ? "bg-emerald-950/50 border-emerald-900 text-emerald-400" : "bg-red-950/50 border-red-900 text-red-400"
        }`}>
          <AlertCircle size={20} />
          <p className="font-medium text-sm">{mensaje.texto}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* === TARJETA: SOLICITUD DE VACACIONES === */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Solicitar vacaciones</h2>
              <p className="text-sm text-zinc-400">Envía una solicitud para revisión de administración.</p>
            </div>
          </div>

          <form 
            onSubmit={(e) => enviarSolicitud(e, "VACACIONES", formVacaciones)} 
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={formVacaciones.inicio}
                    onChange={(e) => setFormVacaciones({ ...formVacaciones, inicio: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Fecha de Término</label>
                  <input
                    type="date"
                    required
                    value={formVacaciones.termino}
                    onChange={(e) => setFormVacaciones({ ...formVacaciones, termino: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Comentarios o Destino (Opcional)</label>
                <textarea
                  rows={2}
                  value={formVacaciones.motivo}
                  onChange={(e) => setFormVacaciones({ ...formVacaciones, motivo: e.target.value })}
                  placeholder="Detalles adicionales..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargandoEnvio}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-zinc-400 text-white px-5 py-3 rounded-xl font-semibold transition-all flex justify-center items-center gap-2"
            >
              {cargandoEnvio ? "Procesando..." : "Enviar Solicitud"}
            </button>
          </form>
        </section>

        {/* === TARJETA: VALIDACIÓN DE LICENCIA MÉDICA === */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-600/10 text-amber-400 p-3 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Validar licencia médica</h2>
              <p className="text-sm text-zinc-400">Envía antecedentes para que administración pueda revisarlos.</p>
            </div>
          </div>

          <form 
            onSubmit={(e) => enviarSolicitud(e, "LICENCIA_MEDICA", formLicencia)} 
            className="flex-1 flex flex-col justify-between"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Inicio de Reposo</label>
                  <input
                    type="date"
                    required
                    value={formLicencia.inicio}
                    onChange={(e) => setFormLicencia({ ...formLicencia, inicio: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Fin de Reposo</label>
                  <input
                    type="date"
                    required
                    value={formLicencia.termino}
                    onChange={(e) => setFormLicencia({ ...formLicencia, termino: e.target.value })}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Folio de Licencia y Detalle</label>
                <textarea
                  required
                  rows={2}
                  value={formLicencia.motivo}
                  onChange={(e) => setFormLicencia({ ...formLicencia, motivo: e.target.value })}
                  placeholder="Ej: Folio 12345678 - Reposo domiciliario..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargandoEnvio}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:text-zinc-400 text-white px-5 py-3 rounded-xl font-semibold transition-all flex justify-center items-center gap-2"
            >
              {cargandoEnvio ? "Procesando..." : "Enviar Antecedentes"}
            </button>
          </form>
        </section>
      </div>

      {/* === ESTADO GENERAL (HISTORIAL INTERACTIVO) === */}
      <section className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-emerald-600/10 text-emerald-400 p-3 rounded-xl">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Estado de solicitudes</h2>
            <p className="text-sm text-zinc-400">Aquí se muestra el historial detallado de las solicitudes enviadas.</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          {cargandoHistorial ? (
            <div className="p-8 text-center text-zinc-500">Cargando historial...</div>
          ) : misSolicitudes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Fecha de Envío</th>
                    <th className="px-5 py-4 font-medium">Tipo</th>
                    <th className="px-5 py-4 font-medium">Rango de Fechas</th>
                    <th className="px-5 py-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {misSolicitudes.map((sol) => (
                    <tr key={sol.id} className="hover:bg-zinc-900/50 transition-colors text-zinc-300">
                      <td className="px-5 py-4">
                        {new Date(sol.creadoEn).toLocaleDateString("es-CL")}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {sol.tipo.replace("_", " ")}
                      </td>
                      <td className="px-5 py-4 text-zinc-400">
                        {sol.fechaInicio && sol.fechaTermino 
                          ? `${new Date(sol.fechaInicio).toLocaleDateString("es-CL")} al ${new Date(sol.fechaTermino).toLocaleDateString("es-CL")}`
                          : "No aplica"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${obtenerColorEstado(sol.estado)}`}>
                          {obtenerIconoEstado(sol.estado)}
                          {sol.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
              <ClipboardCheck className="w-8 h-8 mb-2 opacity-50" />
              <p>Aún no hay solicitudes registradas.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}