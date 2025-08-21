"use client";
import React from "react";
import { Dumbbell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="size-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/favicon.png"
                alt="ONFIT Logo"
                className="size-6 object-contain"
              />
              <h1 className="text-lg font-semibold text-foreground">Política de Privacidad</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-6">Política de Privacidad de ONFIT</h2>
          
          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Información que Recopilamos</h3>
              <p>
                Recopilamos la siguiente información para proporcionar y mejorar nuestros servicios:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Información de cuenta:</strong> Nombre, email, contraseña y rol de usuario</li>
                <li><strong>Datos de perfil:</strong> Información física, objetivos de fitness y preferencias</li>
                <li><strong>Datos de uso:</strong> Actividad en la aplicación, entrenamientos realizados y progreso</li>
                <li><strong>Información técnica:</strong> Dispositivo, navegador y datos de conexión</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Cómo Utilizamos tu Información</h3>
              <p>
                Utilizamos tu información personal para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Proporcionar y personalizar nuestros servicios de fitness</li>
                <li>Crear y gestionar tu cuenta de usuario</li>
                <li>Generar entrenamientos personalizados según tus objetivos</li>
                <li>Realizar seguimiento de tu progreso y rendimiento</li>
                <li>Comunicarnos contigo sobre el servicio</li>
                <li>Mejorar y desarrollar nuevas funcionalidades</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Compartir de Información</h3>
              <p>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Con tu consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Para proteger nuestros derechos y seguridad</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">4. Seguridad de Datos</h3>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de seguridad</li>
                <li>Copias de seguridad seguras</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">5. Tus Derechos</h3>
              <p>
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Portabilidad de tus datos</li>
                <li>Retirar el consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">6. Retención de Datos</h3>
              <p>
                Conservamos tu información personal mientras mantengas una cuenta activa o según sea necesario 
                para proporcionar nuestros servicios. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">7. Cookies y Tecnologías Similares</h3>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del servicio 
                y personalizar el contenido. Puedes gestionar las preferencias de cookies en tu navegador.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">8. Transferencias Internacionales</h3>
              <p>
                Tu información puede ser transferida y procesada en países fuera de tu residencia. 
                Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">9. Menores de Edad</h3>
              <p>
                ONFIT no está dirigido a menores de 16 años. No recopilamos intencionalmente información 
                personal de menores de edad. Si eres padre o tutor y crees que tu hijo nos ha proporcionado 
                información personal, contáctanos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">10. Cambios en esta Política</h3>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios 
                significativos y te recomendamos revisar esta política regularmente.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">11. Contacto</h3>
              <p>
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información, 
                contáctanos a través de nuestra plataforma.
              </p>
            </section>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
