import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

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

import { obtenerToken, obtenerUsuarioSesion } from "../utils/auth"

// Importamos el motor del Tema y el Botón Flotante
import { DemoProvider } from "../context/DemoContext"
import ConfiguradorDemo from "../components/ConfiguradorDemo"

function RedireccionInicial() {
  const token = obtenerToken()
  const usuario = obtenerUsuarioSesion()
  if (!token || !usuario) return <Navigate to="/login" replace />
  if (usuario.rol === "TRABAJADOR") return <Navigate to="/mi-horario" replace />
  return <Navigate to="/panel" replace />
}

export default function RutasApp() {
  return (
    // ¡Envolvemos toda la app en el DemoProvider!
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/" element={<RedireccionInicial />} />

          <Route element={<LayoutPrincipal />}>
            <Route path="/panel" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><PanelPrincipal /></RutaProtegida>} />
            <Route path="/subir-excel" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><SubirExcel /></RutaProtegida>} />
            <Route path="/horarios" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><Horarios /></RutaProtegida>} />
            <Route path="/horarios/:id" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><DetalleHorario /></RutaProtegida>} />
            <Route path="/trabajadores" element={<RutaProtegida rolesPermitidos={["ADMIN"]}><Trabajadores /></RutaProtegida>} />
            <Route path="/mi-horario" element={<RutaProtegida rolesPermitidos={["TRABAJADOR"]}><MiHorario /></RutaProtegida>} />
            <Route path="/solicitudes" element={<RutaProtegida rolesPermitidos={["TRABAJADOR"]}><SolicitudesTrabajador /></RutaProtegida>} />
            <Route path="/ayuda" element={<RutaProtegida rolesPermitidos={["TRABAJADOR"]}><AyudaTrabajador /></RutaProtegida>} />
          </Route>
          <Route path="*" element={<RedireccionInicial />} />
        </Routes>
      </BrowserRouter>
      
      {/* Botón flotante global */}
      <ConfiguradorDemo />
    </DemoProvider>
  )
}