import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import {
  obtenerToken,
  obtenerUsuarioSesion,
  type RolUsuarioFrontend,
} from "../utils/auth"

interface RutaProtegidaProps {
  children: ReactNode
  rolesPermitidos?: RolUsuarioFrontend[]
}

/**
 * Protege vistas según token y rol.
 */
export default function RutaProtegida({
  children,
  rolesPermitidos,
}: RutaProtegidaProps) {
  const token = obtenerToken()
  const usuario = obtenerUsuarioSesion()

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    if (usuario.rol === "TRABAJADOR") {
      return <Navigate to="/mi-horario" replace />
    }

    return <Navigate to="/panel" replace />
  }

  return <>{children}</>
}