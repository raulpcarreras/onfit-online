// https://nextjs.org/docs/pages/building-your-application/configuring/eslint

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    // import.meta.dirname is available after Node.js v20.11.0
    baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
    ...compat.config({
        extends: ["next"],
        settings: {
            next: {
                rootDir: "apps/web/",
            },
        },
        rules: {
            // ❌ Prohíbe onClick en JSX (te fuerza a usar onPress del DS)
            "no-restricted-syntax": [
                "error",
                {
                    selector: 'JSXAttribute[name.name="onClick"]',
                    message: "Usa 'onPress' y el Button del DS (@repo/design/components/Button).",
                },
                {
                    selector: 'JSXOpeningElement[name.name="button"]',
                    message:
                        "No uses <button> crudo. Usa @repo/design/components/Button.",
                },
            ],
        },
    }),
];
