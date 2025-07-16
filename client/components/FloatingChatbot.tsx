import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ChatbotResponse } from "@shared/api";
import {
  Send,
  Bot,
  User,
  ExternalLink,
  CheckCircle,
  X,
  MessageCircle,
  Minimize2,
  Maximize2,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTechnicalText } from "@/lib/textParser";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content:
        "¡Hola! Soy tu asistente técnico especializado. Estoy aquí para ayudarte con problemas de hardware, software, redes y más. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "error"
  >("connected");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot);
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageToSend = inputValue;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setConnectionStatus("connecting");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = apiBaseUrl ? `${apiBaseUrl}/chatbot` : "/api/chatbot";

    try {
      console.log("Making API call to:", apiUrl);
      console.log("Sending message:", messageToSend);

      const requestBody = { entrada: messageToSend };
      console.log("Request body:", requestBody);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiBaseUrl && apiBaseUrl.includes("ngrok")) {
        headers["ngrok-skip-browser-warning"] = "true";
      }

      console.log("Request headers:", headers);

      // Try external API
      console.log("🚀 Enviando solicitud a la API...");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Error response:", responseText);
        throw new Error(
          `API Error (${response.status}): ${responseText || response.statusText}`,
        );
      }

      let chatbotResponse: ChatbotResponse;
      try {
        chatbotResponse = JSON.parse(responseText);
        console.log("Received response:", chatbotResponse);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error(`Invalid JSON response: ${parseError}`);
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          chatbotResponse.categoria === "problema_tecnico"
            ? chatbotResponse.diagnostico
            : chatbotResponse.respuesta,
        sender: "bot",
        timestamp: new Date(),
        response: chatbotResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
      setConnectionStatus("connected");
    } catch (error) {
      setConnectionStatus("error");

      // Detailed error logging in Spanish
      console.group("🚨 ERROR DETALLADO DEL CHATBOT");
      console.error("❌ Error al enviar mensaje:", error);
      console.error(
        "📍 URL de la API:",
        apiBaseUrl ? `${apiBaseUrl}/chatbot` : "/api/chatbot",
      );
      console.error("📦 Mensaje enviado:", messageToSend);

      if (error instanceof Error) {
        console.error("🏷️ Tipo de error:", error.name);
        console.error("💬 Mensaje del error:", error.message);
        console.error("📚 Stack trace:", error.stack);

        if (error.name === "AbortError") {
          console.error(
            "⏱️ DETALLE: La solicitud fue cancelada por timeout (15 segundos)",
          );
          console.error(
            "🔍 ANÁLISIS: El servidor tardó demasiado en responder",
          );
          console.error("💡 SOLUCIONES POSIBLES:");
          console.error(
            "   - Verificar que el servidor ngrok esté funcionando",
          );
          console.error("   - Comprobar la velocidad de internet");
          console.error("   - El servidor puede estar sobrecargado");
        } else if (error.message.includes("Failed to fetch")) {
          console.error(
            "🌐 DETALLE: Error de red - no se pudo conectar al servidor",
          );
          console.error("💡 POSIBLES CAUSAS:");
          console.error("   - El servidor ngrok está desconectado");
          console.error("   - Problemas de conectividad a internet");
          console.error("   - CORS bloqueado por el navegador");
          console.error("   - Firewall o proxy bloqueando la solicitud");
        }
      }
      console.groupEnd();

      // Show user-friendly error message
      let errorContent =
        "Lo siento, no pude procesar tu mensaje en este momento.";

      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          errorContent =
            "🌐 No pude conectarme al servidor. Verifica que la API esté funcionando.";
        } else if (error.message.includes("404")) {
          errorContent =
            "❌ El servicio de chat no está disponible (Error 404).";
        } else if (error.message.includes("500")) {
          errorContent =
            "⚠️ Error interno del servidor (Error 500). Intenta de nuevo en unos momentos.";
        } else {
          errorContent = `💥 Error: ${error.message}`;
        }
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (connectionStatus === "connecting") {
        setConnectionStatus("connected");
      }
    }
  };

  const testConnection = async () => {
    const testMessage = "Hola, esto es una prueba de conexión";
    setConnectionStatus("connecting");

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const apiUrl = apiBaseUrl ? `${apiBaseUrl}/chatbot` : "/api/chatbot";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiBaseUrl && apiBaseUrl.includes("ngrok")) {
        headers["ngrok-skip-browser-warning"] = "true";
      }

      console.log("Testing connection with:", { entrada: testMessage });
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ entrada: testMessage }),
      });

      if (response.ok) {
        setConnectionStatus("connected");
        const testResponse: ChatMessage = {
          id: Date.now().toString(),
          content:
            "✅ Conexión exitosa! El servicio está funcionando correctamente.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, testResponse]);
      } else {
        throw new Error("Test failed");
      }
    } catch (error) {
      console.log("External API test failed, trying local...");
      try {
        console.log("Testing local fallback with:", { entrada: testMessage });
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entrada: testMessage }),
        });

        if (response.ok) {
          setConnectionStatus("connected");
          const testResponse: ChatMessage = {
            id: Date.now().toString(),
            content: "✅ Conexión local exitosa! Usando servidor de respaldo.",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, testResponse]);
        } else {
          throw new Error("Local test also failed");
        }
      } catch (localError) {
        setConnectionStatus("error");
        const errorResponse: ChatMessage = {
          id: Date.now().toString(),
          content: "❌ No se pudo establecer conexión con ningún servidor.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    }
  };

  const tryLocalFallback = async (messageToSend: string) => {
    try {
      console.log("Trying local fallback with:", { entrada: messageToSend });
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entrada: messageToSend }),
      });

      if (response.ok) {
        const responseText = await response.text();
        const chatbotResponse: ChatbotResponse = JSON.parse(responseText);
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content:
            chatbotResponse.categoria === "problema_tecnico"
              ? chatbotResponse.diagnostico
              : chatbotResponse.respuesta,
          sender: "bot",
          timestamp: new Date(),
          response: chatbotResponse,
        };
        setMessages((prev) => [...prev, botMessage]);

        const infoMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content:
            "✅ Usando respuestas simuladas locales (API externa no disponible).",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMessage]);
        setConnectionStatus("connected");
      } else {
        throw new Error("Local fallback also failed");
      }
    } catch (error) {
      console.error("Local fallback failed:", error);
      const finalErrorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "❌ Tanto el servidor principal como el de respaldo están temporalmente no disponibles. Por favor intenta más tarde.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, finalErrorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Abrir chat de soporte</span>
        </Button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-[9999] transition-all duration-300 ease-in-out",
            isExpanded
              ? "inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6",
          )}
        >
          {/* Chat Container */}
          <Card
            className={cn(
              "relative transition-all duration-300 ease-in-out shadow-2xl border-0 flex flex-col bg-slate-50/95 backdrop-blur-sm",
              "origin-bottom-right", // Animation origin from bottom-right
              isExpanded
                ? "w-full sm:w-[60vw] sm:min-w-[400px]"
                : "w-full sm:w-96",
              isMinimized
                ? "h-16"
                : isExpanded
                  ? "h-full sm:h-[80vh] sm:max-h-[700px]"
                  : "h-[500px] sm:h-[600px]",
              !isExpanded && "max-w-[calc(100vw-2rem)] sm:max-w-96",
            )}
          >
            {/* Header */}
            <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-primary/90 to-primary/80 text-primary-foreground rounded-t-lg border-b border-primary/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs sm:text-sm truncate">
                      Asistente Técnico IA
                    </h3>
                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          connectionStatus === "connected"
                            ? "bg-green-400 animate-pulse"
                            : connectionStatus === "connecting"
                              ? "bg-yellow-400 animate-pulse"
                              : "bg-red-400",
                        )}
                      />
                      <span className="truncate">
                        {connectionStatus === "connected"
                          ? "En línea"
                          : connectionStatus === "connecting"
                            ? "Conectando..."
                            : "Sin conexión"}
                      </span>
                      {/* Test Connection Button (only show if there's an error) */}
                      {connectionStatus === "error" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={testConnection}
                          disabled={isLoading}
                          className="text-xs h-5 px-2 text-primary-foreground hover:bg-white/20"
                        >
                          Probar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isMinimized ? toggleMinimize : toggleExpand}
                    className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-white/20"
                    title={
                      isMinimized
                        ? "Expandir"
                        : isExpanded
                          ? "Tamaño normal"
                          : "Maximizar"
                    }
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : isExpanded ? (
                      <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeChat}
                    className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-white/20"
                    title="Cerrar chat"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Development Info */}
              {import.meta.env.DEV && (
                <div className="mt-2 text-xs opacity-75 truncate">
                  API:{" "}
                  {import.meta.env.VITE_API_BASE_URL
                    ? `${import.meta.env.VITE_API_BASE_URL}/chatbot`
                    : "/api/chatbot (local)"}
                </div>
              )}
            </CardHeader>

            {/* Messages Area */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/50 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-full">
                    {messages.map((message) => (
                      <EnhancedMessageBubble
                        key={message.id}
                        message={message}
                      />
                    ))}
                    {isLoading && <LoadingMessage />}
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm p-3 sm:p-4 flex-shrink-0 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe tu problema técnico..."
                    className="flex-1 bg-white border-slate-200 text-sm focus:border-primary/50 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="shrink-0 h-10 w-10 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center hidden sm:block">
                  Presiona Enter para enviar
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

// Enhanced Message Bubble Component
function EnhancedMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
            : "bg-gradient-to-br from-muted to-muted/80 text-foreground border",
        )}
      >
        {isUser ? (
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col min-w-0 flex-1 max-w-none",
          isUser ? "items-end" : "items-start",
        )}
      >
        <Card
          className={cn(
            "shadow-sm border-0 max-w-full",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
              : "bg-white/90 border border-slate-200/50 shadow-sm",
          )}
        >
          <CardContent className="p-2 sm:p-3">
            <div className="text-xs sm:text-sm leading-relaxed break-words">
              {formatTechnicalText(message.content)}
            </div>
          </CardContent>
        </Card>

        {/* Technical Response Details */}
        {message.response &&
          message.response.categoria === "problema_tecnico" && (
            <EnhancedTechnicalResponse response={message.response} />
          )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-2 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// Enhanced Technical Response Component
function EnhancedTechnicalResponse({
  response,
}: {
  response: ChatbotResponse;
}) {
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  if (response.categoria !== "problema_tecnico") return null;

  return (
    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 w-full animate-in slide-in-from-top-2 duration-500">
      {/* Internet Information Card */}
      {response.basado_en_internet && (
        <Card className="bg-white/95 border border-accent/30 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-2">
              <button
                onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                className="flex items-center justify-between w-full text-left group hover:bg-accent/5 -m-1 p-1 rounded transition-colors"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                  <h4 className="font-medium text-xs sm:text-sm text-foreground">
                    Información Adicional
                  </h4>
                </div>
                {isInfoExpanded ? (
                  <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>

              {isInfoExpanded && (
                <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words animate-in slide-in-from-top-2 duration-300">
                  {formatTechnicalText(response.basado_en_internet)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      {response.fuentes && response.fuentes.length > 0 && (
        <Card className="bg-white/95 border border-success/30 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success flex-shrink-0" />
              <h4 className="font-medium text-xs sm:text-sm text-foreground">
                Fuentes Verificadas
              </h4>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {response.fuentes.map((fuente, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs hover:bg-success/10 cursor-pointer transition-colors border-success/30 text-success hover:border-success/50 px-2 py-1"
                  onClick={() => window.open(fuente, "_blank")}
                >
                  <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  Fuente {index + 1}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Enhanced Loading Message
function LoadingMessage() {
  return (
    <div className="flex gap-2 sm:gap-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-muted to-muted/80 border shadow-sm flex-shrink-0">
        <Bot className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
      </div>
      <Card className="bg-white/90 border border-slate-200/50 shadow-sm flex-1">
        <CardContent className="p-2 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/60 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Analizando tu consulta...
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
