// packages/design-system/tokens.ts
// Espejo de tokens.css para consumo en React Native / lógica JS.
// Mantén los mismos nombres canónicos que en tokens.css.

export type ThemeMode = "light" | "dark";

type TokenKeys =
    | "background"
    | "foreground"
    | "card"
    | "card-foreground"
    | "popover"
    | "popover-foreground"
    | "primary"
    | "primary-foreground"
    | "secondary"
    | "secondary-foreground"
    | "muted"
    | "muted-foreground"
    | "accent"
    | "accent-foreground"
    | "destructive"
    | "destructive-foreground"
    | "border"
    | "input"
    | "ring";

type HslTriple = string; // ej: "38 92% 50%"

type HslMap = Record<TokenKeys, HslTriple>;
type HexMap = Record<TokenKeys, string>;

const lightHSL: HslMap = {
    background: "0 0% 98%",
    foreground: "222.2 47.4% 11.2%",
    card: "0 0% 100%",
    "card-foreground": "222.2 47.4% 11.2%",
    popover: "0 0% 100%",
    "popover-foreground": "222.2 47.4% 11.2%",
    primary: "38 92% 50%",
    "primary-foreground": "0 0% 100%",
    secondary: "240 4.8% 95.9%",
    "secondary-foreground": "222.2 47.4% 11.2%",
    muted: "240 4.8% 95.9%",
    "muted-foreground": "215 16% 47%",
    accent: "38 92% 50%",
    "accent-foreground": "0 0% 100%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "38 92% 50%",
};

const darkHSL: HslMap = {
    background: "240 7% 8%",
    foreground: "0 0% 96%",
    card: "240 6% 10%",
    "card-foreground": "0 0% 96%",
    popover: "240 6% 10%",
    "popover-foreground": "0 0% 96%",
    primary: "38 92% 50%",
    "primary-foreground": "0 0% 100%",
    secondary: "240 3.7% 15.9%",
    "secondary-foreground": "0 0% 96%",
    muted: "240 3.7% 15.9%",
    "muted-foreground": "0 0% 70%",
    accent: "38 92% 50%",
    "accent-foreground": "0 0% 100%",
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "0 0% 98%",
    border: "240 3.7% 15.9%",
    input: "240 3.7% 15.9%",
    ring: "38 92% 50%",
};

// Utils: convertir "H S% L%" → "#rrggbb"
function hslStringToHex(hsl: HslTriple): string {
    const [hStr, sStr, lStr] = hsl.split(" ");
    const h = clampHue(parseFloat(hStr));
    const s = parseFloat(sStr.replace("%", "")) / 100;
    const l = parseFloat(lStr.replace("%", "")) / 100;

    // HSL → RGB → HEX
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let r = 0,
        g = 0,
        b = 0;

    if (0 <= hp && hp < 1) [r, g, b] = [c, x, 0];
    else if (1 <= hp && hp < 2) [r, g, b] = [x, c, 0];
    else if (2 <= hp && hp < 3) [r, g, b] = [0, c, x];
    else if (3 <= hp && hp < 4) [r, g, b] = [0, x, c];
    else if (4 <= hp && hp < 5) [r, g, b] = [x, 0, c];
    else if (5 <= hp && hp <= 6) [r, g, b] = [c, 0, x];

    const m = l - c / 2;
    const [R, G, B] = [r + m, g + m, b + m].map((v) => Math.round(v * 255));

    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}

function clampHue(h: number) {
    // normaliza a [0, 360)
    return ((h % 360) + 360) % 360;
}

function toHex(n: number) {
    return n.toString(16).padStart(2, "0");
}

function buildHexMap(hslMap: HslMap): HexMap {
    const out = {} as HexMap;
    (Object.keys(hslMap) as TokenKeys[]).forEach((k) => {
        out[k] = hslStringToHex(hslMap[k]);
    });
    return out;
}

const lightHEX = buildHexMap(lightHSL);
const darkHEX = buildHexMap(darkHSL);

export const tokens = {
    light: {
        hsl: lightHSL,
        hex: lightHEX,
        css: mapToCss(lightHSL),
    },
    dark: {
        hsl: darkHSL,
        hex: darkHEX,
        css: mapToCss(darkHSL),
    },
};

function mapToCss(hslMap: HslMap): Record<TokenKeys, string> {
    const out = {} as Record<TokenKeys, string>;
    (Object.keys(hslMap) as TokenKeys[]).forEach((k) => {
        out[k] = `hsl(${hslMap[k]})`;
    });
    return out;
}

// Helpers principales
export function getTheme(mode: ThemeMode) {
    return tokens[mode];
}

export function colorHex(mode: ThemeMode, key: TokenKeys) {
    return tokens[mode].hex[key];
}

export function colorHslString(mode: ThemeMode, key: TokenKeys) {
    return tokens[mode].css[key]; // "hsl(H S% L%)"
}
