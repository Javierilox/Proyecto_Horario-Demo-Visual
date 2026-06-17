import clienteApi from "./clienteApi"
import type { RespuestaMetricasDashboard } from "../types/metrica"

/**
 * Consulta las métricas del dashboard.
 *
 * Permite filtrar por:
 * - Fecha
 * - Lugar
 * - Cargo
 * - Turno
 */
export const obtenerMetricasDashboardServicio = async (
  fecha = "",
  lugar = "TODOS",
  cargo = "TODOS",
  turno = "TODOS"
): Promise<RespuestaMetricasDashboard> => {
  const { data } = await clienteApi.get<RespuestaMetricasDashboard>(
    "/metricas/dashboard",
    {
      params: {
        fecha,
        lugar,
        cargo,
        turno,
      },
    }
  )

  return data
}