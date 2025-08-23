# Informe de Auditoría Gráfica

Fecha: 2025-08-23T10:17:35.722116Z

Este informe revisa el uso de estilos dentro del repositorio y señala posibles incumplimientos de la convención: **Sin CSS ad‑hoc**, estilos centralizados en **tokens/variantes (cva)**, y **shadcn por defecto**.


## Resumen ejecutivo


- Archivos CSS/SCSS totales: **4**
- CSS en apps nativas (debería ser 0): **0**
- Posibles overrides globales (`:root` con CSS vars): **2**
- CSS que parece apuntar a componentes shadcn (posible override): **2**
- Uso de styled-components: **0**
- Uso de Emotion: **0**
- Uso de twin.macro: **0**
- `style={...}` inline en JSX: **22**
- Tailwind arbitrario `[ ... ]` (mejor evitar si no está en tokens): **1**
- Componentes UI sin `cva(...)` en `packages/ui`: **0**
- Wrappers de shadcn/ui detectados: **0**


## CSS/SCSS/SASS encontrados

- `apps/web/app/globals.css`

- `apps/web/app/styles/utilities.css`

- `packages/design-system/tailwind/global.css`

- `packages/design-system/tokens/index.css`


## CSS dentro de apps nativas (no permitido)

✅ Nada que reportar.


## Overrides globales de variables (revisar)

- `packages/design-system/tailwind/global.css`

- `packages/design-system/tokens/index.css`


## CSS apuntando a shadcn/ui (posibles overrides)

- `apps/web/app/globals.css`

- `apps/web/app/styles/utilities.css`


## styled-components detectado

✅ Nada que reportar.


## Emotion detectado

✅ Nada que reportar.


## twin.macro detectado

✅ Nada que reportar.


## Estilos inline con `style={{...}}`

- `apps/native/app/(protected)/admin.tsx` @105

> import { View, Text } from 'react-native';
> 
> export default function AdminScreen() {
>   return (
>     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
>       <Text>Admin OK</Text>
>     </View>
>   );
> }
> 
> 
> 

- `apps/native/app/(protected)/client.tsx` @106

> import { View, Text } from 'react-native';
> 
> export default function ClientScreen() {
>   return (
>     <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
>       <Text>Client</Text>
>     </View>
>   );
> }
> 
> 
> 

- `apps/native/app/(protected)/trainer.tsx` @107

> import { View, Text } from 'react-native';
> 
> export default function TrainerScreen() {
>   return (
>     <View style={{ flex: 1, alignItems:'center', justifyContent:'center' }}>
>       <Text>Trainer</Text>
>     </View>
>   );
> }
> 
> 
> 

- `apps/native/features/auth/LoginScreen.tsx` @2636

> ssage ?? "Inténtalo de nuevo");
>     } finally {
>       setLoading(false);
>     }
>   };
> 
>   return (
>     <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
>       <KeyboardAvoidingView
>         style={{ flex: 1 }}
>         behavior={Platform.OS === "ios" ? "padding" : undefined}
>       >
>         <ScrollView
>           contentContainerStyle={{
>             flexGrow: 1,
>             justifyContent:

- `apps/native/src/lib/auth-guard.tsx` @992

>  reconocido, ir a login
>       router.replace('/login');
>     }
>   }, [user, role, loading, router]);
> 
>   // Mostrar loading mientras se determina la redirección
>   if (loading) {
>     return (
>       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
>         <ActivityIndicator size="large" />
>       </View>
>     );
>   }
> 
>   // Si no hay usuario, no renderizar nada (se está redirigien

- `apps/web/app/test-theme/page.tsx` @2790

> (colors).map(([key, value]) => (
>                 <div key={key} className="flex items-center gap-2">
>                   <div 
>                     className="w-6 h-6 rounded border"
>                     style={{ backgroundColor: value as string }}
>                   />
>                   <span className="text-sm font-mono">{key}</span>
>                 </div>
>               ))}
>             </div>
>        

- `apps/web/src/components/dashboard/layout/Topbar.tsx` @3377

