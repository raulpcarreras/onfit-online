"use client";

import { useThemeBridge } from "@repo/design/providers/theme";
import { Button } from "@repo/design/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/design/components/Card";
import { useEffect, useState, useRef } from "react";

export default function AdminThemePage() {
  const [mounted, setMounted] = useState(false);
  const { mode, resolvedMode, isDark, setMode, colors } = useThemeBridge();
  const [openColorPicker, setOpenColorPicker] = useState<string | null>(null);
  const [colorInputs, setColorInputs] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [hslValues, setHslValues] = useState({ h: 0, s: 100, l: 50 });
  const [customColors, setCustomColors] = useState<{
    light: Record<string, string>;
    dark: Record<string, string>;
  }>({ light: {}, dark: {} });
  
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Función helper para convertir HEX a HSL
  function hexToHsl(hex: string): string {
    // Remover # si existe
    hex = hex.replace('#', '');
    
    // Validar formato HEX
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('Formato HEX inválido');
    }
    
    // Parsear componentes RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    // Convertir a formato "H S% L%"
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  // Función para convertir HSL a HEX
  function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    const R = Math.round((r + m) * 255);
    const G = Math.round((g + m) * 255);
    const B = Math.round((b + m) * 255);
    
    return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
  }

  // Función para abrir/cerrar el color picker
  const toggleColorPicker = (key: string) => {
    if (openColorPicker === key) {
      setOpenColorPicker(null);
    } else {
      setOpenColorPicker(key);
      // Inicializar el input con el color actual
      setColorInputs(prev => ({
        ...prev,
        [key]: colors[key as keyof typeof colors] as string
      }));
    }
  };

  // Función para aplicar el color SOLO al tema activo
  const applyColor = (key: string) => {
    const inputValue = colorInputs[key];
    if (!inputValue) return;

    try {
      let hslColor: string;
      
      // Si es un color HEX, convertirlo a HSL
      if (inputValue.startsWith('#')) {
        hslColor = hexToHsl(inputValue);
      } else if (inputValue.includes('%')) {
        // Si ya es HSL, usarlo directamente
        hslColor = inputValue;
      } else {
        // Intentar parsear como HSL sin %
        const parts = inputValue.split(' ');
        if (parts.length === 3) {
          hslColor = `${parts[0]} ${parts[1]}% ${parts[2]}%`;
        } else {
          throw new Error('Formato de color no reconocido');
        }
      }

      // Guardar el color personalizado para el tema actual
      const currentTheme = isDark ? 'dark' : 'light';
      setCustomColors(prev => ({
        ...prev,
        [currentTheme]: {
          ...prev[currentTheme],
          [key]: hslColor
        }
      }));

      // Aplicar SOLO al tema actual usando CSS custom properties
      const cssVarName = `--${key}`;
      
      if (isDark) {
        // Para tema dark, crear una regla CSS personalizada
        let style = document.getElementById('custom-dark-theme');
        if (!style) {
          style = document.createElement('style');
          style.id = 'custom-dark-theme';
          document.head.appendChild(style);
        }
        
        // Añadir o actualizar la regla CSS
        const existingRule = style.textContent;
        const newRule = `.dark { --${key}: ${hslColor}; }`;
        
        if (existingRule && existingRule.includes(`--${key}:`)) {
          style.textContent = existingRule.replace(
            new RegExp(`--${key}: [^;]+;`),
            `--${key}: ${hslColor};`
          );
        } else {
          style.textContent = existingRule ? existingRule + '\n' + newRule : newRule;
        }
      } else {
        // Para tema light, crear una regla CSS personalizada
        let style = document.getElementById('custom-light-theme');
        if (!style) {
          style = document.createElement('style');
          style.id = 'custom-light-theme';
          document.head.appendChild(style);
        }
        
        // Añadir o actualizar la regla CSS
        const existingRule = style.textContent;
        const newRule = `:root { --${key}: ${hslColor}; }`;
        
        if (existingRule && existingRule.includes(`--${key}:`)) {
          style.textContent = existingRule.replace(
            new RegExp(`--${key}: [^;]+;`),
            `--${key}: ${hslColor};`
          );
        } else {
          style.textContent = existingRule ? existingRule + '\n' + newRule : newRule;
        }
      }
      
      console.log(`Cambiado ${key} en tema ${currentTheme}: ${colors[key as keyof typeof colors]} → ${hslColor}`);
      
      // Cerrar el picker
      setOpenColorPicker(null);
      
      // Forzar re-render
      window.dispatchEvent(new Event('resize'));
    } catch (error) {
      console.error(`Error al aplicar color para ${key}:`, error);
      alert(`Error: ${error instanceof Error ? error.message : 'Formato de color inválido'}`);
    }
  };

  // Función para manejar cambios en el input
  const handleColorInputChange = (key: string, value: string) => {
    setColorInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función para manejar cambios en los sliders HSL
  const handleHslChange = (type: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslValues, [type]: value };
    setHslValues(newHsl);
    
    const hexColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setSelectedColor(hexColor);
    
    // Actualizar el input del color actual
    if (openColorPicker) {
      setColorInputs(prev => ({
        ...prev,
        [openColorPicker]: hexColor
      }));
    }
  };

  // Función para manejar clic en el selector de color visual
  const handleColorPickerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!colorPickerRef.current) return;
    
    const rect = colorPickerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convertir coordenadas a valores HSL
    const s = Math.round((x / rect.width) * 100);
    const l = Math.round(((rect.height - y) / rect.height) * 100);
    
    // Usar el hue actual del slider
    const newHsl = { ...hslValues, s, l };
    setHslValues(newHsl);
    
    const hexColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setSelectedColor(hexColor);
    
    // Actualizar el input del color actual
    if (openColorPicker) {
      setColorInputs(prev => ({
        ...prev,
        [openColorPicker]: hexColor
      }));
    }
  };

  // Colores predefinidos para la paleta
  const predefinedColors = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', 
    '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
    '#ff00ff', '#ff0080', '#ffffff', '#cccccc', '#999999',
    '#666666', '#333333', '#000000', '#ffcccc', '#ff9999',
    '#ff6666', '#ff3333', '#ccffcc', '#99ff99', '#66ff66',
    '#33ff33', '#ccffff', '#99ffff', '#66ffff', '#33ffff'
  ];

  // Evitar hidratación hasta que el cliente esté listo
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Administración del Tema</h1>
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">Cargando tema...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Administración del Tema</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado del Tema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Modo preferido:</strong> {mode}
              </div>
              <div>
                <strong>Tema resuelto:</strong> {resolvedMode}
              </div>
              <div>
                <strong>Es oscuro:</strong> {isDark ? "Sí" : "No"}
              </div>
              <div>
                <strong>Color primario:</strong> {colors.primary}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onPress={() => setMode("light")} variant="outline">
                Tema Claro
              </Button>
              <Button onPress={() => setMode("dark")} variant="outline">
                Tema Oscuro
              </Button>
              <Button onPress={() => setMode("system")} variant="outline">
                Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colores del Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="relative">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: value as string }}
                    />
                    <span className="text-sm font-mono">{key}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => toggleColorPicker(key)}
                      className="w-6 h-6 p-0 min-w-0"
                      title={`Cambiar color ${key}`}
                    >
                      🎨
                    </Button>
                  </div>
                  
                  {/* Color Picker Desplegable */}
                  {openColorPicker === key && (
                    <div className="absolute top-full left-0 mt-2 p-4 bg-card border rounded-lg shadow-lg z-10 min-w-[500px]">
                      <div className="space-y-4">
                        {/* Color Preview */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Color actual: {value}
                          </label>
                          <div 
                            className="w-full h-12 rounded border"
                            style={{ backgroundColor: value as string }}
                          />
                        </div>
                        
                        {/* Layout Horizontal: Selector Visual + Controles */}
                        <div className="flex gap-4">
                          {/* Selector Visual de Colores (Rectangular) */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Seleccionar color
                            </label>
                            <div 
                              ref={colorPickerRef}
                              className="w-48 h-32 rounded border cursor-crosshair relative"
                              style={{
                                background: `linear-gradient(to right, hsl(${hslValues.h}, 0%, 50%), hsl(${hslValues.h}, 100%, 50%)), linear-gradient(to top, hsl(${hslValues.h}, 100%, 0%), hsl(${hslValues.h}, 100%, 50%), hsl(${hslValues.h}, 100%, 100%))`
                              }}
                              onClick={handleColorPickerClick}
                            >
                              {/* Indicador de posición */}
                              <div 
                                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
                                style={{
                                  left: `${hslValues.s}%`,
                                  top: `${100 - hslValues.l}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Controles HSL */}
                          <div className="space-y-3">
                            {/* Slider Hue */}
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">
                                Hue (H): {hslValues.h}°
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={hslValues.h}
                                onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                                className="w-32"
                              />
                            </div>
                            
                            {/* Slider Saturation */}
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">
                                Saturation (S): {hslValues.s}%
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={hslValues.s}
                                onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                                className="w-32"
                              />
                            </div>
                            
                            {/* Slider Lightness */}
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">
                                Lightness (L): {hslValues.l}%
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={hslValues.l}
                                onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                                className="w-32"
                              />
                            </div>
                            
                            {/* Color seleccionado */}
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded border"
                                style={{ backgroundColor: selectedColor }}
                              />
                              <span className="text-sm font-mono">{selectedColor}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Segunda fila horizontal: Paleta + Input */}
                        <div className="flex gap-4">
                          {/* Paleta de colores predefinidos */}
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">
                              Colores predefinidos
                            </label>
                            <div className="grid grid-cols-10 gap-1">
                              {predefinedColors.map((color, index) => (
                                <button
                                  key={index}
                                  className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  onClick={() => {
                                    setSelectedColor(color);
                                    setColorInputs(prev => ({ ...prev, [key]: color }));
                                  }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Input manual */}
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">
                              O escribir manualmente
                            </label>
                            <input
                              type="text"
                              value={colorInputs[key] || ''}
                              onChange={(e) => handleColorInputChange(key, e.target.value)}
                              placeholder="#ff0000 o 0 100% 50%"
                              className="w-full px-3 py-2 border rounded text-sm font-mono bg-background text-foreground"
                            />
                          </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onPress={() => applyColor(key)}
                            className="flex-1"
                          >
                            Aplicar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => setOpenColorPicker(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <p><strong>Formatos soportados:</strong></p>
                          <p>• HEX: #ff0000</p>
                          <p>• HSL: 0 100% 50%</p>
                          <p>• HSL sin %: 0 100 50</p>
                          <p><strong>Nota:</strong> Los cambios solo afectan al tema actual ({isDark ? 'oscuro' : 'claro'})</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded text-sm">
              <p><strong>Instrucciones:</strong></p>
              <p>1. Haz clic en 🎨 para abrir el selector de color completo</p>
              <p>2. Usa el selector visual, sliders HSL, paleta de colores, o escribe manualmente</p>
              <p>3. Haz clic en "Aplicar" para cambiar el color</p>
              <p>4. Los cambios solo afectan al tema actual (light/dark)</p>
              <p>5. El tema principal del sistema no se modifica</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Componentes del Design System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
