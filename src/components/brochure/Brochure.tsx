import type { Lang, Product } from "../../types/catalog";
import { getTemplate } from "../../lib/templates";
import type { BrochureCtx } from "./context";
import { PageRoot } from "./context";
import { Folio } from "./Folio";
import { Cover } from "./Cover";
import { Overview } from "./Overview";
import { Features } from "./Features";
import { Specs } from "./Specs";
import { Quote } from "./Quote";
import { About } from "./About";
import { Contact } from "./Contact";

/**
 * Brochure — assembles the full page set for a product.
 * Each page is wrapped in PageRoot (template vars + lang-zh) and Folio
 * (uniform frame). Cover/Contact use the template's dark flag.
 */

export interface BrochurePage {
  id: string;
  label: string;
}

export function buildPages(product: Product, lang: Lang): BrochurePage[] {
  const pages: BrochurePage[] = [
    { id: "cover", label: lang === "en" ? "Cover" : "封面" },
    { id: "overview", label: lang === "en" ? "Overview" : "概览" },
    { id: "features", label: lang === "en" ? "Features" : "功能" },
    { id: "specs", label: lang === "en" ? "Specs" : "规格" },
    { id: "quote", label: lang === "en" ? "Pricing" : "报价" },
  ];
  if (product.aboutPage) {
    pages.push({ id: "about", label: lang === "en" ? "About" : "关于" });
  }
  pages.push({ id: "contact", label: lang === "en" ? "Contact" : "联系" });
  return pages;
}

export function BrochurePageView({
  product,
  lang,
  templateId,
  pageId,
  pageNum,
  total,
}: {
  product: Product;
  lang: Lang;
  templateId: string;
  pageId: string;
  pageNum: number;
  total: number;
}) {
  const template = getTemplate(templateId);
  const ctx: BrochureCtx = { product, lang, template };
  const dark =
    pageId === "cover"
      ? template.dark.cover
      : pageId === "contact"
        ? template.dark.contact
        : false;

  return (
    <PageRoot ctx={ctx} dark={dark}>
      {pageId === "cover" ? (
        <Cover ctx={ctx} />
      ) : (
        <Folio ctx={ctx} pageNum={pageNum} total={total}>
          {pageId === "overview" && <Overview ctx={ctx} />}
          {pageId === "features" && <Features ctx={ctx} />}
          {pageId === "specs" && <Specs ctx={ctx} />}
          {pageId === "quote" && <Quote ctx={ctx} />}
          {pageId === "about" && <About ctx={ctx} />}
          {pageId === "contact" && <Contact ctx={ctx} />}
        </Folio>
      )}
    </PageRoot>
  );
}

export function Brochure({
  product,
  lang,
  templateId,
}: {
  product: Product;
  lang: Lang;
  templateId: string;
}) {
  const pages = buildPages(product, lang);
  const total = pages.length;

  return (
    <>
      {pages.map((page, i) => (
        <BrochurePageView
          key={page.id}
          product={product}
          lang={lang}
          templateId={templateId}
          pageId={page.id}
          pageNum={i + 1}
          total={total}
        />
      ))}
    </>
  );
}
