import { useState } from "react"
import { Palette, X, Type, Check } from "lucide-react"
import { useDemo } from "../context/DemoContext"

export default function ConfiguradorDemo() {
  const [abierto, setAbierto] = useState(false)
  const { nombreApp, setNombreApp, colorTema, setColorTema } = useDemo()

  const temas = [
    { id: "blue", color: "bg-blue-600" },
    { id: "emerald", color: "bg-emerald-600" },
    { id: "violet", color: "bg-violet-600" },
    { id: "rose", color: "bg-rose-600" },
    { id: "amber", color: "bg-amber-500" },
  ] as const

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón Flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-2xl border border-zinc-700 transition-all hover:scale-105 active:scale-95"
        title="Personalizar Demo"
      >
        <Palette size={24} className="text-zinc-300" />
      </button>

      {/* Panel de Configuración */}
      {abierto && (
        <div className="absolute bottom-16 right-0 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-zinc-400" />
              <h3 className="font-semibold text-white">Configurador Demo</h3>
            </div>
            <button onClick={() => setAbierto(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Cambiar Nombre */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Nombre de la App
              </label>
              <div className="relative">
                <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={nombreApp}
                  onChange={(e) => setNombreApp(e.target.value)}
                  maxLength={20}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white pl-9 pr-3 py-2 rounded-lg outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Cambiar Color */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                Color Principal
              </label>
              <div className="flex gap-3">
                {temas.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => setColorTema(tema.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${tema.color} ${colorTema === tema.id ? "ring-2 ring-offset-2 ring-offset-zinc-950 ring-white scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"}`}
                  >
                    {colorTema === tema.id && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}