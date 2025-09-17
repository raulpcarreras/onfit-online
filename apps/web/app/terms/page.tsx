"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@repo/design/components/Card";

export default function TermsPage() {
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon.png"
                alt="ONFIT Logo"
                className="size-6 object-contain"
              />
              <h1 className="text-lg font-semibold text-foreground">
                Términos y Condiciones
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Términos y Condiciones de ONFIT
          </h2>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                1. Aceptación de los Términos
              </h3>
              <p>
                Al acceder y utilizar la aplicación ONFIT, aceptas estar sujeto a estos
                términos y condiciones. Si no estás de acuerdo con alguna parte de estos
                términos, no debes utilizar nuestro servicio.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                2. Descripción del Servicio
              </h3>
              <p>
                ONFIT es una plataforma de fitness que proporciona entrenamientos
                personalizados, seguimiento de progreso y herramientas para alcanzar tus
                objetivos físicos. Nuestros servicios incluyen:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acceso a entrenamientos personalizados</li>
                <li>Seguimiento de progreso y métricas</li>
                <li>Comunidad de usuarios fitness</li>
                <li>Herramientas de planificación de entrenamientos</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                3. Cuentas de Usuario
              </h3>
              <p>
                Para utilizar nuestros servicios, debes crear una cuenta proporcionando
                información precisa y actualizada. Eres responsable de mantener la
                confidencialidad de tu contraseña y de todas las actividades que ocurran
                bajo tu cuenta.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                4. Uso Aceptable
              </h3>
              <p>
                Te comprometes a utilizar ONFIT únicamente para fines legales y de acuerdo
                con estos términos. No debes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Usar el servicio para actividades ilegales o fraudulentas</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Interferir con el funcionamiento del servicio</li>
                <li>Compartir contenido inapropiado o ofensivo</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                5. Privacidad y Datos
              </h3>
              <p>
                Tu privacidad es importante para nosotros. Recopilamos y utilizamos tu
                información personal de acuerdo con nuestra Política de Privacidad. Al
                usar ONFIT, consientes la recopilación y uso de esta información.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                6. Limitación de Responsabilidad
              </h3>
              <p>
                ONFIT se proporciona &quot;tal como está&quot; sin garantías de ningún
                tipo. No somos responsables de lesiones o daños que puedan resultar del
                uso de nuestros servicios de fitness. Siempre consulta con un profesional
                de la salud antes de comenzar un nuevo programa de ejercicios.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                7. Modificaciones
              </h3>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier
                momento. Los cambios entrarán en vigor inmediatamente después de su
                publicación. Tu uso continuado del servicio constituye aceptación de los
                términos modificados.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                8. Terminación
              </h3>
              <p>
                Podemos terminar o suspender tu cuenta en cualquier momento por violación
                de estos términos o por cualquier otra razón a nuestra discreción. También
                puedes cancelar tu cuenta en cualquier momento.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">9. Contacto</h3>
              <p>
                Si tienes preguntas sobre estos términos, contáctanos a través de nuestra
                plataforma o en la información de contacto proporcionada en el servicio.
              </p>
            </Card>

            <Card className="p-4 bg-muted/50 border-border">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Última actualización:</strong>{" "}
                {new Date().toLocaleDateString("es-ES")}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
