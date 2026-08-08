import { useCatalog, useActiveProduct } from "../../store/catalog";
import { BrochurePageView, buildPages } from "./Brochure";

/**
 * PrintRoot — hidden A4 print tree.
 *
 * Always mounted so fonts + data-URL images are ready. Hidden on screen
 * (display:none) and shown only in @media print. Each page is a full A4
 * sheet (210mm × 297mm) with page-break-after. Reads live store state so
 * the PDF always reflects the current lang + variant + template.
 */
export function PrintRoot() {
  const lang = useCatalog((s) => s.lang);
  const product = useActiveProduct();
  const templateId = useCatalog(
    (s) => s.templateIds[s.activeId] ?? "onyx-editorial",
  );

  if (!product) return null;
  const pages = buildPages(product, lang);

  return (
    <div id="printRoot" aria-hidden="true">
      {pages.map((page, i) => (
        <div key={page.id} className="page">
          <BrochurePageView
            product={product}
            lang={lang}
            templateId={templateId}
            pageId={page.id}
            pageNum={i + 1}
            total={pages.length}
          />
        </div>
      ))}
    </div>
  );
}
