import React, { createContext, useContext, useState, useEffect } from "react"
import { ShieldCheck, Bus, CalendarDays, Briefcase } from "lucide-react"

type ThemeColor = "blue" | "emerald" | "violet" | "rose" | "amber"
type ThemeBackground = "zinc" | "slate" | "neutral"
type ThemeFont = "modern" | "elegant" | "tech"
type ThemeIcon = "shield" | "bus" | "calendar" | "briefcase"

interface DemoContextType {
  nombreApp: string
  setNombreApp: (nombre: string) => void
  colorTema: ThemeColor
  setColorTema: (color: ThemeColor) => void
  fondoApp: ThemeBackground
  setFondoApp: (fondo: ThemeBackground) => void
  fuenteApp: ThemeFont
  setFuenteApp: (fuente: ThemeFont) => void
  iconoApp: ThemeIcon
  setIconoApp: (icono: ThemeIcon) => void
  LogoComponent: React.ElementType
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

const paletas = {
  blue: { 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  emerald: { 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  violet: { 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  rose: { 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
  amber: { 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
}

const fondos = {
  zinc: { 950: "#09090b", 900: "#18181b", 800: "#27272a", 700: "#3f3f46" }, // Original oscuro
  slate: { 950: "#020617", 900: "#0f172a", 800: "#1e293b", 700: "#334155" }, // Azulado oscuro
  neutral: { 950: "#0a0a0a", 900: "#171717", 800: "#262626", 700: "#404040" } // Negro absoluto
}

const fuentes = {
  modern: "system-ui, -apple-system, sans-serif",
  elegant: "Georgia, serif",
  tech: "ui-monospace, SFMono-Regular, monospace"
}

const iconosLucide = {
  shield: ShieldCheck, bus: Bus, calendar: CalendarDays, briefcase: Briefcase
}

const faviconsEmoji = {
  shield: "🛡️", bus: "🚌", calendar: "📅", briefcase: "💼"
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [nombreApp, setNombreApp] = useState(() => localStorage.getItem("demo_nombreApp") || "ShiftFlow")
  const [colorTema, setColorTema] = useState<ThemeColor>(() => (localStorage.getItem("demo_colorTema") as ThemeColor) || "blue")
  const [fondoApp, setFondoApp] = useState<ThemeBackground>(() => (localStorage.getItem("demo_fondoApp") as ThemeBackground) || "zinc")
  const [fuenteApp, setFuenteApp] = useState<ThemeFont>(() => (localStorage.getItem("demo_fuenteApp") as ThemeFont) || "modern")
  const [iconoApp, setIconoApp] = useState<ThemeIcon>(() => (localStorage.getItem("demo_iconoApp") as ThemeIcon) || "shield")

  useEffect(() => {
    localStorage.setItem("demo_nombreApp", nombreApp)
    localStorage.setItem("demo_colorTema", colorTema)
    localStorage.setItem("demo_fondoApp", fondoApp)
    localStorage.setItem("demo_fuenteApp", fuenteApp)
    localStorage.setItem("demo_iconoApp", iconoApp)

    // 1. Cambiar Título de Pestaña
    document.title = nombreApp

    // 2. Cambiar Favicon de Pestaña dinámicamente
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }
    link.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${faviconsEmoji[iconoApp]}</text></svg>`

    // 3. Inyección CSS Global (Colores, Fondos y Fuentes)
    const p = paletas[colorTema]
    const f = fondos[fondoApp]
    
    const cssInject = `
      :root {
        --demo-font: ${fuentes[fuenteApp]};
        --t-200: ${p[200]}; --t-300: ${p[300]}; --t-400: ${p[400]}; --t-500: ${p[500]};
        --t-600: ${p[600]}; --t-700: ${p[700]}; --t-800: ${p[800]}; --t-900: ${p[900]}; --t-950: ${p[950]};
      }
      html, body, input, button, select, textarea { font-family: var(--demo-font) !important; }
      
      /* Sobreescribir Fondos Tailwind Globales */
      .bg-zinc-950 { background-color: ${f[950]} !important; }
      .bg-zinc-900 { background-color: ${f[900]} !important; }
      .bg-zinc-800 { background-color: ${f[800]} !important; }
      .border-zinc-800 { border-color: ${f[800]} !important; }
      .border-zinc-700 { border-color: ${f[700]} !important; }
      .hover\\:bg-zinc-800:hover { background-color: ${f[800]} !important; }
      .hover\\:bg-zinc-700:hover { background-color: ${f[700]} !important; }

      /* Sobreescribir Colores Primarios */
      .bg-blue-600 { background-color: var(--t-600) !important; }
      .bg-blue-800 { background-color: var(--t-800) !important; }
      .bg-blue-900 { background-color: var(--t-900) !important; }
      .hover\\:bg-blue-700:hover { background-color: var(--t-700) !important; }
      .disabled\\:bg-blue-900:disabled { background-color: var(--t-900) !important; }
      .text-blue-200 { color: var(--t-200) !important; }
      .text-blue-300 { color: var(--t-300) !important; }
      .text-blue-400 { color: var(--t-400) !important; }
      .text-blue-600 { color: var(--t-600) !important; }
      .border-blue-500 { border-color: var(--t-500) !important; }
      .focus\\:border-blue-500:focus { border-color: var(--t-500) !important; }
      .focus\\:ring-blue-500:focus { --tw-ring-color: var(--t-500) !important; }
      .bg-blue-600\\/10 { background-color: color-mix(in srgb, var(--t-600) 10%, transparent) !important; }
      .bg-blue-500\\/10 { background-color: color-mix(in srgb, var(--t-500) 10%, transparent) !important; }
      .border-blue-500\\/30 { border-color: color-mix(in srgb, var(--t-500) 30%, transparent) !important; }
    `

    let styleTag = document.getElementById("demo-theme-override")
    if (!styleTag) {
      styleTag = document.createElement("style")
      styleTag.id = "demo-theme-override"
      document.head.appendChild(styleTag)
    }
    styleTag.innerHTML = cssInject
  }, [nombreApp, colorTema, fondoApp, fuenteApp, iconoApp])

  const LogoComponent = iconosLucide[iconoApp]

  return (
    <DemoContext.Provider value={{ 
      nombreApp, setNombreApp, colorTema, setColorTema, 
      fondoApp, setFondoApp, fuenteApp, setFuenteApp, 
      iconoApp, setIconoApp, LogoComponent 
    }}>
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => {
  const context = useContext(DemoContext)
  if (!context) throw new Error("useDemo debe usarse dentro de un DemoProvider")
  return context
}