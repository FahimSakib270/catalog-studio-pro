/**
 * Template engine — 10 design configs.
 *
 * Each config sets CSS variables on the page root via inline style:
 *   --t-ink --t-paper --t-accent --t-accent2 --t-grey --t-hairline
 *   --t-font-display --t-font-body --t-font-mono
 *
 * ALL brochure styling reads these variables (Tailwind arbitrary values),
 * so pages never hard-code colors or fonts.
 */

export type CoverLayout =
  | "magazine"
  | "grid"
  | "luxury"
  | "photo"
  | "minimal"
  | "datasheet"
  | "corporate"
  | "classic"
  | "blueprint"
  | "dynamic";

export type TableStyle = "magazine" | "grid" | "boxed" | "classic" | "mono";
export type RibbonStyle = "pill" | "hairline" | "band" | "tag";

export interface TemplateConfig {
  id: string;
  name: string;
  /** CSS variable values applied to each page root. */
  vars: {
    ink: string;
    paper: string;
    accent: string;
    accent2: string;
    grey: string;
    hairline: string;
    fontDisplay: string;
    fontBody: string;
    fontMono: string;
  };
  coverLayout: CoverLayout;
  tableStyle: TableStyle;
  ribbonStyle: RibbonStyle;
  /** Dark pages render with inline bg + print-color-adjust:exact. */
  dark: {
    cover: boolean;
    contact: boolean;
  };
}

/* ------------------------------------------------------------------ */
/*  Font stacks (bundled via @fontsource — fully offline)              */
/* ------------------------------------------------------------------ */

const FRAUNCES = '"Fraunces", "Noto Sans SC", serif';
const MANROPE = '"Manrope", "Noto Sans SC", sans-serif';
const GROTESK = '"Space Grotesk", "Noto Sans SC", sans-serif';
const MONO = '"JetBrains Mono", "Noto Sans SC", monospace';
const BLACK = '"Archivo Black", "Noto Sans SC", sans-serif';

/* ------------------------------------------------------------------ */
/*  The 10 templates                                                   */
/* ------------------------------------------------------------------ */

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "onyx-editorial",
    name: "Onyx Editorial",
    vars: {
      ink: "#15181d",
      paper: "#fdfdfb",
      accent: "#e30613",
      accent2: "#15181d",
      grey: "#6b7280",
      hairline: "#e5e7eb",
      fontDisplay: FRAUNCES,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "magazine",
    tableStyle: "magazine",
    ribbonStyle: "pill",
    dark: { cover: false, contact: false },
  },
  {
    id: "swiss-grid",
    name: "Swiss Grid",
    vars: {
      ink: "#000000",
      paper: "#ffffff",
      accent: "#0044cc",
      accent2: "#000000",
      grey: "#6b7280",
      hairline: "#d1d5db",
      fontDisplay: GROTESK,
      fontBody: GROTESK,
      fontMono: MONO,
    },
    coverLayout: "grid",
    tableStyle: "grid",
    ribbonStyle: "hairline",
    dark: { cover: false, contact: false },
  },
  {
    id: "navy-brass",
    name: "Navy & Brass",
    vars: {
      ink: "#0b1f3a",
      paper: "#f7f3ea",
      accent: "#b08d4a",
      accent2: "#0b1f3a",
      grey: "#7a7f8a",
      hairline: "#e0d8c8",
      fontDisplay: FRAUNCES,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "luxury",
    tableStyle: "classic",
    ribbonStyle: "tag",
    dark: { cover: false, contact: false },
  },
  {
    id: "carbon-luxury",
    name: "Carbon Luxury",
    vars: {
      ink: "#f5f5f4",
      paper: "#0a0a0b",
      accent: "#b87333",
      accent2: "#f5f5f4",
      grey: "#9ca3af",
      hairline: "#2a2a2c",
      fontDisplay: FRAUNCES,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "photo",
    tableStyle: "classic",
    ribbonStyle: "band",
    dark: { cover: true, contact: true },
  },
  {
    id: "crimson-minimal",
    name: "Crimson Minimal",
    vars: {
      ink: "#111111",
      paper: "#ffffff",
      accent: "#e30613",
      accent2: "#111111",
      grey: "#9ca3af",
      hairline: "#e5e7eb",
      fontDisplay: FRAUNCES,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "minimal",
    tableStyle: "classic",
    ribbonStyle: "pill",
    dark: { cover: false, contact: false },
  },
  {
    id: "forest-technical",
    name: "Forest Technical",
    vars: {
      ink: "#14342b",
      paper: "#f4f1e8",
      accent: "#d97706",
      accent2: "#14342b",
      grey: "#6b7280",
      hairline: "#d8d2c2",
      fontDisplay: MONO,
      fontBody: MONO,
      fontMono: MONO,
    },
    coverLayout: "datasheet",
    tableStyle: "mono",
    ribbonStyle: "tag",
    dark: { cover: false, contact: false },
  },
  {
    id: "slate-corporate",
    name: "Slate Corporate",
    vars: {
      ink: "#1f2937",
      paper: "#f4f6f8",
      accent: "#2f5d8a",
      accent2: "#1f2937",
      grey: "#6b7280",
      hairline: "#d7dde3",
      fontDisplay: MANROPE,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "corporate",
    tableStyle: "boxed",
    ribbonStyle: "pill",
    dark: { cover: false, contact: false },
  },
  {
    id: "paper-classic",
    name: "Paper Classic",
    vars: {
      ink: "#3a2a1a",
      paper: "#f6f0e3",
      accent: "#7a1f1f",
      accent2: "#3a2a1a",
      grey: "#8a7a66",
      hairline: "#d9cdb8",
      fontDisplay: FRAUNCES,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "classic",
    tableStyle: "classic",
    ribbonStyle: "hairline",
    dark: { cover: false, contact: false },
  },
  {
    id: "blueprint",
    name: "Blueprint",
    vars: {
      ink: "#dbeafe",
      paper: "#0a2a5e",
      accent: "#ffffff",
      accent2: "#93c5fd",
      grey: "#9db8dd",
      hairline: "#2f5d9e",
      fontDisplay: MONO,
      fontBody: MONO,
      fontMono: MONO,
    },
    coverLayout: "blueprint",
    tableStyle: "mono",
    ribbonStyle: "hairline",
    dark: { cover: true, contact: true },
  },
  {
    id: "dynamic-moto",
    name: "Dynamic Moto",
    vars: {
      ink: "#ffffff",
      paper: "#0a0a0a",
      accent: "#e30613",
      accent2: "#ffffff",
      grey: "#9ca3af",
      hairline: "#2a2a2a",
      fontDisplay: BLACK,
      fontBody: MANROPE,
      fontMono: MONO,
    },
    coverLayout: "dynamic",
    tableStyle: "boxed",
    ribbonStyle: "band",
    dark: { cover: true, contact: true },
  },
];

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                     */
/* ------------------------------------------------------------------ */

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export const DEFAULT_TEMPLATE_ID = TEMPLATES[0].id;
