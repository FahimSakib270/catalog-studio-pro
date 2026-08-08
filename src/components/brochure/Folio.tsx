import type { ReactNode } from "react";
import type { BrochureCtx } from "./context";
import { pick } from "./context";

/**
 * Uniform folio frame applied to every page.
 * Top: logo | "MODEL · HS"   Bottom: brand | "website · Page n/N"
 * Vertical accent tick on the left. Identical geometry everywhere.
 */

export function Folio({
  ctx,
  pageNum,
  total,
  children,
}: {
  ctx: BrochureCtx;
  pageNum: number;
  total: number;
  children: ReactNode;
}) {
  const p = ctx.product;
  const brand = pick(ctx, "Catalog Studio Pro", "目录工作室");
  const website = "www.catalogstudio.pro";
  const pageLabel = pick(ctx, "Page", "页");

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* vertical accent tick (left) */}
      <div
        className="absolute left-0 top-0 h-full w-[6px]"
        style={{ backgroundColor: "var(--t-accent)" }}
      />

      {/* top bar */}
      <div className="flex items-center justify-between pl-6 pr-8 pt-6">
        <div className="flex items-center gap-3">
          {/* logo mark */}
          <div
            className="flex h-7 w-7 items-center justify-center rounded-sm"
            style={{ backgroundColor: "var(--t-accent)" }}
          >
            <span
              className="f-display text-[13px] font-bold leading-none"
              style={{ color: "var(--t-paper)" }}
            >
              {p.modelCode.slice(0, 1)}
            </span>
          </div>
          <span className="f-display text-[13px] font-semibold tracking-tight">
            {p.modelCode}
          </span>
        </div>
        <span className="f-mono text-[9px] uppercase tracking-[0.18em]">
          {p.modelCode} · {p.hsCode}
        </span>
      </div>

      {/* hairline under top bar */}
      <div
        className="mx-6 mt-4 h-px"
        style={{ backgroundColor: "var(--t-hairline)" }}
      />

      {/* page body */}
      <div className="flex-1 pl-6 pr-8 pt-5">{children}</div>

      {/* bottom bar */}
      <div
        className="mx-6 mb-5 mt-4 h-px"
        style={{ backgroundColor: "var(--t-hairline)" }}
      />
      <div className="flex items-center justify-between px-6 pb-5 pl-6 pr-8">
        <span className="f-mono text-[8px] uppercase tracking-[0.18em]">
          {brand}
        </span>
        <span className="f-mono text-[8px] uppercase tracking-[0.18em]">
          {website} · {pageLabel} {pageNum}/{total}
        </span>
      </div>
    </div>
  );
}
