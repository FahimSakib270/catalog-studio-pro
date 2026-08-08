import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCatalog, useActiveProduct } from "../../store/catalog";
import { Toolbar } from "./Toolbar";
import { PageRail } from "./PageRail";
import { ZoomControls } from "./ZoomControls";
import { Toasts } from "./Toasts";

/* ------------------------------------------------------------------ */
/*  Studio shell — pro design tool workspace                           */
/* ------------------------------------------------------------------ */

interface PageDef {
  id: string;
  label: string;
}

const A4_RATIO = 297 / 210; // height / width

export function Shell() {
  const lang = useCatalog((s) => s.lang);
  const product = useActiveProduct();

  const [zoom, setZoom] = useState(100);
  const [activePageId, setActivePageId] = useState("cover");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* placeholder pages for phase 1 */
  const pages: PageDef[] = useMemo(
    () => [
      { id: "cover", label: lang === "en" ? "Cover" : "封面" },
      { id: "overview", label: lang === "en" ? "Overview" : "概览" },
      { id: "specs", label: lang === "en" ? "Specs" : "规格" },
      { id: "variants", label: lang === "en" ? "Models" : "型号" },
      { id: "terms", label: lang === "en" ? "Terms" : "条款" },
    ],
    [lang],
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
                  <PlaceholderPage
                    pageId={page.id}
                    product={product}
                    lang={lang}
                  />
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

/* ------------------------------------------------------------------ */
/*  Placeholder A4 page content (phase 1)                              */
/* ------------------------------------------------------------------ */

function PlaceholderPage({
  pageId,
  product,
  lang,
}: {
  pageId: string;
  product?: ReturnType<typeof useActiveProduct>;
  lang: "en" | "zh";
}) {
  const title = product
    ? lang === "en"
      ? product.titleLinesEn
      : product.titleLinesZh
    : "";

  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-900">
      {/* top hairline */}
      <div className="h-1 w-full bg-neutral-900" />

      <div className="flex flex-1 flex-col px-10 py-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
            {product?.modelCode ?? "MODEL"}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
            {pageId}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-4 h-16 w-16 rounded-full border-2 border-dashed border-neutral-300" />
          <h1 className="font-display text-3xl font-semibold leading-tight text-neutral-900">
            {title || "Product Title"}
          </h1>
          <p className="mt-3 max-w-md text-[11px] leading-relaxed text-neutral-500">
            {lang === "en"
              ? "Placeholder page — content renders in a later phase."
              : "占位页面 — 内容将在后续阶段渲染。"}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
          <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">
            Catalog Studio Pro
          </span>
          <span className="font-mono text-[8px] text-neutral-400">
            {lang === "en" ? "Page" : "页"} {pageId}
          </span>
        </div>
      </div>
    </div>
  );
}
