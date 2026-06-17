import { HelpCircle, Mail, MessageCircle } from "lucide-react"

/**
 * Vista de ayuda para trabajadores.
 *
 * Permite contactar al administrador o jefatura por correo.
 * Más adelante este correo puede venir desde configuración del sistema.
 */
export default function AyudaTrabajador() {
  const correoSoporte = "jefatura@empresa.cl"

  const asunto = encodeURIComponent("Solicitud de ayuda - ShiftFlow")
  const cuerpo = encodeURIComponent(
    "Hola, necesito ayuda con mi horario, una solicitud de vacaciones o una licencia médica."
  )

  const enlaceCorreo = `mailto:${correoSoporte}?subject=${asunto}&body=${cuerpo}`

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Ayuda
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
          Si tienes problemas con tu horario o necesitas hacer una consulta,
          puedes contactar al administrador o jefatura.
        </p>
      </div>

      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl">
            <HelpCircle size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Contactar soporte
            </h2>

            <p className="text-sm text-zinc-400">
              Se abrirá tu cliente de correo con un mensaje preparado.
            </p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-5">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Mail size={20} />
            <span className="text-sm">Correo de contacto</span>
          </div>

          <p className="text-white font-semibold">
            {correoSoporte}
          </p>
        </div>

        <a
          href={enlaceCorreo}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition-all"
        >
          <MessageCircle size={18} />
          Enviar correo
        </a>
      </section>
    </div>
  )
}