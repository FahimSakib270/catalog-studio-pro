import { z } from "zod";
import type { Product } from "../../types/catalog";
import {
  specSchema,
  priceSchema,
  variantSchema,
  variantsSchema,
} from "../../types/catalog";

/* ------------------------------------------------------------------ */
/*  Path helpers                                                       */
/* ------------------------------------------------------------------ */

export function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((o, k) => (o == null ? undefined : (o as any)[k]), obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const last = keys.pop()!;
  const target = keys.reduce<any>((o, k) => (o[k] = o[k] ?? {}), obj);
  target[last] = value;
  return obj;
}

/* ------------------------------------------------------------------ */
/*  Field descriptors                                                  */
/* ------------------------------------------------------------------ */

export type FieldDef =
  | { kind: "text"; label: string; path: string; search: string }
  | {
      kind: "bilingual";
      label: string;
      enPath: string;
      zhPath: string;
      search: string;
    }
  | { kind: "list"; label: string; path: string; search: string }
  | { kind: "specs"; label: string; path: string; search: string }
  | { kind: "record"; label: string; path: string; search: string }
  | { kind: "bool"; label: string; path: string; search: string }
  | { kind: "price"; label: string; path: string; search: string };

export interface SectionDef {
  id: string;
  label: string;
  /** Generic form fields (variants section is rendered specially). */
  fields: FieldDef[];
  /** Extract the section's data slice for the Paste codec. */
  pick: (p: Product) => unknown;
  /** Validate the Paste slice. */
  schema: z.ZodType;
  /** Merge a validated slice back into the product. */
  apply: (p: Product, data: unknown) => Product;
}

/* ------------------------------------------------------------------ */
/*  Section schemas                                                    */
/* ------------------------------------------------------------------ */

const modelSchema = z.object({
  modelCode: z.string(),
  hsCode: z.string(),
  titleLinesEn: z.string(),
  titleLinesZh: z.string(),
  taglineEn: z.string(),
  taglineZh: z.string(),
  overviewLeadEn: z.string(),
  overviewLeadZh: z.string(),
  calloutTitleEn: z.string(),
  calloutTitleZh: z.string(),
  calloutBodyEn: z.string(),
  calloutBodyZh: z.string(),
});

const specsSchema = z.object({
  specs: z.array(specSchema),
  packaging: z.array(z.string()),
});

const detectionSchema = z.object({
  detection: z.array(z.string()),
  audienceEn: z.string(),
  audienceZh: z.string(),
});

const featuresSchema = z.object({
  ribbon: z.array(z.string()),
});

const trustSchema = z.object({
  trust: z.array(z.string()),
  warranty: z.array(z.string()),
  afterSales: z.array(z.string()),
  includedEn: z.string(),
  includedZh: z.string(),
  includedNoteEn: z.string(),
  includedNoteZh: z.string(),
});

const termsSchema = z.object({
  terms: z.array(z.string()),
});

const titlesSchema = z.object({
  sectionTitles: z.record(z.string()),
});

const aboutSchema = z.object({
  aboutPage: z.boolean(),
  aboutEn: z.string(),
  aboutZh: z.string(),
  footerTaglineEn: z.string(),
  footerTaglineZh: z.string(),
});

/* ------------------------------------------------------------------ */
/*  Section registry                                                   */
/* ------------------------------------------------------------------ */

