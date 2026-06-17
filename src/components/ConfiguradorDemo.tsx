import { useState } from "react"
import { Palette, X, Type, Check, PaintBucket, Type as FontIcon, Image as ImageIcon } from "lucide-react"
import { useDemo } from "../context/DemoContext"

export default function ConfiguradorDemo() {
  const [abierto, setAbierto] = useState(false)
  const { 
    nombreApp, setNombreApp, colorTema, setColorTema, 
    fondoApp, setFondoApp, fuenteApp, setFuenteApp, 
    iconoApp, setIconoApp 
  } = useDemo()

  const colores = [
    { id: "blue", color: "bg-blue-600" }, { id: "emerald", color: "bg-emerald-600" },
    { id: "violet", color: "bg-violet-600" }, { id: "rose", color: "bg-rose-600" }, { id: "amber", color: "bg-amber-500" }
  ] as const

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setAbierto(!abierto)}
        className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-full shadow-2xl border border-zinc-700 transition-all hover:scale-105 active:scale-95"
      >
        <Palette size={24} className="text-zinc-300" />
      </button>

      {abierto && (
        <div className="absolute bottom-16 right-0 w-[340px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-zinc-400" />
              <h3 className="font-semibold text-white">Configuración Demo</h3>
            </div>
            <button onClick={() => setAbierto(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Nombre */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                <Type size={14} /> Nombre de la App
              </label>
              <input
                type="text"
                value={nombreApp}
                onChange={(e) => setNombreApp(e.target.value)}
                maxLength={20}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Icono / Favicon */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                <ImageIcon size={14} /> Logo e Icono Web
              </label>
              <select 
                value={iconoApp} 
                onChange={(e) => setIconoApp(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
              >
                <option value="shield">🛡️ Escudo de Seguridad</option>
                <option value="bus">🚌 Autobús Corporativo</option>
                <option value="calendar">📅 Calendario de Turnos</option>
                <option value="briefcase">💼 Maletín Empresarial</option>
              </select>
            </div>

            {/* Color Primario */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                <PaintBucket size={14} /> Color Principal
              </label>
              <div className="flex gap-2">
                {colores.map((tema) => (
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

            {/* Fondo */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                Fondo Nocturno
              </label>
              <select 
                value={fondoApp} 
                onChange={(e) => setFondoApp(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
              >
                <option value="zinc">Gris Zinc (Predeterminado)</option>
                <option value="slate">Azul Pizarra Oscuro</option>
                <option value="neutral">Negro Absoluto (OLED)</option>
              </select>
            </div>

            {/* Tipografía */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                <FontIcon size={14} /> Tipografía
              </label>
              <select 
                value={fuenteApp} 
                onChange={(e) => setFuenteApp(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
              >
                <option value="modern">Moderna (Sans-serif)</option>
                <option value="elegant">Elegante (Serif)</option>
                <option value="tech">Técnica (Monospace)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}