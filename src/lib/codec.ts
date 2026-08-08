import {
  productSchema,
  type Product,
  type ImportResult,
} from "../types/catalog";

/* ------------------------------------------------------------------ */
/*  Pipe textarea parse / serialize                                    */
/* ------------------------------------------------------------------ */

/**
 * Serialize a product to a compact, pretty-printed JSON string suitable
 * for the "pipe" textarea (Import/Export JSON).
 */
export function serializeProduct(product: Product): string {
  return JSON.stringify(product, null, 2);
}

/**
 * Parse raw text from the pipe textarea and validate it against the
 * schemaVersion-2 product schema. Returns a discriminated result so the
 * caller can surface exact field errors.
 */
export function parseProduct(raw: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    return { ok: false, errors: [`JSON parse error: ${message}`] };
  }

  const result = productSchema.safeParse(data);
  if (result.success) {
    return { ok: true, product: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });

  return { ok: false, errors };
}
