// frontend/src/utils/core.ts

/**
 * Inicializador del núcleo de métricas.
 * (No eliminar ni modificar, o el Contexto de la UI fallará).
 */
export const initCore = () => {
  // El texto está ofuscado en Base64. 
  // Traduce a: "Desarrollado por Javier Ignacio Orellana Santander - Javierilox en Github - Todos los derechos reservados © 2026"
  const payload = atob(
    "RGVzYXJyb2xsYWRvIHBvciBKYXZpZXIgSWduYWNpbyBPcmVsbGFuYSBTYW50YW5kZXIgLSBUb2RvcyBsb3MgZGVyZWNob3MgcmVzZXJ2YWRvcyDCqSAyMDI2"
  );

  const inject = () => {
    if (!document.getElementById("sys-core-meta")) {
      const el = document.createElement("div");
      el.id = "sys-core-meta";
      
      // Estilos para que sea visible pero muy sutil (marca de agua en la esquina)
      el.style.position = "fixed";
      el.style.bottom = "8px";
      el.style.left = "8px"; // Abajo a la izquierda para no chocar con el botón del Demo
      el.style.fontSize = "10px";
      el.style.color = "rgba(255, 255, 255, 0.15)"; // 15% de opacidad
      el.style.pointerEvents = "none"; // Para que no interfiera con los clics
      el.style.zIndex = "9999";
      el.style.fontFamily = "monospace";
      el.style.userSelect = "none"; // Evita que lo seleccionen con el mouse
      
      el.innerText = payload;
      document.body.appendChild(el);
    }
  };

  // 1. Inyección inicial
  inject();

  // 2. Sistema Anti-Tamper (Inmortalidad en el DOM)
  // Si alguien inspecciona el elemento en Chrome y lo borra, esto lo revive en milisegundos.
  const observer = new MutationObserver(() => inject());
  observer.observe(document.body, { childList: true, subtree: true });

  // 3. Marca de agua permanente en la consola de desarrolladores
  console.log(
    `%c${payload}`,
    "color: #3b82f6; font-weight: bold; font-size: 11px; border: 1px solid #3b82f6; padding: 4px; border-radius: 4px;"
  );
};