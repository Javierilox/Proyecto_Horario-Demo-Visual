import React, { createContext, useContext, useState, useEffect } from "react"

type ThemeColor = "blue" | "emerald" | "violet" | "rose" | "amber"

interface DemoContextType {
  nombreApp: string
  setNombreApp: (nombre: string) => void
  colorTema: ThemeColor
  setColorTema: (color: ThemeColor) => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

const paletas = {
  blue: { 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554" },
  emerald: { 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" },
  violet: { 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065" },
  rose: { 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519" },
  amber: { 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" },
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [nombreApp, setNombreApp] = useState(() => localStorage.getItem("demo_nombreApp") || "ShiftFlow")
  const [colorTema, setColorTema] = useState<ThemeColor>(() => (localStorage.getItem("demo_colorTema") as ThemeColor) || "blue")

  // Guardar preferencias y aplicar inyección de CSS global
  useEffect(() => {
    localStorage.setItem("demo_nombreApp", nombreApp)
    localStorage.setItem("demo_colorTema", colorTema)

    const p = paletas[colorTema]
    const cssInject = `
      :root {
        --t-200: ${p[200]}; --t-300: ${p[300]}; --t-400: ${p[400]}; --t-500: ${p[500]};
        --t-600: ${p[600]}; --t-700: ${p[700]}; --t-800: ${p[800]}; --t-900: ${p[900]}; --t-950: ${p[950]};
      }
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
      .shadow-blue-950\\/30 { box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--t-950) 30%, transparent) !important; }
    `

    // Crear o actualizar la etiqueta <style> en el Head
    let styleTag = document.getElementById("demo-theme-override")
    if (!styleTag) {
      styleTag = document.createElement("style")
      styleTag.id = "demo-theme-override"
      document.head.appendChild(styleTag)
    }
    styleTag.innerHTML = cssInject
  }, [nombreApp, colorTema])

  return (
    <DemoContext.Provider value={{ nombreApp, setNombreApp, colorTema, setColorTema }}>
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => {
  const context = useContext(DemoContext)
  if (!context) throw new Error("useDemo debe usarse dentro de un DemoProvider")
  return context
}