import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Bot,
  Monitor,
  Wifi,
  HardDrive,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Bot,
      title: "IA Avanzada",
      description:
        "Nuestro asistente utiliza inteligencia artificial para diagnosticar y resolver problemas técnicos al instante.",
    },
    {
      icon: Zap,
      title: "Respuesta Rápida",
      description:
        "Obtén soluciones en segundos, no en horas. Nuestro sistema responde inmediatamente a tus consultas.",
    },
    {
      icon: Shield,
      title: "Soluciones Confiables",
      description:
        "Basado en miles de casos reales y fuentes verificadas de internet para brindarte la mejor ayuda.",
    },
    {
      icon: Users,
      title: "Soporte 24/7",
      description:
        "Disponible las 24 horas del día, los 7 días de la semana. Siempre aquí cuando necesites ayuda.",
    },
  ];

  const categories = [
    {
      icon: Monitor,
      title: "Hardware",
      description: "Problemas con componentes, rendimiento, y dispositivos",
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    {
      icon: HardDrive,
      title: "Software",
      description: "Errores de aplicaciones, instalaciones, y configuraciones",
      color: "bg-green-500/10 text-green-600 border-green-200",
    },
    {
      icon: Wifi,
      title: "Redes",
      description: "Conectividad, WiFi, internet, y problemas de red",
      color: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
  ];

  const stats = [
    { number: "50k+", label: "Problemas Resueltos" },
    { number: "98%", label: "Satisfacción" },
    { number: "30s", label: "Tiempo Promedio" },
    { number: "24/7", label: "Disponibilidad" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Star className="w-3 h-3 mr-1" />
            Soporte Técnico Inteligente
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Resolvemos tus{" "}
            <span className="text-primary">problemas técnicos</span> al instante
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro asistente de IA está entrenado para diagnosticar y
            solucionar problemas de hardware, software, redes y más. Obtén ayuda
            inmediata las 24 horas del día.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => {
                // Trigger chatbot opening by dispatching a custom event
                window.dispatchEvent(new CustomEvent("open-chatbot"));
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Iniciar Chat de Soporte
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Link to="/docs">
                Ver Documentación
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Por qué elegir nuestro soporte?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combinamos la mejor tecnología de IA con conocimiento técnico
            experto para ofrecerte soluciones precisas y rápidas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Áreas de Soporte
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nuestro asistente está especializado en resolver problemas en estas
            áreas principales de tecnología.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("open-chatbot"));
                  }}
                >
                  Obtener Ayuda
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Tienes un problema técnico?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              No esperes más. Nuestro asistente de IA está listo para ayudarte a
              resolver cualquier problema técnico que tengas. Es gratis, rápido
              y disponible las 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-chatbot"));
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Gratis
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-success" />
                Instantáneo
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                Confiable
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
