import { useCatalog } from "../../store/catalog";

/* ------------------------------------------------------------------ */
/*  Left page rail — live page thumbnails                              */
/* ------------------------------------------------------------------ */

export interface PageRailProps {
  pages: { id: string; label: string }[];
  activePageId: string;
  onSelect: (id: string) => void;
}

export function PageRail({ pages, activePageId, onSelect }: PageRailProps) {
  const lang = useCatalog((s) => s.lang);

  return (
    <aside className="flex w-44 shrink-0 flex-col border-r border-workspace-800 bg-workspace-900/70 backdrop-blur">
      <div className="flex items-center justify-between px-3 py-3">
        <span className="font-grotesk text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          {lang === "en" ? "Pages" : "页面"}
        </span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-workspace-700 px-1.5 font-mono text-[10px] font-medium text-ink-300">
          {pages.length}
        </span>
      </div>

      <div className="scroll-thin flex-1 space-y-2 overflow-y-auto px-3 pb-4">
        {pages.map((page, index) => {
          const active = page.id === activePageId;
          return (
            <button
              key={page.id}
              onClick={() => onSelect(page.id)}
              className={`lift group relative w-full overflow-hidden rounded-lg border text-left transition-colors ${
                active
                  ? "border-accent-500/60 bg-workspace-800"
                  : "border-workspace-700 bg-workspace-850 hover:border-workspace-600"
              }`}
            >
              {/* mini A4 thumbnail */}
              <div className="flex aspect-[210/297] w-full items-center justify-center bg-workspace-950 p-2">
                <div className="flex h-full w-full flex-col gap-1 rounded-[2px] border border-workspace-700 bg-white p-1.5">
                  <div className="h-1 w-3/4 rounded-sm bg-neutral-300" />
                  <div className="h-1 w-1/2 rounded-sm bg-neutral-200" />
                  <div className="mt-1 h-1 w-full rounded-sm bg-neutral-200" />
                  <div className="h-1 w-5/6 rounded-sm bg-neutral-200" />
                  <div className="h-1 w-2/3 rounded-sm bg-neutral-200" />
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="font-mono text-[10px] text-ink-300">
                  {index + 1}
                </span>
                <span className="truncate text-[10px] text-ink-500">
                  {page.label}
                </span>
              </div>
              {active && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-accent-500" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
