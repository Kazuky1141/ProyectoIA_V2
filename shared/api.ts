/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Chatbot API types for technical support
 */

// Base interface for all chatbot responses
export interface ChatbotBaseResponse {
  entrada: string;
  categoria: "problema_tecnico" | "no_tecnico";
}

// Response for technical questions
export interface TechnicalResponse extends ChatbotBaseResponse {
  categoria: "problema_tecnico";
  diagnostico: string;
  basado_en_internet: string;
  fuentes: string[];
}

// Response for non-technical questions
export interface NonTechnicalResponse extends ChatbotBaseResponse {
  categoria: "no_tecnico";
  respuesta: string;
}

// Union type for all possible responses
export type ChatbotResponse = TechnicalResponse | NonTechnicalResponse;

// Request type for sending messages to the chatbot
export interface ChatbotRequest {
  entrada: string;
}

// Chat message type for the UI
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  response?: ChatbotResponse;
}
