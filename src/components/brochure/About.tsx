import type { BrochureCtx } from "./context";
import { pick } from "./context";

/**
 * P6 — About (optional).
 * Company / product story page.
 */

export function About({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const about = pick(ctx, p.aboutEn, p.aboutZh);
  const sectionTitle = pick(ctx, "About", "关于");
  const footerTagline = pick(ctx, p.footerTaglineEn, p.footerTaglineZh);

  return (
    <div className="flex h-full w-full flex-col">
      {/* section header */}
      <div className="flex items-center gap-3">
        <span
          className="f-display text-[40px] font-bold leading-none"
          style={{ color: "var(--t-accent)" }}
        >
          05
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

      <div className="mt-6 flex flex-1 flex-col justify-center">
        <p className="f-display text-[22px] font-medium leading-relaxed">
          {about}
        </p>

        <div
          className="mt-8 h-[3px] w-16"
          style={{ backgroundColor: "var(--t-accent)" }}
        />

        <p
          className="mt-4 f-display text-[15px] italic"
          style={{ color: "var(--t-grey)" }}
        >
          {footerTagline}
        </p>
      </div>
    </div>
  );
}
