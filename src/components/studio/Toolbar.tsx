import { useState } from "react";
import { useCatalog } from "../../store/catalog";
import { useToast } from "./Toasts";
import { parseProduct, serializeProduct } from "../../lib/codec";
import { seedProduct } from "../../lib/seed";
import { printBrochure } from "../../lib/print";
import type { Product } from "../../types/catalog";
import { GalleryModal } from "./GalleryModal";
import { EditPanel, PhotosModal } from "../edit";

/* ------------------------------------------------------------------ */
/*  Floating toolbar — grouped actions with icons + tooltips           */
/* ------------------------------------------------------------------ */

interface ToolButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

function ToolButton({ label, onClick, active, children }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-300 transition-all hover:-translate-y-0.5 hover:bg-workspace-700 hover:text-ink-100 ${
        active ? "bg-workspace-700 text-accent-400" : ""
      }`}
    >
      {children}
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-workspace-600 bg-workspace-800 px-2 py-1 text-[10px] font-medium text-ink-100 opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-workspace-700" />;
}

export function Toolbar() {
  const products = useCatalog((s) => s.products);
  const activeId = useCatalog((s) => s.activeId);
  const lang = useCatalog((s) => s.lang);
  const setLang = useCatalog((s) => s.setLang);
  const setActive = useCatalog((s) => s.setActive);
  const addProduct = useCatalog((s) => s.addProduct);
  const duplicateProduct = useCatalog((s) => s.duplicateProduct);
  const renameProduct = useCatalog((s) => s.renameProduct);
  const deleteProduct = useCatalog((s) => s.deleteProduct);
  const importProduct = useCatalog((s) => s.importProduct);

  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [pipeOpen, setPipeOpen] = useState(false);
  const [pipeText, setPipeText] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);

  const active = products.find((p) => p.modelCode === activeId);

  function handleNew() {
    const copy = JSON.parse(JSON.stringify(seedProduct)) as Product;
    copy.modelCode = `New ${products.length + 1}`;
    addProduct(copy);
    setMenuOpen(false);
    toast.success("Product created", copy.modelCode);
  }

  function handleDuplicate() {
    duplicateProduct(activeId);
    setMenuOpen(false);
    toast.success("Product duplicated");
  }

  function handleRename() {
    setRenameValue(active?.modelCode ?? "");
    setRenaming(true);
    setMenuOpen(false);
  }

  function commitRename() {
    renameProduct(activeId, renameValue);
    setRenaming(false);
    toast.success("Product renamed", renameValue.trim());
  }

  function handleDelete() {
    if (products.length <= 1) {
      toast.error("Cannot delete", "At least one product is required.");
      return;
    }
    deleteProduct(activeId);
    setMenuOpen(false);
    toast.success("Product deleted");
  }

  function handleExport() {
    if (!active) return;
    setPipeText(serializeProduct(active));
    setPipeOpen(true);
  }

  function handleImport() {
    const result = parseProduct(pipeText);
    if (result.ok) {
      importProduct(result.product);
      setPipeOpen(false);
      toast.success("Product imported", result.product.modelCode);
    } else {
      toast.error("Import failed", result.errors.slice(0, 12).join("\n"));
    }
  }

  return (
    <>
      {/* floating toolbar */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-workspace-600 bg-workspace-800/90 p-1.5 shadow-panel backdrop-blur">
          {/* product switcher */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-ink-100 transition-colors hover:bg-workspace-700"
              title="Products"
            >
              <span className="max-w-32 truncate">{active?.modelCode}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 4.5L6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="animate-fade-in absolute left-0 top-11 z-40 w-56 rounded-xl border border-workspace-600 bg-workspace-800 p-1.5 shadow-panel">
                <div className="scroll-thin max-h-48 overflow-y-auto">
                  {products.map((p) => (
                    <button
                      key={p.modelCode}
                      onClick={() => {
                        setActive(p.modelCode);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-workspace-700 ${
                        p.modelCode === activeId
                          ? "text-accent-400"
                          : "text-ink-100"
                      }`}
                    >
                      <span className="truncate">{p.modelCode}</span>
                      {p.modelCode === activeId && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-1 border-t border-workspace-700 pt-1">
                  <button
                    onClick={handleNew}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-100 transition-colors hover:bg-workspace-700"
                  >
                    <PlusIcon /> New
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-100 transition-colors hover:bg-workspace-700"
                  >
                    <CopyIcon /> Duplicate
                  </button>
                  <button
                    onClick={handleRename}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-100 transition-colors hover:bg-workspace-700"
                  >
                    <EditIcon /> Rename
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-danger-400 transition-colors hover:bg-workspace-700"
                  >
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <Divider />

          <ToolButton label="Designs" onClick={() => setGalleryOpen(true)}>
            <LayersIcon />
          </ToolButton>

          {/* language toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            title="Toggle language"
            className="flex h-9 items-center gap-1 rounded-lg px-2 font-grotesk text-[11px] font-semibold text-ink-300 transition-all hover:-translate-y-0.5 hover:bg-workspace-700 hover:text-ink-100"
          >
            {lang === "en" ? "EN" : "中文"}
            <span className="text-ink-500">|</span>
            <span className={lang === "zh" ? "text-accent-400" : ""}>
              {lang === "en" ? "中文" : "EN"}
            </span>
          </button>

          <Divider />

          <ToolButton label="Edit" onClick={() => setEditOpen(true)}>
            <EditIcon />
          </ToolButton>
          <ToolButton label="Photos" onClick={() => setPhotosOpen(true)}>
            <PhotoIcon />
          </ToolButton>

          <Divider />

          <ToolButton label="Import / Export JSON" onClick={handleExport}>
            <JsonIcon />
          </ToolButton>
          <ToolButton label="PDF" onClick={() => void printBrochure()}>
            <PdfIcon />
          </ToolButton>
        </div>
      </div>

      {/* rename inline dialog */}
      {renaming && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="animate-slide-over w-80 rounded-xl border border-workspace-600 bg-workspace-800 p-4 shadow-panel">
            <h3 className="font-grotesk text-sm font-semibold text-ink-100">
              Rename product
            </h3>
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="mt-3 w-full rounded-lg border border-workspace-600 bg-workspace-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent-500"
              placeholder="Model code"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRenaming(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-ink-300 transition-colors hover:bg-workspace-700"
              >
                Cancel
              </button>
              <button
                onClick={commitRename}
                className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-medium text-workspace-950 transition-colors hover:bg-accent-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* import/export pipe dialog */}
      {pipeOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="animate-slide-over flex w-full max-w-2xl flex-col rounded-xl border border-workspace-600 bg-workspace-800 shadow-panel">
            <div className="flex items-center justify-between border-b border-workspace-700 px-4 py-3">
              <h3 className="font-grotesk text-sm font-semibold text-ink-100">
                JSON pipe
              </h3>
              <button
                onClick={() => setPipeOpen(false)}
                className="rounded p-1 text-ink-500 transition-colors hover:text-ink-100"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <textarea
              value={pipeText}
              onChange={(e) => setPipeText(e.target.value)}
              spellCheck={false}
              className="scroll-thin h-80 w-full resize-none bg-workspace-900 p-4 font-mono text-[12px] leading-relaxed text-ink-300 outline-none"
              placeholder="Paste product JSON here…"
            />
            <div className="flex items-center justify-between border-t border-workspace-700 px-4 py-3">
              <button
                onClick={() => {
                  if (!active) return;
                  setPipeText(serializeProduct(active));
                }}
                className="rounded-lg px-3 py-1.5 text-sm text-ink-300 transition-colors hover:bg-workspace-700"
              >
                Load active
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setPipeOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-sm text-ink-300 transition-colors hover:bg-workspace-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-medium text-workspace-950 transition-colors hover:bg-accent-500"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* designs gallery */}
      <GalleryModal open={galleryOpen} onClose={() => setGalleryOpen(false)} />

      {/* edit panel + photos modal */}
      <EditPanel open={editOpen} onClose={() => setEditOpen(false)} />
      <PhotosModal open={photosOpen} onClose={() => setPhotosOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 3v8M3 7h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="4.5"
        y="4.5"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9.5 4.5v-1a1.5 1.5 0 00-1.5-1.5H4a1.5 1.5 0 00-1.5 1.5v4A1.5 1.5 0 004 9.5h1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M9.5 2.5l2 2L5 11l-2.5.5L3 9l6.5-6.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 4h8M5.5 4V3a1 1 0 011-1h1a1 1 0 011 1v1M4.5 4l.5 7h4l.5-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 2l5 2.5L7 7 2 4.5 7 2z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M2 7l5 2.5L12 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M2 9.5L7 12l5-2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PhotoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="2"
        y="3"
        width="10"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="5" cy="6" r="1" fill="currentColor" />
      <path
        d="M2 10l3-3 2 2 2-2 3 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function JsonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 2.5H4a1.5 1.5 0 00-1.5 1.5v1A1.5 1.5 0 011 6.5v1a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 004 11.5h1M9 2.5h1A1.5 1.5 0 0111.5 4v1a1.5 1.5 0 001.5 1.5v1A1.5 1.5 0 0011.5 9v1a1.5 1.5 0 01-1.5 1.5H9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M4 1.5h4l2.5 2.5v8a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 1.5V4h2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 8.5h5M4.5 10.5h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
