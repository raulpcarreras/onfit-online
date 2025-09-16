"use client";

import { Button } from "@repo/design/components/Button";

export default function TestButtonVariantsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Test Button Variants - Variantes Extra</h1>
      
      {/* Variantes shadcn (deben funcionar igual que antes) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variantes shadcn (nativas)</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Variantes extra (nuevas) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variantes extra (nuevas)</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="onfit">OnFit</Button>
          <Button variant="premium">Premium</Button>
          <Button variant="social">Social</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </section>

      {/* Tamaños shadcn */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tamaños shadcn (nativos)</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🔍</Button>
        </div>
      </section>

      {/* Tamaños extra */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tamaños extra (nuevos)</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <Button size="md">Medium (md)</Button>
          <Button size="xl">Extra Large (xl)</Button>
          <Button size="2xl">2XL (2xl)</Button>
        </div>
      </section>

      {/* Combinaciones variantes + tamaños extra */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Combinaciones variantes + tamaños extra</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <Button variant="onfit" size="xl">OnFit XL</Button>
          <Button variant="premium" size="2xl">Premium 2XL</Button>
          <Button variant="success" size="md">Success MD</Button>
        </div>
      </section>

      {/* Compatibilidad onPress */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Compatibilidad onPress</h2>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="onfit" 
            size="lg"
            onPress={() => alert('onPress funciona correctamente!')}
          >
            Test onPress
          </Button>
          <Button 
            variant="premium" 
            size="xl"
            onPress={() => alert('onPress también funciona!')}
          >
            Test onPress
          </Button>
        </div>
      </section>

      {/* Verificación de que md funciona */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Verificación: size=&quot;md&quot; debe funcionar</h2>
        <div className="flex gap-2 flex-wrap">
          <Button size="md" variant="default">Default MD</Button>
          <Button size="md" variant="outline">Outline MD</Button>
          <Button size="md" variant="onfit">OnFit MD</Button>
        </div>
      </section>
    </div>
  );
}
