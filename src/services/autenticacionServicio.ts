import clienteApi from "./clienteApi"

import type {
  CredencialesLogin,
  RespuestaLogin,
  Usuario,
} from "../types/usuario"

export const iniciarSesionServicio = async (
  credenciales: CredencialesLogin
): Promise<RespuestaLogin> => {
  const { data } = await clienteApi.post<RespuestaLogin>(
    "/auth/login",
    credenciales
  )

  return data
}

export const guardarSesion = (token: string, usuario: Usuario) => {
  localStorage.setItem("tokenShiftFlow", token)
  localStorage.setItem("usuarioShiftFlow", JSON.stringify(usuario))
}

export const obtenerToken = () => {
  return localStorage.getItem("tokenShiftFlow")
}

export const obtenerUsuarioActual = (): Usuario | null => {
  const usuarioGuardado = localStorage.getItem("usuarioShiftFlow")

  if (!usuarioGuardado) {
    return null
  }

  try {
    return JSON.parse(usuarioGuardado) as Usuario
  } catch {
    return null
  }
}

export const cerrarSesion = () => {
  localStorage.removeItem("tokenShiftFlow")
  localStorage.removeItem("usuarioShiftFlow")
}