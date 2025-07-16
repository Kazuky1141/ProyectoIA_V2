import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  ExternalLink,
  Book,
  Video,
  Download,
  MessageCircle,
} from "lucide-react";

export default function Docs() {
  const guides = [
    {
      title: "Guía de Solución de Problemas",
      description: "Pasos básicos para resolver problemas comunes",
      icon: FileText,
      badge: "Popular",
    },
    {
      title: "Diagnóstico de Hardware",
      description: "Cómo identificar y resolver problemas de hardware",
      icon: Book,
      badge: "Esencial",
    },
    {
      title: "Configuración de Red",
      description: "Configurar y solucionar problemas de conectividad",
      icon: Video,
      badge: "Video",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Documentación y Guías
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra guías detalladas, tutoriales y documentación para resolver
            problemas técnicos por tu cuenta.
          </p>
        </div>

        {/* Quick Action */}
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              ¿Necesitas ayuda inmediata?
            </h2>
            <p className="text-muted-foreground mb-6">
              Nuestro asistente de IA puede ayudarte al instante con cualquier
              problema técnico.
            </p>
            <Button
              size="lg"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-chatbot"));
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Hablar con el Asistente
            </Button>
          </CardContent>
        </Card>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {guide.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {guide.description}
                </p>
                <Button variant="outline" className="w-full">
                  Leer Guía
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Recursos Descargables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                • Manual de diagnóstico rápido (PDF)
              </div>
              <div className="text-sm text-muted-foreground">
                • Lista de verificación de problemas (PDF)
              </div>
              <div className="text-sm text-muted-foreground">
                • Herramientas de diagnóstico recomendadas
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Todos los Recursos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Tutoriales en Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                • Cómo diagnosticar problemas de arranque
              </div>
              <div className="text-sm text-muted-foreground">
                • Solución de problemas de red paso a paso
              </div>
              <div className="text-sm text-muted-foreground">
                • Optimización de rendimiento del sistema
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Canal de YouTube
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