export const SECTIONS: SectionDef[] = [
  {
    id: "model",
    label: "Model & product",
    fields: [
      {
        kind: "text",
        label: "Model code",
        path: "modelCode",
        search: "model code sku",
      },
      {
        kind: "text",
        label: "HS code",
        path: "hsCode",
        search: "hs code tariff",
      },
      {
        kind: "bilingual",
        label: "Title lines",
        enPath: "titleLinesEn",
        zhPath: "titleLinesZh",
        search: "title heading",
      },
      {
        kind: "bilingual",
        label: "Tagline",
        enPath: "taglineEn",
        zhPath: "taglineZh",
        search: "tagline slogan",
      },
      {
        kind: "bilingual",
        label: "Overview lead",
        enPath: "overviewLeadEn",
        zhPath: "overviewLeadZh",
        search: "overview intro lead",
      },
      {
        kind: "bilingual",
        label: "Callout title",
        enPath: "calloutTitleEn",
        zhPath: "calloutTitleZh",
        search: "callout highlight",
      },
      {
        kind: "bilingual",
        label: "Callout body",
        enPath: "calloutBodyEn",
        zhPath: "calloutBodyZh",
        search: "callout body",
      },
    ],
    pick: (p) => ({
      modelCode: p.modelCode,
      hsCode: p.hsCode,
      titleLinesEn: p.titleLinesEn,
      titleLinesZh: p.titleLinesZh,
      taglineEn: p.taglineEn,
      taglineZh: p.taglineZh,
      overviewLeadEn: p.overviewLeadEn,
      overviewLeadZh: p.overviewLeadZh,
      calloutTitleEn: p.calloutTitleEn,
      calloutTitleZh: p.calloutTitleZh,
      calloutBodyEn: p.calloutBodyEn,
      calloutBodyZh: p.calloutBodyZh,
    }),
    schema: modelSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof modelSchema>) }),
  },

  {
    id: "variants",
    label: "Variant & price",
    fields: [],
    pick: (p) => p.variants,
    schema: variantsSchema,
    apply: (p, data) => ({ ...p, variants: data as Product["variants"] }),
  },

  {
    id: "specs",
    label: "Specs & packaging",
    fields: [
      {
        kind: "specs",
        label: "Specifications",
        path: "specs",
        search: "specs specification",
      },
      {
        kind: "list",
        label: "Packaging",
        path: "packaging",
        search: "packaging box contents",
      },
    ],
    pick: (p) => ({ specs: p.specs, packaging: p.packaging }),
    schema: specsSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof specsSchema>) }),
  },

  {
    id: "detection",
    label: "Detection & audience",
    fields: [
      {
        kind: "list",
        label: "Detection",
        path: "detection",
        search: "detection sensor",
      },
      {
        kind: "bilingual",
        label: "Audience",
        enPath: "audienceEn",
        zhPath: "audienceZh",
        search: "audience market",
      },
    ],
    pick: (p) => ({
      detection: p.detection,
      audienceEn: p.audienceEn,
      audienceZh: p.audienceZh,
    }),
    schema: detectionSchema,
    apply: (p, data) => ({
      ...p,
      ...(data as z.infer<typeof detectionSchema>),
    }),
  },

  {
    id: "features",
    label: "Features",
    fields: [
      {
        kind: "list",
        label: "Feature ribbon",
        path: "ribbon",
        search: "features ribbon highlights",
      },
    ],
    pick: (p) => ({ ribbon: p.ribbon }),
    schema: featuresSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof featuresSchema>) }),
  },

  {
    id: "trust",
    label: "Trust / Warranty / After-sales / Included",
    fields: [
      {
        kind: "list",
        label: "Trust badges",
        path: "trust",
        search: "trust certification ce fcc",
      },
      {
        kind: "list",
        label: "Warranty",
        path: "warranty",
        search: "warranty guarantee",
      },
      {
        kind: "list",
        label: "After-sales",
        path: "afterSales",
        search: "after sales support service",
      },
      {
        kind: "bilingual",
        label: "Included",
        enPath: "includedEn",
        zhPath: "includedZh",
        search: "included box contents",
      },
      {
        kind: "bilingual",
        label: "Included note",
        enPath: "includedNoteEn",
        zhPath: "includedNoteZh",
        search: "included note",
      },
    ],
    pick: (p) => ({
      trust: p.trust,
      warranty: p.warranty,
      afterSales: p.afterSales,
      includedEn: p.includedEn,
      includedZh: p.includedZh,
      includedNoteEn: p.includedNoteEn,
      includedNoteZh: p.includedNoteZh,
    }),
    schema: trustSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof trustSchema>) }),
  },

  {
    id: "terms",
    label: "Commercial terms",
    fields: [
      {
        kind: "list",
        label: "Terms",
        path: "terms",
        search: "terms commercial pricing",
      },
    ],
    pick: (p) => ({ terms: p.terms }),
    schema: termsSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof termsSchema>) }),
  },

  {
    id: "titles",
    label: "Section titles",
    fields: [
      {
        kind: "record",
        label: "Section titles",
        path: "sectionTitles",
        search: "section titles headings",
      },
    ],
    pick: (p) => ({ sectionTitles: p.sectionTitles }),
    schema: titlesSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof titlesSchema>) }),
  },

  {
    id: "about",
    label: "About",
    fields: [
      {
        kind: "bool",
        label: "About page",
        path: "aboutPage",
        search: "about page toggle",
      },
      {
        kind: "bilingual",
        label: "About",
        enPath: "aboutEn",
        zhPath: "aboutZh",
        search: "about description",
      },
      {
        kind: "bilingual",
        label: "Footer tagline",
        enPath: "footerTaglineEn",
        zhPath: "footerTaglineZh",
        search: "footer tagline",
      },
    ],
    pick: (p) => ({
      aboutPage: p.aboutPage,
      aboutEn: p.aboutEn,
      aboutZh: p.aboutZh,
      footerTaglineEn: p.footerTaglineEn,
      footerTaglineZh: p.footerTaglineZh,
    }),
    schema: aboutSchema,
    apply: (p, data) => ({ ...p, ...(data as z.infer<typeof aboutSchema>) }),
  },
];

/* ------------------------------------------------------------------ */
/*  Variant sub-fields (rendered as tabs in the variants section)      */
/* ------------------------------------------------------------------ */

export const VARIANT_KEYS = ["touchscreen", "button"] as const;
export type VariantKey = (typeof VARIANT_KEYS)[number];

export const VARIANT_FIELDS: FieldDef[] = [
  {
    kind: "bilingual",
    label: "Edition",
    enPath: "editionEn",
    zhPath: "editionZh",
    search: "edition name",
  },
  {
    kind: "bilingual",
    label: "Kicker",
    enPath: "kickerEn",
    zhPath: "kickerZh",
    search: "kicker",
  },
  {
    kind: "bilingual",
    label: "Badge",
    enPath: "badgeEn",
    zhPath: "badgeZh",
    search: "badge",
  },
  {
    kind: "price",
    label: "Price",
    path: "price",
    search: "price currency value",
  },
  {
    kind: "list",
    label: "Features",
    path: "features",
    search: "variant features",
  },
];

/* ------------------------------------------------------------------ */
/*  Search helper                                                      */
/* ------------------------------------------------------------------ */

export function fieldMatches(field: FieldDef, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    field.label.toLowerCase().includes(q) ||
    field.search.toLowerCase().includes(q)
  );
}

export function sectionMatches(section: SectionDef, query: string): boolean {
  if (!query) return true;
  if (section.label.toLowerCase().includes(query.toLowerCase())) return true;
  if (section.id === "variants") {
    return VARIANT_FIELDS.some((f) => fieldMatches(f, query));
  }
  return section.fields.some((f) => fieldMatches(f, query));
}

/* ------------------------------------------------------------------ */
/*  Price schema reuse                                                 */
/* ------------------------------------------------------------------ */

export { priceSchema, variantSchema };
