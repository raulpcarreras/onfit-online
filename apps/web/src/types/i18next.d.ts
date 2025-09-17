import "i18next";
// si exportas tipos desde @repo/design/lib/locale, puedes referenciarlos aquí:
declare module "i18next" {
    interface CustomTypeOptions {
        // ajusta esto a lo que exportes realmente desde @repo/design/lib/locale
        // resources: import('@repo/design/lib/locale').Resources;
        // defaultNS?: 'translation';
    }
}
