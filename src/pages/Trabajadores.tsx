import { useState } from "react"
import { Users, Search, CheckCircle, Clock } from "lucide-react"

import { mockTrabajadores } from "../data/mockData"

export default function Trabajadores() {
  const [busqueda, setBusqueda] = useState("")

  const trabajadoresFiltrados = mockTrabajadores.filter((t) => 
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    t.rut.includes(busqueda) ||
    t.cargo.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col gap-5 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Trabajadores</h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
            Directorio del personal operativo y administrativo. (Modo Demo Activo)
          </p>
        </div>
        <div className="bg-blue-600/10 text-blue-400 p-4 rounded-2xl hidden sm:block">
          <Users size={28} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre, RUT o cargo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white pl-11 pr-4 py-2.5 rounded-xl outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-950 text-zinc-400">
                <th className="py-4 px-5 font-medium border-b border-zinc-800">Nombre y RUT</th>
                <th className="py-4 px-5 font-medium border-b border-zinc-800">Contacto</th>
                <th className="py-4 px-5 font-medium border-b border-zinc-800">Cargo y Lugar</th>
                <th className="py-4 px-5 font-medium border-b border-zinc-800">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {trabajadoresFiltrados.length > 0 ? (
                trabajadoresFiltrados.map((trabajador) => (
                  <tr key={trabajador.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-white">{trabajador.nombre}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{trabajador.rut}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-zinc-300">{trabajador.correo}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-zinc-300">{trabajador.cargo}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{trabajador.lugar}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${trabajador.estado === "Activo" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {trabajador.estado === "Activo" ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {trabajador.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-12 px-5 text-center text-zinc-500" colSpan={4}>
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-zinc-600 mb-3" />
                      <p>No se encontraron trabajadores que coincidan con "{busqueda}".</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}