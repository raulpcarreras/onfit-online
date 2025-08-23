import * as React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design/ui/select";

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

export function Select({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  disabled,
  className,
}: SelectProps) {
  const selectedOpt = React.useMemo(
    () => (value ? options.find((o) => o.value === value) ?? null : null),
    [options, value]
  );

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

  const uiValue = (selectedOpt ?? value ?? "") as any;

  return (
    <UISelect value={uiValue} onValueChange={handleChange as any} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value as any} label={opt.label} disabled={opt.disabled}>
            {(_s) => opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UISelect>
  );
}