> b (solo si showBreadcrumb es true) */}
>           {showBreadcrumb && (
>             <>
>               <span className="hidden sm:inline mx-1 md:mx-2 text-xl md:text-2xl text-muted-foreground font-light" style={{ marginTop: '-2px' }}>/</span>
>               
>               <div className="hidden sm:flex items-center" style={{ marginTop: '3px' }}>
>                 <div className="flex items-center font-mo

- `packages/bottom-sheet/router/view.tsx` @4664

> irstDescriptor = descriptors[firstRoute.key];
>   if (!firstDescriptor) {
>     // if we don't have a descriptor for the first route, bail out
>     return null;
>   }
> 
>   return (
>     <>
>       <Animated.View style={{ flex: 1, backgroundColor: "#000" }}>
>         <Animated.View style={animatedStyle}>{firstDescriptor.render?.()}</Animated.View>
>       </Animated.View>
>       {shouldRenderProvider.current && (
> 

- `packages/bottom-sheet/src/provider.tsx` @4000

> viderRegistryStack.indexOf(context), 1);
>       unsub?.unsubscribe();
>     };
>   }, [context, onRegister]);
> 
>   return (
>     <SheetAnimationContext.Provider value={{ isFullScreen }}>
>       <Animated.View style={{ flex: 1, backgroundColor: "#000" }}>
>         <Animated.View style={animatedStyle}>{children}</Animated.View>
>       </Animated.View>
>       <BottomSheetModalProvider>
>         {sheetIds.map((id)

- `packages/design-system/components/Avatar/index.native.tsx` @423

> st AvatarImage = (props: ImageProps) => <Image style={s.img} {...props} />;
> export const AvatarFallback = ({ children }: { children?: React.ReactNode }) => (
>   <View style={[s.img, s.fallback]}><Text style={{ color: "#F59E0B" }}>{children}</Text></View>
> );
> export default Avatar;
> const s = StyleSheet.create({
>   wrap: { width: 32, height: 32, borderRadius: 9999, overflow: "hidden" },
>   img: { width:

- `packages/design-system/components/Checkbox/index.native.tsx` @333

> xport const Checkbox: FC<{ checked?: boolean; onCheckedChange?: (checked: boolean) => void }> = ({ checked, onCheckedChange }) => (
>   <Pressable onPress={() => onCheckedChange?.(!checked)}>
>     <View style={{ width: 16, height: 16, borderWidth: 1, borderColor: "#F59E0B", backgroundColor: checked ? "#F59E0B" : "transparent" }} />
>   </Pressable>
> );
> export default Checkbox;
> 

- `packages/design-system/components/Loader/index.web.tsx` @961

>    key={i}
>             className={cn(
>               "rounded-full bg-primary animate-pulse",
>               size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
>             )}
>             style={{
>               animationDelay: `${i * 0.2}s`
>             }}
>           />
>         ))}
>       </div>
>     );
>   }
> 
>   return null;
> }
> 

- `packages/design-system/components/Progress/index.native.tsx` @1242

> ow-hidden",
>         sizeClasses[size],
>         className
>       )}>
>         <View
>           className={cn(
>             "h-full rounded-full",
>             variantClasses[variant]
>           )}
>           style={{ width: `${percentage}%` }}
>         />
>       </View>
>       
>       {showValue && (
>         <Text className="text-xs text-muted-foreground text-right">
>           {Math.round(percentage)}%
>       

- `packages/design-system/components/Progress/index.web.tsx` @1279

>         <div
>           className={cn(
>             "h-full rounded-full transition-all duration-300",
>             variantClasses[variant],
>             animated ? "ease-out" : ""
>           )}
>           style={{ width: `${percentage}%` }}
>         />
>       </div>
>       
>       {showValue && (
>         <div className="text-xs text-muted-foreground text-right">
>           {Math.round(percentage)}%
>         

- `packages/design-system/layout/index.tsx` @1439

> {ready && <SystemBars style="auto" {...status} />}
>       {!wait && ready ? (
>         Object.keys(props).length === 0 ? (
>           (children as React.ReactNode)
>         ) : (
>           <Animated.View style={{ flex: 1 }} {...props}>
>             {children}
>           </Animated.View>
>         )
>       ) : Placeholder ? (
>         <Placeholder {...props} />
>       ) : (
>         <Animated.View
>           cl

- `packages/design-system/providers/index.tsx` @1575

> rue;
>     i18n.on("languageChanged", () => setLangChange((v) => v + 1));
>   }, []);
> 
>   return (
>     <NavigationThemeProvider value={themes?.[defaultTheme || colorScheme]}>
>       <GestureHandlerRootView style={{ flex: 1 }}>
>         <KeyboardProvider>
>           <QueryProvider>
>             <React.Fragment key={forceUpdate}>{children}</React.Fragment>
>             <PortalHost />
>             <SonnerProvid

- `packages/design-system/ui/chart.tsx` @8544

>      >
>             {itemConfig?.icon && !hideIcon ? (
>               <itemConfig.icon />
>             ) : (
>               <div
>                 className="h-2 w-2 shrink-0 rounded-[2px]"
>                 style={{
>                   backgroundColor: item.color,
>                 }}
>               />
>             )}
>             {itemConfig?.label}
>           </div>
>         );
>       })}
>     </div>
>   );
> }
> 
> // H

