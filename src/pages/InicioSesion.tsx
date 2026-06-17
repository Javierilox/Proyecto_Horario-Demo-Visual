import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, Info } from "lucide-react"

import { useDemo } from "../context/DemoContext"

export default function InicioSesion() {
  const navigate = useNavigate()
  
  // Extraemos nombre y el componente de logo dinámico
  const { nombreApp, LogoComponent } = useDemo() 

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

    setTimeout(() => {
      let usuarioSimulado
      if (correo.toLowerCase().includes("admin")) {
        usuarioSimulado = { id: 1, nombre: "Administrador Demo", correo: correo, rol: "ADMIN", rut: "11.111.111-1" }
      } else {
        usuarioSimulado = { id: 2, nombre: "Trabajador Demo", correo: correo, rol: "TRABAJADOR", rut: "22.222.222-2" }
      }

      localStorage.setItem("token", "token-demo-portafolio")
      localStorage.setItem("usuario", JSON.stringify(usuarioSimulado))

      if (usuarioSimulado.rol === "TRABAJADOR") {
        navigate("/mi-horario", { replace: true })
      } else {
        navigate("/panel", { replace: true })
      }
      setCargando(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
            {/* Logo Dinámico */}
            <LogoComponent className="text-blue-400" size={32} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            {nombreApp}
          </h1>
          <p className="text-zinc-400 mt-2">
            Gestión inteligente de horarios
          </p>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/30 p-6 sm:p-8">
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex gap-3 text-sm text-blue-200">
            <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <p>
              <strong>Modo Portafolio:</strong> Usa <span className="text-blue-400 font-semibold">admin@demo.com</span> para vista de Administración, o <span className="text-blue-400 font-semibold">trabajador@demo.com</span> para Empleado.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">Iniciar sesión</h2>
            <p className="text-sm text-zinc-400 mt-1">Accede con tus credenciales.</p>
          </div>

          {error && <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm">{error}</div>}

          <form onSubmit={iniciarSesion} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Correo</label>
              <div className="relative">
                <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}
                  placeholder="admin@demo.com" autoComplete="email"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={mostrarPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-12 py-3.5 rounded-2xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm"
                />
                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={cargando} className="group w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-5 py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2">
              {cargando ? <><Loader2 size={19} className="animate-spin" /> Entrando...</> : <><LogIn size={19} className="group-hover:translate-x-0.5" /> Entrar</>}
            </button>
          </form>
        </section>

        <p className="text-center text-xs text-zinc-600 mt-6">{nombreApp} · Control operativo</p>
      </main>
    </div>
  )
}