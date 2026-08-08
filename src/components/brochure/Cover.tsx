import type { BrochureCtx } from "./context";
import { pick, titleLines } from "./context";
import type { RibbonStyle } from "../../lib/templates";

/**
 * P1 — Cover.
 * Renders per coverLayout: stacked display title, accent rule, edition accent,
 * italic tagline, photo framed w/ corner ticks (or stat fallback), trust pills,
 * 3-col ribbon per ribbonStyle, company band.
 */

function Ribbon({ ctx, style }: { ctx: BrochureCtx; style: RibbonStyle }) {
  const items = ctx.product.ribbon;
  if (style === "pill") {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((r, i) => (
          <span
            key={i}
            className="rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{
              backgroundColor: "var(--t-accent)",
              color: "var(--t-paper)",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    );
  }
  if (style === "hairline") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((r, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em]"
          >
            <span
              className="inline-block h-2 w-2"
              style={{ backgroundColor: "var(--t-accent)" }}
            />
            {r}
          </span>
        ))}
      </div>
    );
  }
  if (style === "band") {
    return (
      <div
        className="flex flex-wrap gap-x-8 gap-y-2 px-4 py-2"
        style={{ backgroundColor: "var(--t-accent)" }}
      >
        {items.map((r, i) => (
          <span
            key={i}
            className="text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--t-paper)" }}
          >
            {r}
          </span>
        ))}
      </div>
    );
  }
  // tag
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((r, i) => (
        <span
          key={i}
          className="border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]"
          style={{
            borderColor: "var(--t-accent)",
            color: "var(--t-accent)",
          }}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

function TrustPills({ ctx }: { ctx: BrochureCtx }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ctx.product.trust.map((t, i) => (
        <span
          key={i}
          className="rounded-sm border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em]"
          style={{
            borderColor: "var(--t-hairline)",
            color: "var(--t-grey)",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/** Photo frame with corner ticks, or a stat fallback when no image. */
function PhotoFrame({ ctx }: { ctx: BrochureCtx }) {
  const src = ctx.product.images.product;
  if (src) {
    return (
      <div className="relative">
        <img
          src={src}
          alt={ctx.product.modelCode}
          className="h-full w-full object-cover"
        />
        <CornerTicks />
      </div>
    );
  }
  // stat fallback
  const v = ctx.product.variants.touchscreen;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-1"
      style={{ backgroundColor: "var(--t-hairline)" }}
    >
      <span
        className="f-display text-5xl font-bold"
        style={{ color: "var(--t-accent)" }}
      >
        {v.price.value}
      </span>
      <span
        className="f-mono text-[9px] uppercase tracking-[0.18em]"
        style={{ color: "var(--t-grey)" }}
      >
        {v.price.currency}
      </span>
      <CornerTicks />
    </div>
  );
}

function CornerTicks() {
  const c = "absolute h-3 w-3 border-[var(--t-accent)]";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

function CompanyBand({ ctx }: { ctx: BrochureCtx }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-2.5"
      style={{ backgroundColor: "var(--t-accent2)" }}
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
        {pick(ctx, "Product Brochure", "产品手册")}
      </span>
    </div>
  );
}

export function Cover({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const lines = titleLines(ctx);
  const tagline = pick(ctx, p.taglineEn, p.taglineZh);
  const edition = pick(
    ctx,
    p.variants.touchscreen.editionEn,
    p.variants.touchscreen.editionZh,
  );
  const kicker = pick(
    ctx,
    p.variants.touchscreen.kickerEn,
    p.variants.touchscreen.kickerZh,
  );

  return (
    <div className="flex h-full w-full flex-col">
      {/* top strip */}
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="f-mono text-[9px] uppercase tracking-[0.18em]">
          {p.modelCode}
        </span>
        <span className="f-mono text-[9px] uppercase tracking-[0.18em]">
          {p.hsCode}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4">
        {/* kicker */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block h-2 w-2"
            style={{ backgroundColor: "var(--t-accent)" }}
          />
          <span className="f-mono text-[9px] font-semibold uppercase tracking-[0.2em]">
            {kicker}
          </span>
        </div>

        {/* title */}
        <h1 className="f-display text-[44px] font-bold leading-[0.95] tracking-tight">
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </h1>

        {/* accent rule */}
        <div
          className="mt-4 h-[3px] w-24"
          style={{ backgroundColor: "var(--t-accent)" }}
        />

        {/* edition accent */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{
              backgroundColor: "var(--t-accent)",
              color: "var(--t-paper)",
            }}
          >
            {edition}
          </span>
        </div>

        {/* tagline */}
        <p
          className="mt-4 max-w-md text-[12px] italic leading-relaxed"
          style={{ color: "var(--t-grey)" }}
        >
          {tagline}
        </p>

        {/* photo / stat */}
        <div className="mt-6 h-40 w-full">
          <PhotoFrame ctx={ctx} />
        </div>

        {/* trust pills */}
        <div className="mt-5">
          <TrustPills ctx={ctx} />
        </div>
      </div>

      {/* ribbon */}
      <div className="px-6 pb-4 pt-2">
        <Ribbon ctx={ctx} style={ctx.template.ribbonStyle} />
      </div>

      {/* company band */}
      <CompanyBand ctx={ctx} />
    </div>
  );
}
