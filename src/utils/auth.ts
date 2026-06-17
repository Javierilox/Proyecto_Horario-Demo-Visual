/**
 * Roles usados por el frontend.
 */
export type RolUsuarioFrontend = "ADMIN" | "TRABAJADOR"

/**
 * Estructura del usuario guardado después del login.
 */
export interface UsuarioSesion {
  id: number
  nombre: string
  correo: string
  rol: RolUsuarioFrontend
  rut?: string | null
}

/**
 * Obtiene el token guardado en localStorage.
 */
export const obtenerToken = () => {
  return localStorage.getItem("token")
}

/**
 * Obtiene el usuario guardado en localStorage.
 */
export const obtenerUsuarioSesion = (): UsuarioSesion | null => {
  const usuarioGuardado = localStorage.getItem("usuario")

  if (!usuarioGuardado) {
    return null
  }

  try {
    return JSON.parse(usuarioGuardado) as UsuarioSesion
  } catch {
    return null
  }
}

/**
 * Cierra la sesión local del usuario.
 */
export const cerrarSesion = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")
}