# 🚌 ShiftFlow — Gestión Inteligente de Horarios Operativos

<div align="center">
  <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Estricto-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-Din%C3%A1mico-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-Compilado-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-Desplegado-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

> 📊 **Plataforma de alto rendimiento** diseñada para la planificación, análisis de cobertura y distribución de turnos mensuales para personal operativo, conductores y administrativos en terminales de transporte masivo.

---

## 📌 Índice
1. [🚀 Sobre el Proyecto](#-sobre-el-proyecto)
2. [🌐 Demo en Vivo](#-demo-en-vivo)
3. [📸 Galería del Sistema (Paso a Paso)](#-galer%C3%ADa-del-sistema-paso-a-paso)
4. [🎨 Personalización Dinámica (Control Context API)](#-personalizaci%C3%B3n-din%C3%A1mica-control-context-api)
5. [🛡️ Protección de Autoría (Anti-Tamper DOM)](#%EF%B8%8F-protecci%C3%B3n-de-autor%C3%ADa-anti-tamper-dom)
6. [✨ Funcionalidades de la Demo](#-funcionalidades-de-la-demo)
7. [🛠️ Stack Tecnológico](#%EF%B8%8F-stack-tecnol%C3%B3gico)
8. [⚙️ Instalación y Build Local](#%EF%B8%8F-instalaci%C3%B3n-y-build-local)

---

## 🚀 Sobre el Proyecto
**ShiftFlow** resuelve de forma visual y analítica el conflicto logístico de la asignación de jornadas laborales masivas. El sistema contrasta las planificaciones mensuales cargadas mediante matrices complejas frente a las necesidades operacionales reales del día a día, arrojando alertas tempranas de déficit de personal por cargos, turnos específicos o locaciones físicas.

---

## 🌐 Demo en Vivo
El proyecto se encuentra compilado de forma optimizada y desplegado en servidores edge de Vercel:

🔗 **[Navegar por la Demo Interactiva](https://horario-demo-visual.vercel.app/)**

---

## 📸 Galería del Sistema (Paso a Paso)

### 🔐 1. Control de Acceso Unificado
Pantalla de autenticación diseñada con layouts adaptativos. Cuenta con un bypass inteligente que permite evaluar los flujos completos de los distintos tipos de usuarios sin requerir configuración de bases de datos externas.

<img width="781" height="791" alt="image" src="https://github.com/user-attachments/assets/2972554e-3eff-444a-8b5d-141af20e0230" />


---

### 📊 2. Dashboard de Control Central (Vista Administrador)
Panel analítico principal que transforma arrays de datos planos en información accionable a través de componentes gráficos interactivos de alto volumen.

<img width="1857" height="651" alt="image" src="https://github.com/user-attachments/assets/9d25db11-7913-45a5-b253-6405e2be8a0b" />
<img width="1676" height="853" alt="image" src="https://github.com/user-attachments/assets/d774d7a1-8513-4118-8c39-b364e0e0e4da" />

---

### 🗓️ 3. Sábana de Horarios Operativos
Matriz completa de distribución mensual día por día. Muestra de forma colorizada y categorizada los estados de cada colaborador (Turnos AM, PM, Nocturnos, Libres, Licencias Médicas o Vacaciones), ademas cuenta con opciones de descarga de horario en PDF y Excel.

<img width="1524" height="780" alt="image" src="https://github.com/user-attachments/assets/9f3a12ae-ecf7-48b1-85b9-8a38b1a4e71c" />
<img width="1563" height="806" alt="image" src="https://github.com/user-attachments/assets/48841a5d-40ce-4a96-b64e-fb0f001823e2" />

---

### 👤 4. Panel Autónomo del Colaborador (Vista Trabajador)
Interfaz simplificada donde el trabajador puede consultar de manera exclusiva sus turnos, ver resúmenes estadísticos de sus jornadas y descargar sus reportes generados en caliente de forma nativa.

<img width="1574" height="933" alt="image" src="https://github.com/user-attachments/assets/9eafc976-439a-4c8c-a746-bd16bc924353" />

---

## 🎨 Personalización Dinámica (Control Context API)
La plataforma integra un **Configurador de Entorno en tiempo real** (accesible mediante el widget flotante inferior) que demuestra el control avanzado de estados globales y reactividad en la UI:

* 📝 **Inyección de Identidad:** Permite renombrar toda la suite corporativa de forma dinámica.
* 📦 **Encapsulamiento de Logos:** Reemplazo de componentes SVG (`Lucide`) en caliente a lo largo de toda la estructura de navegación.
* 🌈 **Tematización mediante Variables CSS:** Modificación instantánea de paletas cromáticas completas (Tailwind Override), tipografías del sistema y variantes oscuras avanzadas (Slate, Zinc, Negro Absoluto OLED) con persistencia en `LocalStorage`.

---

## 🛡️ Protección de Autoría (Anti-Tamper DOM)
Para garantizar la integridad y auditoría del portafolio, el núcleo inyecta un módulo de seguridad invisible:
* 🧬 **Ofuscación Crítica:** Los metadatos de autoría se procesan cifrados en memoria para evitar rastreos directos en texto plano.
* 🔄 **MutationObserver del DOM:** Si un agente externo intenta remover o alterar la firma visual mediante herramientas de desarrollo (`F12`), el sistema detecta la mutación del árbol HTML de manera reactiva y reconstruye el nodo de protección en milisegundos.

---

## ✨ Funcionalidades de la Demo
* **[SI] Búsqueda indexada:** Filtro multifactorial reactivo en tablas por RUT, Nombre o ID.
* **[SI] Exportación Binaria:** Generación en el cliente de hojas de cálculo **Excel (.xlsx)** y documentos **PDF** estructurados usando procesamiento asíncrono.
* **[NO] Mutación en Servidor:** Las acciones simulan respuestas exitosas del backend (0ms de latencia), pero no alteran ficheros raíz.

---

## 🛠️ Stack Tecnológico
* **Frontend:** React 18, TypeScript (Strict Mode), Vite.
* **Estilos y Gráficos:** Tailwind CSS, Recharts, Lucide React.
* **Motores de Reportes:** SheetJS (XLSX), jsPDF, jsPDF-AutoTable.
* **Enrutamiento:** React Router DOM.

---

## ⚙️ Instalación y Build Local

1. Instalar dependencias mediante el gestor de paquetes optimizado:
   ```bash
   pnpm install
