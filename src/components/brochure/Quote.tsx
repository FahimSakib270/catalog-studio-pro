import type { BrochureCtx } from "./context";
import { pick } from "./context";
import { SmartImage } from "./SmartImage";

/**
 * P5 — Quote. 2-col stretch, no empty areas.
 *   LEFT:  "In the Box" (top) → in-use photo fills the rest.
 *   RIGHT: big price (top) → warranty list pinned to the bottom (mt-auto).
 */

export function Quote({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const sectionTitle = pick(ctx, "Pricing", "报价");
  const v = p.variants.touchscreen;
  const price = v.price;
  const currencyLabel = pick(ctx, price.labelEn, price.labelZh);
  const perSet = pick(ctx, price.perSetEn, price.perSetZh);
  const included = pick(ctx, p.includedEn, p.includedZh);
  const includedNote = pick(ctx, p.includedNoteEn, p.includedNoteZh);
  const warrantyTitle = pick(ctx, "Warranty & Support", "质保与服务");
  const includedTitle = pick(ctx, "In the Box", "包装内容");
  const inUseImg = p.images.inUse;

  return (
    <div className="flex h-full w-full flex-col">
      {/* section header */}
      <div className="flex items-center gap-3">
        <span
          className="f-display text-[40px] font-bold leading-none"
          style={{ color: "var(--t-accent)" }}
        >
          04
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

      <div className="mt-5 grid flex-1 grid-cols-2 gap-6">
        {/* LEFT: in-box top + in-use photo fills */}
        <div className="flex flex-col">
          <div
            className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--t-grey)" }}
          >
            {includedTitle}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed">{included}</p>
          <p
            className="mt-1 f-mono text-[8px] uppercase tracking-[0.12em]"
            style={{ color: "var(--t-accent)" }}
          >
            {includedNote}
          </p>

          {/* in-use photo fills the remaining column height */}
          <div className="mt-4 flex flex-1 flex-col">
            {inUseImg.dataUrl ? (
              <SmartImage
                src={inUseImg.dataUrl}
                alt="in use"
                ratio={inUseImg.ratio}
                variant="inUse"
                stageHeight="100%"
                className="flex-1"
              />
            ) : (
              <div
                className="flex flex-1 items-center justify-center rounded-sm border"
                style={{
                  borderColor: "var(--t-hairline)",
                  backgroundColor: "var(--t-hairline)",
                  breakInside: "avoid",
                }}
              >
                <span
                  className="f-mono text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--t-grey)" }}
                >
                  {pick(ctx, "In-use photo", "使用场景图")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: price top + warranty bottom */}
        <div className="flex flex-col">
          {/* big price */}
          <div className="flex items-end gap-2">
            <span
              className="f-display text-[64px] font-bold leading-none"
              style={{ color: "var(--t-accent)" }}
            >
              {price.value}
            </span>
            <div className="pb-1">
              <div className="f-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
                {currencyLabel}
              </div>
              <div
                className="f-mono text-[9px] uppercase tracking-[0.14em]"
                style={{ color: "var(--t-grey)" }}
              >
                {perSet}
              </div>
            </div>
          </div>

          {/* warranty pinned to the bottom */}
          <div className="mt-auto">
            <div
              className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--t-grey)" }}
            >
              {warrantyTitle}
            </div>
            <div className="mt-3 space-y-2">
              {p.warranty.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: "var(--t-accent)" }}
                  />
                  <span className="text-[11px] leading-relaxed">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
