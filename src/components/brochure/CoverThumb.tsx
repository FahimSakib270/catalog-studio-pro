import type { Lang, Product } from "../../types/catalog";
import { getTemplate } from "../../lib/templates";
import type { BrochureCtx } from "./context";
import { PageRoot } from "./context";
import { Cover } from "./Cover";

/**
 * CoverThumb — a live cover rendered at ~0.18 scale.
 * Used by the gallery modal to preview each design.
 */

const SCALE = 0.18;
const A4_W = 210;
const A4_H = 297;

export function CoverThumb({
  product,
  lang,
  templateId,
}: {
  product: Product;
  lang: Lang;
  templateId: string;
}) {
  const template = getTemplate(templateId);
  const ctx: BrochureCtx = { product, lang, template };

  return (
    <div
      className="pointer-events-none overflow-hidden rounded-[2px] shadow-md"
      style={{
        width: A4_W * SCALE,
        height: A4_H * SCALE,
        transform: "scale(1)",
      }}
    >
      <div
        style={{
          width: A4_W,
          height: A4_H,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <PageRoot ctx={ctx} dark={template.dark.cover}>
          <Cover ctx={ctx} />
        </PageRoot>
      </div>
    </div>
  );
}
