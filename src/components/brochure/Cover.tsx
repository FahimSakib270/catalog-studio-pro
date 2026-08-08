import type { BrochureCtx } from "./context";
import { pick, titleLines } from "./context";
import { SmartImage } from "./SmartImage";

/**
 * COVER — wrapped in Folio (uniform frame).
 * Composition (no empty middle/bottom):
 *   kicker/title/rule/edition/tagline → photo stage (95mm) → trust pills
 *   → margin-top:auto → 3-col ribbon → company band → folio bottom bar.
 */

export function Cover({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const dark = ctx.template.dark.cover;
  const lines = titleLines(ctx);
  const tagline = pick(ctx, p.taglineEn, p.taglineZh);
  const kicker = pick(
    ctx,
    p.variants.touchscreen.kickerEn,
    p.variants.touchscreen.kickerZh,
  );
  const edition = pick(
    ctx,
    p.variants.touchscreen.editionEn,
    p.variants.touchscreen.editionZh,
  );
  const badge = pick(
    ctx,
    p.variants.touchscreen.badgeEn,
    p.variants.touchscreen.badgeZh,
  );
  const trust = p.trust;
  const ribbon = p.ribbon;
  const productImg = p.images.product;

  return (
    <div className="flex h-full w-full flex-col">
      {/* kicker */}
      <div
        className="f-mono text-[9px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "var(--t-accent)" }}
      >
        {kicker}
      </div>

      {/* title */}
      <h1 className="f-display mt-2 text-[44px] font-bold leading-[0.95] tracking-tight">
        {lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </h1>

      {/* rule */}
      <div
        className="mt-4 h-[3px] w-16"
        style={{ backgroundColor: "var(--t-accent)" }}
      />

      {/* edition + badge */}
      <div className="mt-3 flex items-center gap-3">
        <span className="f-display text-[16px] font-semibold">{edition}</span>
        <span
          className="rounded-sm px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]"
          style={{
            backgroundColor: "var(--t-accent)",
            color: "var(--t-paper)",
          }}
        >
          {badge}
        </span>
      </div>

      {/* tagline */}
      <p
        className="mt-2 text-[12px] italic leading-relaxed"
        style={{ color: "var(--t-grey)" }}
      >
        {tagline}
      </p>

      {/* photo stage — 95mm, ratio-hugging frame */}
      <div className="mt-5">
        {productImg.dataUrl ? (
          <SmartImage
            src={productImg.dataUrl}
            alt={p.modelCode}
            ratio={productImg.ratio}
            variant="product"
            dark={dark}
            stageHeight="95mm"
          />
        ) : (
          <div
            className="flex h-[95mm] w-full items-center justify-center"
            style={{
              backgroundColor: dark
                ? "color-mix(in srgb, white 7%, transparent)"
                : "color-mix(in srgb, var(--t-ink) 5%, transparent)",
            }}
          >
            <span
              className="f-mono text-[9px] uppercase tracking-[0.18em]"
              style={{ color: "var(--t-grey)" }}
            >
              {pick(ctx, "Product photo", "产品图")}
            </span>
          </div>
        )}
      </div>

      {/* trust pills */}
      {trust.length > 0 && (
        <div
          className="mt-4 flex flex-wrap gap-2"
          style={{ breakInside: "avoid" }}
        >
          {trust.map((t, i) => (
            <span
              key={i}
              className="rounded-full border px-2.5 py-1 text-[9px]"
              style={{
                borderColor: "var(--t-hairline)",
                color: "var(--t-grey)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* push ribbon + band to the bottom */}
      <div className="mt-auto" />

      {/* 3-col ribbon */}
      <div
        className="grid grid-cols-3 gap-px"
        style={{ backgroundColor: "var(--t-hairline)", breakInside: "avoid" }}
      >
        {ribbon.slice(0, 3).map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-2 py-2.5 text-center"
            style={{
              backgroundColor: "var(--t-paper)",
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
            }}
          >
            <span className="f-mono text-[8px] uppercase tracking-[0.12em]">
              {r}
            </span>
          </div>
        ))}
      </div>

      {/* company band */}
      <div
        className="flex items-center justify-between px-2 py-2.5"
        style={{
          backgroundColor: "var(--t-accent2)",
          breakInside: "avoid",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        <span
          className="f-display text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--t-paper)" }}
        >
          {pick(ctx, "Catalog Studio Pro", "目录工作室")}
        </span>
        <span
          className="f-mono text-[8px] uppercase tracking-[0.16em]"
          style={{ color: "var(--t-paper)" }}
        >
          {p.modelCode} · {p.hsCode}
        </span>
      </div>
    </div>
  );
}
