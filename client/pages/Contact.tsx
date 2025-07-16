import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  Bot,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contacta con Nosotros
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes preguntas o necesitas soporte adicional? Estamos aquí para
            ayudarte de múltiples maneras.
          </p>
        </div>

        {/* Quick Support */}
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Soporte Inmediato con IA
            </h2>
            <p className="text-muted-foreground mb-6">
              Obtén ayuda instantánea para cualquier problema técnico. Nuestro
              asistente está disponible 24/7.
            </p>
            <Button
              size="lg"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-chatbot"));
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Iniciar Chat de Soporte
            </Button>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                24/7 Disponible
              </Badge>
              <Badge variant="outline" className="text-xs">
                Respuesta Inmediata
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Nombre" />
                <Input placeholder="Email" type="email" />
              </div>
              <Input placeholder="Asunto" />
              <textarea
                className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Describe tu consulta o problema..."
              />
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat en Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Nuestro asistente de IA está disponible las 24 horas para
                  ayudarte con cualquier problema técnico.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-chatbot"));
                  }}
                >
                  Iniciar Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">
                  Para consultas comerciales o técnicas avanzadas:
                </p>
                <p className="text-foreground font-medium">
                  soporte@techsupport.com
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Respuesta en 24 horas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chat IA:</span>
                    <span className="font-medium">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">Lun - Vie, 9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">Lun - Vie, 8:00 - 20:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Link */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">
              ¿Buscas respuestas rápidas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Revisa nuestra documentación y guías para resolver problemas
              comunes por tu cuenta.
            </p>
            <Button variant="outline" asChild>
              <Link to="/docs">Ver Documentación</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
