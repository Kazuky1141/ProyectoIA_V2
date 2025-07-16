import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ChatbotResponse } from "@shared/api";
import { Send, Bot, User, ExternalLink, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content:
        "¡Hola! Soy tu asistente técnico. Estoy aquí para ayudarte con problemas de hardware, software, redes y más. ¿En qué puedo ayudarte hoy?",
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      // Get API base URL from environment variable
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const apiUrl = apiBaseUrl ? `${apiBaseUrl}/chatbot` : "/api/chatbot";

      console.log("Making API call to:", apiUrl);
      console.log("Sending message:", messageToSend);

      // Prepare the request body with the correct field name
      const requestBody = { entrada: messageToSend };
      console.log("Request body:", requestBody);

      // Prepare headers - add ngrok-skip-browser-warning for ngrok URLs
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiBaseUrl && apiBaseUrl.includes("ngrok")) {
        headers["ngrok-skip-browser-warning"] = "true";
      }

      console.log("Request headers:", headers);

      // Call the chatbot API
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

      // Read response body only once
      const responseText = await response.text();

      if (!response.ok) {
        console.error("Error response:", responseText);
        throw new Error(
          `API Error (${response.status}): ${responseText || response.statusText}`,
        );
      }

      // Parse the JSON from the text we already read
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
      console.error("Error sending message:", error);

      let errorContent = "Lo siento, hubo un error al procesar tu mensaje.";

      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          errorContent =
            "Error de conexión. Verificando si puedo usar el servidor local como respaldo...";
        } else if (error.message.includes("404")) {
          errorContent =
            "El servicio de chat no está disponible en este momento.";
        } else if (error.message.includes("500")) {
          errorContent =
            "Error interno del servidor. Por favor intenta de nuevo en unos momentos.";
        }
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // If external API failed, try fallback to local API
      if (
        import.meta.env.VITE_API_BASE_URL &&
        error instanceof Error &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError"))
      ) {
        console.log("Attempting fallback to local API...");
        setTimeout(() => tryLocalFallback(messageToSend), 2000);
      }
    } finally {
      setIsLoading(false);
      // Reset to connected if no error was set
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
      console.log("Trying local fallback API...");
      console.log("Trying local fallback with:", { entrada: messageToSend });
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entrada: messageToSend }),
      });

      if (response.ok) {
        const chatbotResponse: ChatbotResponse = await response.json();
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

        // Add info message about using local fallback
        const infoMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: "✅ Respuesta generada usando servidor local de respaldo.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMessage]);
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl">
      {/* Chat Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Asistente Técnico IA
        </h1>
        <p className="text-muted-foreground mb-2">
          Obtén ayuda instantánea para cualquier problema técnico
        </p>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                connectionStatus === "connected"
                  ? "bg-success animate-pulse"
                  : connectionStatus === "connecting"
                    ? "bg-warning animate-pulse"
                    : "bg-destructive",
              )}
            />
            <span
              className={cn(
                "text-xs",
                connectionStatus === "connected"
                  ? "text-success"
                  : connectionStatus === "connecting"
                    ? "text-warning"
                    : "text-destructive",
              )}
            >
              {connectionStatus === "connected"
                ? "Conectado"
                : connectionStatus === "connecting"
                  ? "Conectando..."
                  : "Error de conexión"}
            </span>
          </div>

          {/* Test Connection Button (only show if there's an error) */}
          {connectionStatus === "error" && (
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={isLoading}
              className="text-xs"
            >
              Probar Conexión
            </Button>
          )}
        </div>

        {/* Development Info */}
        {import.meta.env.DEV && (
          <div className="mt-2 text-xs text-muted-foreground">
            API:{" "}
            {import.meta.env.VITE_API_BASE_URL
              ? `${import.meta.env.VITE_API_BASE_URL}/chatbot`
              : "/api/chatbot (local)"}
          </div>
        )}
      </div>

      {/* Chat Container */}
      <Card className="h-[calc(100vh-280px)] sm:h-[calc(100vh-320px)] flex flex-col shadow-lg">
        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-3 sm:p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta técnica aquí..."
              className="flex-1 text-sm sm:text-base"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
            Presiona Enter para enviar • Shift + Enter para nueva línea
          </p>
        </div>
      </Card>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[85%] sm:max-w-[70%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          {message.content}
        </div>

        {/* Technical Response Details */}
        {message.response &&
          message.response.categoria === "problema_tecnico" && (
            <TechnicalResponseDetails response={message.response} />
          )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

// Technical Response Details Component
function TechnicalResponseDetails({ response }: { response: ChatbotResponse }) {
  if (response.categoria !== "problema_tecnico") return null;

  return (
    <div className="mt-3 space-y-3 w-full">
      {/* Internet-based Information */}
      {response.basado_en_internet && (
        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">
                  Información adicional:
                </p>
                <p className="text-muted-foreground">
                  {response.basado_en_internet}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      {response.fuentes && response.fuentes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Fuentes de información:
          </p>
          <div className="flex flex-wrap gap-2">
            {response.fuentes.map((fuente, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs hover:bg-accent/10 cursor-pointer"
                onClick={() => window.open(fuente, "_blank")}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Fuente {index + 1}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Loading Message Component
function LoadingMessage() {
  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <div className="bg-muted rounded-lg px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
            </div>
            <span className="text-muted-foreground">
              Analizando tu consulta...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
