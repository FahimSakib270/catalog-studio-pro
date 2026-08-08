import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCatalog, useActiveProduct } from "../../store/catalog";
import { Toolbar } from "./Toolbar";
import { PageRail } from "./PageRail";
import { ZoomControls } from "./ZoomControls";
import { Toasts } from "./Toasts";
import { BrochurePageView, buildPages } from "../brochure/Brochure";
import type { BrochurePage } from "../brochure/Brochure";

/* ------------------------------------------------------------------ */
/*  Studio shell — pro design tool workspace                           */
/* ------------------------------------------------------------------ */

const A4_RATIO = 297 / 210; // height / width

export function Shell() {
  const lang = useCatalog((s) => s.lang);
  const product = useActiveProduct();
  const templateId = useCatalog(
    (s) => s.templateIds[s.activeId] ?? "onyx-editorial",
  );

  const [zoom, setZoom] = useState(100);
  const [activePageId, setActivePageId] = useState("cover");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* real brochure pages for the active product */
  const pages: BrochurePage[] = useMemo(
    () => (product ? buildPages(product, lang) : []),
    [product, lang],
  );

  /* scroll to a page when selected from the rail */
  const scrollToPage = useCallback((id: string) => {
    const el = pageRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActivePageId(id);
    }
  }, []);

  /* track active page while scrolling */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      let current = pages[0].id;
      for (const page of pages) {
        const el = pageRefs.current[page.id];
        if (el && el.offsetTop - container.scrollTop <= 120) {
          current = page.id;
        }
      }
      setActivePageId(current);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [pages]);

  const fitZoom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const availW = container.clientWidth - 96;
    const availH = container.clientHeight - 96;
    const fit = Math.min(availW / 210, availH / 297) * 100;
    setZoom(Math.round(Math.min(150, Math.max(50, fit))));
  }, []);

  useEffect(() => {
    fitZoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageWidth = 210 * (zoom / 100);
  const pageHeight = pageWidth * A4_RATIO;

  return (
    <div className="workspace-bg relative flex h-full w-full overflow-hidden">
      {/* subtle grid overlay */}
      <div className="workspace-grid pointer-events-none absolute inset-0" />

      {/* left page rail */}
      <PageRail
        pages={pages}
        activePageId={activePageId}
        onSelect={scrollToPage}
      />

      {/* center preview */}
      <main className="relative flex-1 overflow-hidden">
        <Toolbar />

        {/* zoom controls */}
        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
          <ZoomControls zoom={zoom} onZoomChange={setZoom} onFit={fitZoom} />
        </div>

        {/* scrollable A4 pages */}
        <div
          ref={scrollRef}
          className="scroll-thin h-full overflow-y-auto px-12 pb-24 pt-24"
        >
          <div className="mx-auto flex w-fit flex-col items-center gap-10">
            {pages.map((page, index) => (
              <div
                key={page.id}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
                className="relative"
              >
                {/* page number */}
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500">
                    {page.label}
                  </span>
                  <span className="font-mono text-[11px] text-ink-700">
                    {index + 1} / {pages.length}
                  </span>
                </div>

                {/* A4 sheet */}
                <div
                  className="relative overflow-hidden rounded-sm bg-white shadow-panel"
                  style={{ width: pageWidth, height: pageHeight }}
                >
                  {product && (
                    <BrochurePageView
                      product={product}
                      lang={lang}
                      templateId={templateId}
                      pageId={page.id}
                      pageNum={index + 1}
                      total={pages.length}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Toasts />
    </div>
  );
}