- `packages/design-system/ui/marquee.tsx` @432

> er) => void;
>   children: React.ReactNode;
> }
> 
> const MeasureElement: React.FC<MeasureElementProps> = ({ onLayout, children }) => (
>   <Animated.ScrollView
>     horizontal
>     pointerEvents="box-none"
>     style={{ zIndex: -1, opacity: 0 }}
>   >
>     <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
>   </Animated.ScrollView>
> );
> 
> interface TranslatedElementProps {
>   index: num

- `packages/design-system/ui/progress.tsx` @1086

> alue,
>   className,
> }: {
>   value: number | undefined | null;
>   className?: string;
> }) {
>   return (
>     <View
>       className={cn("h-full w-full flex-1 bg-primary web:transition-all", className)}
>       style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
>     >
>       <ProgressPrimitive.Indicator className={cn("h-full w-full ", className)} />
>     </View>
>   );
> }
> 

- `packages/design-system/ui/select.tsx` @4292

> .pageY - HEIGHT) <= HEIGHT * 0.35
>           : false,
>       [triggerPosition?.pageY],
>     );
> 
>     return (
>       <SelectPrimitive.Portal>
>         <SelectPrimitive.Content
>           ref={ref}
>           style={{ minWidth: triggerPosition?.width }}
>           className={cn(
>             "relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md shadow-foreground/10 py-2 px

- `packages/design-system/ui/sidebar.tsx` @5320

> (
>         // @ts-ignore
>         <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
>           <SheetContent
>             data-sidebar="sidebar"
>             data-mobile="true"
>             style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as any}
>             className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
>             side={side}
>           >
>     

- `packages/design-system/ui/calender/index.tsx` @6252

>   className={cn("font-medium text-base native:text-lg", classNames?.month)}
>             >
>               {selectedYear}
>             </Text>
>           )}
>         </SelectTrigger>
>         <SelectContent style={{ minWidth: 154 }}>
>           <FlatList
>             data={months}
>             initialNumToRender={12}
>             renderItem={({ item }) => (
>               <SelectItem key={item} value={item} l


## Tailwind arbitario `[ ... ]` detectado

- `packages/design-system/components/Avatar/index.web.tsx` @575

> assName, size = "md", ...props }, ref) => {
>     const sizeClasses = {
>       sm: "h-8 w-8",
>       md: "h-10 w-10",
>       lg: "h-12 w-12",
>     };
> 
>     return (
>       <UIAvatar
>         ref={ref}
>         className={cn(sizeClasses[size], className)}
>         {...props}
>       >
>         {src && <AvatarImage src={src} />}
>         <AvatarFallback>{fallback}</AvatarFallback>
>       </UIAvatar>
>     );
>   }
> );
> 
> 


## Componentes en `packages/ui` sin `cva()`

✅ Nada que reportar.


## Wrappers de shadcn/ui

✅ Nada que reportar.


## Recomendaciones de remediación (priorizadas)


1) **Eliminar CSS de apps nativas** (`apps/native/**`) y mover la presentación a variantes/tokens o estilos RN (si aplica) mediante props/variants.
2) **Revisar overrides de shadcn** en CSS y eliminarlos. Si hace falta, replicar como variantes con `cva()` en `packages/ui/components/ui/*`.
3) **Evitar `style={{...}}`** salvo casos puntuales (animación/medidas dinámicas). Llevar a `className` con tokens/variants.
4) **Sustituir `styled-components`/Emotion/twin** por el stack oficial (Tailwind + cva). Si no es posible, encapsularlos en `packages/ui` como wrappers sin fuga de estilos.
5) **Asegurar `cva()`** en todos los componentes de `packages/ui`. Añadir variantes (size, color, state) y mapping a tokens.
6) **No usar Tailwind arbitrario** con `[value]` si no está respaldado por tokens. Añadir tokens nuevos si de verdad son necesarios.
7) **Wrappers**: los wrappers de shadcn no deben sobreescribir estilos por defecto; exponer variantes y valores por defecto del diseño.
