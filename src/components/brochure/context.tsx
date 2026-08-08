import type { CSSProperties, ReactNode } from "react";
import type { Lang, Product } from "../../types/catalog";
import type { TemplateConfig } from "../../lib/templates";

/**
 * Shared brochure context + helpers.
 *
 * Every page is wrapped in <PageRoot> which:
 *  - applies the template CSS variables (--t-*) via inline style
 *  - adds the lang-zh class when lang === "zh"
 *  - applies the dark paper background inline (with print-color-adjust)
 */

export interface BrochureCtx {
  product: Product;
  lang: Lang;
  template: TemplateConfig;
}

export function pageVars(template: TemplateConfig): CSSProperties {
  const v = template.vars;
  return {
    "--t-ink": v.ink,
    "--t-paper": v.paper,
    "--t-accent": v.accent,
    "--t-accent2": v.accent2,
    "--t-grey": v.grey,
    "--t-hairline": v.hairline,
    "--t-font-display": v.fontDisplay,
    "--t-font-body": v.fontBody,
    "--t-font-mono": v.fontMono,
  } as CSSProperties;
}

/** Root wrapper for a single A4 page. */
export function PageRoot({
  ctx,
  dark,
  className = "",
  children,
}: {
  ctx: BrochureCtx;
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden ${
        ctx.lang === "zh" ? "lang-zh " : ""
      }${className}`}
      style={{
        ...pageVars(ctx.template),
        backgroundColor: dark ? "#0a0a0b" : ctx.template.vars.paper,
        color: ctx.template.vars.ink,
        fontFamily: ctx.template.vars.fontBody,
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {children}
    </div>
  );
}

/** Localized string helper. */
export function pick(ctx: BrochureCtx, en: string, zh: string): string {
  return ctx.lang === "en" ? en : zh;
}

/** Split a multi-line title into lines. */
export function titleLines(ctx: BrochureCtx): string[] {
  const raw =
    ctx.lang === "en" ? ctx.product.titleLinesEn : ctx.product.titleLinesZh;
  return raw.split("\n").filter((l) => l.trim().length > 0);
}
