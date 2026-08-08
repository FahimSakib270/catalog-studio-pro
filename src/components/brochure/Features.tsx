import type { BrochureCtx } from "./context";
import { pick } from "./context";

/**
 * P3 — Features.
 * "02" ghost numbers + variant feature lists.
 */

export function Features({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const sectionTitle = pick(ctx, "Features", "功能");
  const variants = [p.variants.touchscreen, p.variants.button];

  return (
    <div className="flex h-full w-full flex-col">
      {/* section header */}
      <div className="flex items-center gap-3">
        <span
          className="f-display text-[40px] font-bold leading-none"
          style={{ color: "var(--t-accent)" }}
        >
          02
        </span>
        <div>
          <div
            className="f-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "var(--t-grey)" }}
          >
            {sectionTitle}
          </div>
          <div
            className="h-[2px] w-16"
            style={{ backgroundColor: "var(--t-accent)" }}
          />
        </div>
      </div>

      {/* ghost numbers + feature columns */}
      <div className="mt-6 grid flex-1 grid-cols-2 gap-6">
        {variants.map((v, vi) => {
          const edition = pick(ctx, v.editionEn, v.editionZh);
          const kicker = pick(ctx, v.kickerEn, v.kickerZh);
          const badge = pick(ctx, v.badgeEn, v.badgeZh);
          return (
            <div key={vi} className="relative flex flex-col">
              {/* ghost number */}
              <span
                className="f-display pointer-events-none absolute -top-6 right-0 text-[90px] font-bold leading-none opacity-10"
                style={{ color: "var(--t-accent)" }}
              >
                {vi + 1}
              </span>

              <div
                className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--t-accent)" }}
              >
                {kicker}
              </div>
              <h3 className="f-display mt-1 text-[20px] font-semibold leading-tight">
                {edition}
              </h3>
              <span
                className="mt-2 inline-block w-fit rounded-sm px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-paper)",
                }}
              >
                {badge}
              </span>

              <div className="mt-4 space-y-2">
                {v.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="mt-1 inline-block h-1.5 w-1.5 shrink-0"
                      style={{ backgroundColor: "var(--t-accent)" }}
                    />
                    <span className="text-[11px] leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
