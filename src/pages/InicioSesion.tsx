import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Info // Añadimos este icono para el aviso del portafolio
} from "lucide-react"

export default function InicioSesion() {
  const navigate = useNavigate()

  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const iniciarSesion = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    if (!correo.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.")
      return
    }

    setCargando(true)
    setError("")

    // SIMULACIÓN DE BACKEND PARA EL PORTAFOLIO
    setTimeout(() => {
      let usuarioSimulado;

      // Regla: Si el correo contiene "admin", entra como Administrador
      if (correo.toLowerCase().includes("admin")) {
        usuarioSimulado = {
          id: 1,
          nombre: "Administrador Demo",
          correo: correo,
          rol: "ADMIN",
          rut: "11.111.111-1"
        };
      } else {
        // Cualquier otro correo entra como Trabajador
        usuarioSimulado = {
          id: 2,
          nombre: "Trabajador Demo",
          correo: correo,
          rol: "TRABAJADOR",
          rut: "22.222.222-2"
        };
      }

      // Guardamos la sesión falsa
      localStorage.setItem("token", "token-demo-portafolio")
      localStorage.setItem("usuario", JSON.stringify(usuarioSimulado))

      // Redirigimos según el rol
      if (usuarioSimulado.rol === "TRABAJADOR") {
        navigate("/mi-horario", { replace: true })
      } else {
        navigate("/panel", { replace: true })
      }
      
      setCargando(false)
    }, 1200) // 1.2 segundos de delay para mostrar la animación de carga
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
            <ShieldCheck className="text-blue-400" size={32} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            ShiftFlow
          </h1>

          <p className="text-zinc-400 mt-2">
            Gestión inteligente de horarios
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/30 p-6 sm:p-8">
          
          {/* AVISO PARA RECLUTADORES (Solo visible en la Demo) */}
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex gap-3 text-sm text-blue-200">
            <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <p>
              <strong>Modo Portafolio:</strong> Usa <span className="text-blue-400 font-semibold">admin@demo.com</span> para ver la vista de Administración, o <span className="text-blue-400 font-semibold">trabajador@demo.com</span> para la vista de Empleado. (La contraseña puede ser cualquiera).
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">Iniciar sesión</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Accede con tus credenciales del sistema.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={iniciarSesion} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Correo
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type="email"
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  placeholder="admin@demo.com"
                  autoComplete="email"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-12 py-3.5 rounded-2xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setMostrarPassword((estado) => !estado)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all hover:scale-110 active:scale-95"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed px-5 py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-950/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              {cargando ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn
                    size={19}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                  Entrar
                </>
              )}
            </button>
          </form>
        </section>

        <p className="text-center text-xs text-zinc-600 mt-6">
          ShiftFlow · Control de horarios operativos
        </p>
      </main>
    </div>
  )
}