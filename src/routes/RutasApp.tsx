import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import InicioSesion from "../pages/InicioSesion"
import PanelPrincipal from "../pages/PanelPrincipal"
import SubirExcel from "../pages/SubirExcel"
import Horarios from "../pages/Horarios"
import DetalleHorario from "../pages/DetalleHorario"
import Trabajadores from "../pages/Trabajadores"
import MiHorario from "../pages/MiHorario"
import SolicitudesTrabajador from "../pages/SolicitudesTrabajador"
import AyudaTrabajador from "../pages/AyudaTrabajador"

import LayoutPrincipal from "../layouts/LayoutPrincipal"
import RutaProtegida from "./RutaProtegida"

import {
  obtenerToken,
  obtenerUsuarioSesion,
} from "../utils/auth"

/**
 * Redirecciona al usuario según su sesión y rol.
 *
 * Sin sesión    -> Login
 * ADMIN         -> Panel principal
 * TRABAJADOR    -> Mi horario
 */
function RedireccionInicial() {
  const token = obtenerToken()
  const usuario = obtenerUsuarioSesion()

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.rol === "TRABAJADOR") {
    return <Navigate to="/mi-horario" replace />
  }

  return <Navigate to="/panel" replace />
}

export default function RutasApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<InicioSesion />} />

        {/* Ruta raíz inteligente */}
        <Route path="/" element={<RedireccionInicial />} />

        {/* Rutas con layout principal */}
        <Route element={<LayoutPrincipal />}>
          {/* Rutas exclusivas para ADMIN */}
          <Route
            path="/panel"
            element={
              <RutaProtegida rolesPermitidos={["ADMIN"]}>
                <PanelPrincipal />
              </RutaProtegida>
            }
          />

          <Route
            path="/subir-excel"
            element={
              <RutaProtegida rolesPermitidos={["ADMIN"]}>
                <SubirExcel />
              </RutaProtegida>
            }
          />

          {/* Vista general de horarios */}
          <Route
            path="/horarios"
            element={
              <RutaProtegida rolesPermitidos={["ADMIN"]}>
                <Horarios />
              </RutaProtegida>
            }
          />

          {/*
            Vista detalle del horario individual.

            Importante:
            Usamos :id porque DetalleHorario probablemente lee:
            const { id } = useParams()

            Si usamos :idRegistro, entonces id llega como undefined
            y aparece el error "ID no válido".
          */}
          <Route
            path="/horarios/:id"
            element={
              <RutaProtegida rolesPermitidos={["ADMIN"]}>
                <DetalleHorario />
              </RutaProtegida>
            }
          />

          <Route
            path="/trabajadores"
            element={
              <RutaProtegida rolesPermitidos={["ADMIN"]}>
                <Trabajadores />
              </RutaProtegida>
            }
          />

          {/* Rutas exclusivas para TRABAJADOR */}
          <Route
            path="/mi-horario"
            element={
              <RutaProtegida rolesPermitidos={["TRABAJADOR"]}>
                <MiHorario />
              </RutaProtegida>
            }
          />

          <Route
            path="/solicitudes"
            element={
              <RutaProtegida rolesPermitidos={["TRABAJADOR"]}>
                <SolicitudesTrabajador />
              </RutaProtegida>
            }
          />

          <Route
            path="/ayuda"
            element={
              <RutaProtegida rolesPermitidos={["TRABAJADOR"]}>
                <AyudaTrabajador />
              </RutaProtegida>
            }
          />
        </Route>

        {/* Cualquier ruta inexistente vuelve al inicio inteligente */}
        <Route path="*" element={<RedireccionInicial />} />
      </Routes>
    </BrowserRouter>
  )
}