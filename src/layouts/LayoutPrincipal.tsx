import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  ClipboardCheck,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Upload,
  Users,
  X,
} from "lucide-react"

import {
  cerrarSesion,
  obtenerUsuarioSesion,
} from "../utils/auth"

// 1. Importamos el hook de Demo
import { useDemo } from "../context/DemoContext"

export default function LayoutPrincipal() {
  const navigate = useNavigate()
  const usuario = obtenerUsuarioSesion()
  
  // 2. Extraemos el nombreApp
  const { nombreApp } = useDemo()

  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

  const enlacesAdmin = [
    { nombre: "Panel principal", ruta: "/panel", icono: LayoutDashboard },
    { nombre: "Subir Excel", ruta: "/subir-excel", icono: Upload },
    { nombre: "Horarios", ruta: "/horarios", icono: CalendarDays },
    { nombre: "Trabajadores", ruta: "/trabajadores", icono: Users },
  ]

  const enlacesTrabajador = [
    { nombre: "Mi horario", ruta: "/mi-horario", icono: CalendarDays },
    { nombre: "Solicitudes", ruta: "/solicitudes", icono: ClipboardCheck },
    { nombre: "Ayuda", ruta: "/ayuda", icono: HelpCircle },
  ]

  const enlacesMenu =
    usuario?.rol === "TRABAJADOR" ? enlacesTrabajador : enlacesAdmin

  const cerrarSesionUsuario = () => {
    cerrarSesion()
    navigate("/login")
  }

  const renderizarEnlacesMenu = () => {
    return enlacesMenu.map((enlace) => {
      const Icono = enlace.icono

      return (
        <NavLink
          key={enlace.ruta}
          to={enlace.ruta}
          onClick={() => setMenuMovilAbierto(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`
          }
        >
          <Icono size={20} />
          <span>{enlace.nombre}</span>
        </NavLink>
      )
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Barra superior móvil */}
      <header className="lg:hidden sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            {/* 3. Nombre Dinámico en Móvil */}
            <h1 className="text-2xl font-bold leading-none">
              {nombreApp}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Gestión de horarios
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMenuMovilAbierto((estado) => !estado)}
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl"
            aria-label="Abrir menú"
          >
            {menuMovilAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        {menuMovilAbierto && (
          <nav className="mt-4 space-y-2">
            {renderizarEnlacesMenu()}

            <button
              type="button"
              onClick={cerrarSesionUsuario}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        )}
      </header>

      {/* Menú lateral escritorio */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[300px] bg-zinc-950 border-r border-zinc-800 p-6 flex-col">
        <div className="mb-10">
          {/* 4. Nombre Dinámico en Escritorio */}
          <h1 className="text-3xl font-bold leading-none">
            {nombreApp}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Gestión de horarios
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          {renderizarEnlacesMenu()}
        </nav>

        {/* Información del usuario */}
        {usuario && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
            <p className="text-sm text-zinc-400 mb-1">
              Sesión iniciada
            </p>
            <p className="font-semibold truncate">
              {usuario.nombre}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-1">
              {usuario.rol}
              {usuario.rut ? ` · ${usuario.rut}` : ""}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={cerrarSesionUsuario}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="lg:ml-[300px] min-h-screen p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}