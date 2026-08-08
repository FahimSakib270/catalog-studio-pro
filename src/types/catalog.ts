import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  schemaVersion-2 product data shape                                 */
/* ------------------------------------------------------------------ */

export const priceSchema = z.object({
  currency: z.string(),
  value: z.number(),
  labelEn: z.string(),
  labelZh: z.string(),
  perSetEn: z.string(),
  perSetZh: z.string(),
});

export type Price = z.infer<typeof priceSchema>;

export const variantSchema = z.object({
  editionEn: z.string(),
  editionZh: z.string(),
  kickerEn: z.string(),
  kickerZh: z.string(),
  badgeEn: z.string(),
  badgeZh: z.string(),
  price: priceSchema,
  features: z.array(z.string()),
});

export type Variant = z.infer<typeof variantSchema>;

export const variantsSchema = z.object({
  touchscreen: variantSchema,
  button: variantSchema,
});

export type Variants = z.infer<typeof variantsSchema>;

export const imagesSchema = z.object({
  logo: z.string(),
  product: z.string(),
  inUse: z.string(),
  qr: z.string(),
});

export type Images = z.infer<typeof imagesSchema>;

export const specSchema = z.object({
  en: z.string(),
  zh: z.string(),
  val: z.string(),
});

export type Spec = z.infer<typeof specSchema>;

export const productSchema = z.object({
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
  specs: z.array(specSchema),
  packaging: z.array(z.string()),
  ribbon: z.array(z.string()),
  detection: z.array(z.string()),
  audienceEn: z.string(),
  audienceZh: z.string(),
  trust: z.array(z.string()),
  warranty: z.array(z.string()),
  afterSales: z.array(z.string()),
  includedEn: z.string(),
  includedNoteEn: z.string(),
  includedZh: z.string(),
  includedNoteZh: z.string(),
  terms: z.array(z.string()),
  sectionTitles: z.record(z.string()),
  footerTaglineEn: z.string(),
  footerTaglineZh: z.string(),
  aboutPage: z.boolean(),
  aboutEn: z.string(),
  aboutZh: z.string(),
  variants: variantsSchema,
  images: imagesSchema,
  templateId: z.string(),
});

export type Product = z.infer<typeof productSchema>;

/* ------------------------------------------------------------------ */
/*  Template                                                           */
/* ------------------------------------------------------------------ */

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Template = z.infer<typeof templateSchema>;

/* ------------------------------------------------------------------ */
/*  Language                                                           */
/* ------------------------------------------------------------------ */

export type Lang = "en" | "zh";

/* ------------------------------------------------------------------ */
/*  Import result                                                      */
/* ------------------------------------------------------------------ */

export type ImportResult =
  | { ok: true; product: Product }
  | { ok: false; errors: string[] };
