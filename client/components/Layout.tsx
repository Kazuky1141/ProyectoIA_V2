import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FloatingChatbot from "./FloatingChatbot";
import {
  Bot,
  Home,
  FileText,
  Phone,
  Menu,
  X,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Documentación", href: "/docs", icon: FileText },
    { name: "Contacto", href: "/contacto", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  TechSupport
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  Soporte Inteligente
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">TechSupport</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Plataforma de soporte técnico inteligente que utiliza IA para
                brindar soluciones rápidas y efectivas a tus problemas
                tecnológicos.
              </p>
              <div className="flex gap-4">
                <Card className="p-3 bg-accent/10">
                  <Shield className="w-5 h-5 text-primary" />
                </Card>
                <Card className="p-3 bg-accent/10">
                  <Zap className="w-5 h-5 text-primary" />
                </Card>
                <Card className="p-3 bg-accent/10">
                  <Users className="w-5 h-5 text-primary" />
                </Card>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/docs"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground text-sm">
                    Chat de IA (botón flotante)
                  </span>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground text-sm">
                  Disponible 24/7
                </li>
                <li className="text-muted-foreground text-sm">
                  Respuesta promedio: 30 segundos
                </li>
                <li className="text-muted-foreground text-sm">
                  IA entrenada en miles de casos
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 TechSupport. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  );
}
