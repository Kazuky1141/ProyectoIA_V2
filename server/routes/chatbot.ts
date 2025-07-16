import { RequestHandler } from "express";
import { ChatbotRequest, ChatbotResponse } from "@shared/api";

export const handleChatbot: RequestHandler = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { entrada } = req.body as ChatbotRequest;

    if (!entrada || typeof entrada !== "string") {
      console.log("Missing or invalid entrada field");
      return res.status(400).json({ error: "entrada field is required" });
    }

    console.log("Processing message:", entrada);
    // TODO: Replace this with actual API call to Colab
    // For now, we'll use the same mock logic as the frontend
    const response = await processMessage(entrada);

    res.json(response);
  } catch (error) {
    console.error("Error processing chatbot request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mock processing function - replace with actual Colab API integration
async function processMessage(message: string): Promise<ChatbotResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simple keyword detection for technical vs non-technical
  const techKeywords = [
    "pc",
    "computadora",
    "ordenador",
    "laptop",
    "windows",
    "mac",
    "linux",
    "internet",
    "wifi",
    "red",
    "conexion",
    "router",
    "modem",
    "software",
    "programa",
    "aplicacion",
    "driver",
    "controlador",
    "hardware",
    "memoria",
    "ram",
    "disco",
    "cpu",
    "procesador",
    "error",
    "problema",
    "falla",
    "no funciona",
    "lento",
    "virus",
    "malware",
    "actualizar",
    "instalar",
  ];

  const isTechnical = techKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword),
  );

  if (isTechnical) {
    return {
      entrada: message,
      categoria: "problema_tecnico",
      diagnostico: generateTechnicalDiagnosis(message),
      basado_en_internet:
        "Según la información encontrada en internet, este tipo de problemas suelen estar relacionados con configuraciones del sistema, controladores desactualizados o conflictos de software. Las soluciones más efectivas incluyen verificar la compatibilidad del sistema y realizar las actualizaciones correspondientes.",
      fuentes: [
        "https://support.microsoft.com/troubleshooting",
        "https://help.ubuntu.com/community/troubleshooting",
        "https://support.apple.com/technical-support",
      ],
    };
  } else {
    return {
      entrada: message,
      categoria: "no_tecnico",
      respuesta:
        "Disculpa si no pude responder como esperabas. Soy un asistente técnico, y estoy aquí para ayudarte con problemas como errores de software, redes lentas, configuración de programas, problemas de hardware o instalación de aplicaciones. ¿Quieres que te apoye con algún problema técnico?",
    };
  }
}

// Generate contextual technical diagnosis based on keywords
function generateTechnicalDiagnosis(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("no prende") ||
    lowerMessage.includes("no enciende")
  ) {
    return "Para problemas de encendido, te recomiendo: 1) Verifica que el cable de alimentación esté conectado correctamente y que el tomacorriente funcione. 2) Revisa que el botón de encendido esté funcionando. 3) Si es una laptop, conecta el cargador y espera unos minutos. 4) Intenta un reset de hardware desconectando todos los cables por 30 segundos.";
  }

  if (lowerMessage.includes("lento") || lowerMessage.includes("lenta")) {
    return "Para mejorar el rendimiento: 1) Verifica el uso de CPU y memoria en el Administrador de Tareas. 2) Cierra programas innecesarios que se ejecutan al inicio. 3) Ejecuta un análisis de disco y desfragmentación. 4) Considera aumentar la memoria RAM si está en uso constante. 5) Revisa si hay malware con un antivirus actualizado.";
  }

  if (
    lowerMessage.includes("internet") ||
    lowerMessage.includes("wifi") ||
    lowerMessage.includes("conexion")
  ) {
    return "Para problemas de conexión: 1) Reinicia tu router/modem desconectándolo por 30 segundos. 2) Verifica que otros dispositivos se conecten correctamente. 3) Olvida y vuelve a conectar la red WiFi. 4) Actualiza los controladores de red. 5) Ejecuta el solucionador de problemas de red de Windows.";
  }

  if (lowerMessage.includes("error") || lowerMessage.includes("falla")) {
    return "Para resolver errores del sistema: 1) Anota el código de error específico si aparece. 2) Reinicia el equipo en modo seguro. 3) Ejecuta el verificador de archivos del sistema (sfc /scannow). 4) Revisa el Visor de Eventos para más detalles. 5) Considera restaurar el sistema a un punto anterior.";
  }

  // Generic technical response
  return "He analizado tu consulta técnica. Te recomiendo seguir estos pasos generales: 1) Identifica exactamente cuándo ocurre el problema. 2) Reinicia el dispositivo o aplicación. 3) Verifica si hay actualizaciones disponibles. 4) Revisa la configuración relacionada. 5) Si persiste, considera reinstalar el software o contactar soporte especializado.";
}
