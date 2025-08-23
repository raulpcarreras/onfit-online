"use client";

import * as React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Wrapper adaptador: expone string-in/string-out,
 * pero habla Option con el UI interno si lo necesita.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  disabled,
  className,
}: SelectProps) {
  // Mapea el string actual a su Option (si existe)
  const selectedOpt = React.useMemo(
    () => (value ? options.find((o) => o.value === value) ?? null : null),
    [options, value]
  );

  // Normaliza el evento del UI (puede ser string u Option)
  const handleChange = React.useCallback(
    (next: unknown) => {
      let nextValue: string | undefined;

      if (typeof next === "string") {
        nextValue = next;
      } else if (next && typeof next === "object" && "value" in (next as any)) {
        nextValue = (next as any).value as string;
      }

      if (nextValue !== undefined) onChange?.(nextValue);
    },
    [onChange]
  );

  // Pasamos al UI lo que necesite: si acepta Option, le damos Option; si no, string.
  const uiValue = (selectedOpt ?? value ?? "") as any;

  return (
    <UISelect value={uiValue} onValueChange={handleChange as any} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          // Para máxima compatibilidad, damos string como value
          <SelectItem key={opt.value} value={opt.value as any} label={opt.label} disabled={opt.disabled}>
            {(_s) => opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
}
