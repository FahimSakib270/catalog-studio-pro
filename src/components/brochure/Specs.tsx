import type { BrochureCtx } from "./context";
import { pick } from "./context";

/**
 * P4 — Specs.
 * "03" numeral, specs + packaging tables per tableStyle, "✱ customizable".
 */

function SpecTable({ ctx }: { ctx: BrochureCtx }) {
  const style = ctx.template.tableStyle;
  const rows = ctx.product.specs;
  const label = (s: { en: string; zh: string }) =>
    ctx.lang === "en" ? s.en : s.zh;

  if (style === "grid") {
    return (
      <div
        className="grid grid-cols-2 gap-px"
        style={{ backgroundColor: "var(--t-hairline)", breakInside: "avoid" }}
      >
        {rows.map((s, i) => (
          <div
            key={i}
            className="p-2.5"
            style={{ backgroundColor: "var(--t-paper)" }}
          >
            <div
              className="f-mono text-[8px] uppercase tracking-[0.14em]"
              style={{ color: "var(--t-grey)" }}
            >
              {label(s)}
            </div>
            <div className="mt-1 text-[11px] font-semibold">{s.val}</div>
          </div>
        ))}
      </div>
    );
  }
  if (style === "boxed") {
    return (
      <div
        className="overflow-hidden rounded-sm border"
        style={{ borderColor: "var(--t-hairline)", breakInside: "avoid" }}
      >
        {rows.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b px-3 py-2 last:border-b-0"
            style={{ borderColor: "var(--t-hairline)" }}
          >
            <span className="text-[10px]" style={{ color: "var(--t-grey)" }}>
              {label(s)}
            </span>
            <span className="text-[11px] font-semibold">{s.val}</span>
          </div>
        ))}
      </div>
    );
  }
  if (style === "mono") {
    return (
      <div className="space-y-1" style={{ breakInside: "avoid" }}>
        {rows.map((s, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4">
            <span
              className="f-mono text-[9px] uppercase tracking-[0.12em]"
              style={{ color: "var(--t-grey)" }}
            >
              {label(s)}
            </span>
            <span
              className="flex-1 border-b border-dotted"
              style={{ borderColor: "var(--t-hairline)" }}
            />
            <span className="f-mono text-[10px]">{s.val}</span>
          </div>
        ))}
      </div>
    );
  }
  // magazine / classic
  return (
    <div style={{ breakInside: "avoid" }}>
      {rows.map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b py-2"
          style={{ borderColor: "var(--t-hairline)" }}
        >
          <span className="text-[10px]" style={{ color: "var(--t-grey)" }}>
            {label(s)}
          </span>
          <span className="text-[11px] font-semibold">{s.val}</span>
        </div>
      ))}
    </div>
  );
}

function PackagingTable({ ctx }: { ctx: BrochureCtx }) {
  const items = ctx.product.packaging;
  return (
    <div style={{ breakInside: "avoid" }}>
      {items.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-2 border-b py-1.5"
          style={{ borderColor: "var(--t-hairline)" }}
        >
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
            style={{
              backgroundColor: "var(--t-accent)",
              color: "var(--t-paper)",
            }}
          >
            {i + 1}
          </span>
          <span className="text-[10px]">{p}</span>
        </div>
      ))}
    </div>
  );
}

export function Specs({ ctx }: { ctx: BrochureCtx }) {
  const sectionTitle = pick(ctx, "Specifications", "规格");

  const packagingTitle = pick(ctx, "Packaging", "包装清单");
  const customizable = pick(ctx, "✱ customizable", "✱ 可定制");

  return (
    <div className="flex h-full w-full flex-col">
      {/* section header */}
      <div className="flex items-center gap-3">
        <span
          className="f-display text-[40px] font-bold leading-none"
          style={{ color: "var(--t-accent)" }}
        >
          03
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

      <div className="mt-5 grid flex-1 grid-cols-5 gap-6">
        {/* specs table (3 cols) */}
        <div className="col-span-3">
          <SpecTable ctx={ctx} />
          <div
            className="mt-3 f-mono text-[8px] uppercase tracking-[0.14em]"
            style={{ color: "var(--t-accent)" }}
          >
            {customizable}
          </div>
        </div>

        {/* packaging (2 cols) */}
        <div className="col-span-2">
          <div
            className="f-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--t-grey)" }}
          >
            {packagingTitle}
          </div>
          <div className="mt-3">
            <PackagingTable ctx={ctx} />
          </div>
        </div>
      </div>
    </div>
  );
}
