import { TEMPLATES } from "../../lib/templates";
import { useCatalog, useActiveProduct } from "../../store/catalog";
import { CoverThumb } from "../brochure/CoverThumb";
import { useToast } from "./Toasts";

/**
 * GalleryModal — 10-card grid of live cover previews.
 * Click applies the template (saves templateId) and crossfades the preview.
 */

export function GalleryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lang = useCatalog((s) => s.lang);
  const activeId = useCatalog((s) => s.activeId);
  const templateIds = useCatalog((s) => s.templateIds);
  const setTemplateId = useCatalog((s) => s.setTemplateId);
  const product = useActiveProduct();
  const toast = useToast();

  if (!open || !product) return null;

  const current = templateIds[activeId];

  function apply(id: string) {
    setTemplateId(activeId, id);
    const t = TEMPLATES.find((x) => x.id === id);
    toast.success("Design applied", t?.name ?? id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6">
      <div className="animate-fade-in flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-workspace-600 bg-workspace-800 shadow-panel">
        {/* header */}
        <div className="flex items-center justify-between border-b border-workspace-700 px-5 py-3">
          <div>
            <h3 className="font-grotesk text-sm font-semibold text-ink-100">
              {lang === "en" ? "Designs" : "设计"}
            </h3>
            <p className="text-[11px] text-ink-500">
              {lang === "en"
                ? "Choose a template for this product"
                : "为此产品选择模板"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-ink-500 transition-colors hover:text-ink-100"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2l8 8M10 2l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* grid */}
        <div className="scroll-thin grid flex-1 grid-cols-2 gap-4 overflow-y-auto p-5 sm:grid-cols-3 lg:grid-cols-5">
          {TEMPLATES.map((t) => {
            const active = t.id === current;
            return (
              <button
                key={t.id}
                onClick={() => apply(t.id)}
                className={`lift group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors ${
                  active
                    ? "border-accent-500/70 bg-workspace-700"
                    : "border-workspace-600 bg-workspace-850 hover:border-workspace-500"
                }`}
              >
                <CoverThumb product={product} lang={lang} templateId={t.id} />
                <span className="mt-1 text-[11px] font-medium text-ink-100">
                  {t.name}
                </span>
                {active && (
                  <span className="rounded-full bg-accent-600 px-2 py-0.5 text-[9px] font-semibold text-workspace-950">
                    {lang === "en" ? "Active" : "当前"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
