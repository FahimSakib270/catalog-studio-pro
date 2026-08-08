import type { BrochureCtx } from "./context";
import { pick } from "./context";

/**
 * P2 — Overview.
 * Red numeral "01", serif lead, accent pull-quote, callout box,
 * 2-col detection(5) | audience chips.
 */

export function Overview({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const lead = pick(ctx, p.overviewLeadEn, p.overviewLeadZh);
  const calloutTitle = pick(ctx, p.calloutTitleEn, p.calloutTitleZh);
  const calloutBody = pick(ctx, p.calloutBodyEn, p.calloutBodyZh);
  const audience = pick(ctx, p.audienceEn, p.audienceZh);
  const sectionTitle = pick(ctx, "Overview", "概览");

  return (
    <div className="flex h-full w-full flex-col">
      {/* section header */}
      <div className="flex items-center gap-3">
        <span
          className="f-display text-[40px] font-bold leading-none"
          style={{ color: "var(--t-accent)" }}
        >
          01
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

      {/* serif lead */}
      <p className="f-display mt-5 text-[20px] font-medium leading-snug">
        {lead}
      </p>

      {/* pull-quote */}
      <div
        className="mt-5 border-l-4 pl-4"
        style={{ borderColor: "var(--t-accent)" }}
      >
        <p
          className="f-display text-[15px] italic leading-relaxed"
          style={{ color: "var(--t-accent)" }}
        >
          {calloutTitle}
        </p>
      </div>

      {/* callout box */}
      <div
        className="mt-5 rounded-sm border p-4"
        style={{
          borderColor: "var(--t-hairline)",
          backgroundColor: "var(--t-paper)",
        }}
      >
        <div
          className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--t-accent)" }}
        >
          {calloutTitle}
        </div>
        <p
          className="mt-2 text-[12px] leading-relaxed"
          style={{ color: "var(--t-grey)" }}
        >
          {calloutBody}
        </p>
      </div>

      {/* 2-col: detection | audience */}
      <div className="mt-6 grid flex-1 grid-cols-2 gap-6">
        {/* detection */}
        <div>
          <div
            className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--t-grey)" }}
          >
            {pick(ctx, "Detection", "检测")}
          </div>
          <div className="mt-3 space-y-2">
            {p.detection.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
                  style={{
                    backgroundColor: "var(--t-accent)",
                    color: "var(--t-paper)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-[11px]">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* audience */}
        <div>
          <div
            className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--t-grey)" }}
          >
            {pick(ctx, "Audience", "适用场景")}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed">{audience}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {audience.split(/[,，]/).map((a, i) => (
              <span
                key={i}
                className="rounded-full border px-2.5 py-1 text-[9px]"
                style={{
                  borderColor: "var(--t-hairline)",
                  color: "var(--t-grey)",
                }}
              >
                {a.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
