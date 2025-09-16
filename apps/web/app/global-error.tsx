'use client';

import { useEffect } from 'react';
import { Button } from "@repo/design/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Algo salió mal
            </h2>
            <p className="text-muted-foreground mb-4">
              Ha ocurrido un error inesperado
            </p>
            <Button
              onPress={() => reset()}
              variant="default"
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
