export type RolUsuario = "ADMIN" | "TRABAJADOR"

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: RolUsuario
}

export interface CredencialesLogin {
  correo: string
  password: string
}

export interface RespuestaLogin {
  mensaje: string
  token: string
  usuario: Usuario
}