import { Navigate, Outlet } from "react-router-dom"

import { obtenerUsuarioActual } from "../services/autenticacionServicio"

export default function RutaAdmin() {
  const usuario = obtenerUsuarioActual()

  if (!usuario) {
    return <Navigate to="/" replace />
  }

  if (usuario.rol !== "ADMIN") {
    return <Navigate to="/horarios" replace />
  }

  return <Outlet />
}