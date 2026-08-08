import { useRef, useState } from "react";
import { useActiveProduct, useCatalog } from "../../store/catalog";
import { useToast } from "../studio/Toasts";
import type { ImageAsset, Product } from "../../types/catalog";

/* ------------------------------------------------------------------ */
/*  Photos modal — 4 dropzones, PNG data-URL, persist, reset           */
/* ------------------------------------------------------------------ */

type SlotKey = "logo" | "product" | "inUse" | "qr";

const SLOTS: { key: SlotKey; label: string; hint: string }[] = [
  { key: "logo", label: "Logo", hint: "Brand mark · transparent PNG" },
  { key: "product", label: "Product", hint: "Hero product shot" },
  { key: "inUse", label: "In use", hint: "Lifestyle / context photo" },
  { key: "qr", label: "QR code", hint: "Scan code for the brochure" },
];

export function PhotosModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const product = useActiveProduct();
  const updateProduct = useCatalog((s) => s.updateProduct);
  const toast = useToast();
  const [dragOver, setDragOver] = useState<SlotKey | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const pendingSlot = useRef<SlotKey>("product");

  if (!open || !product) return null;
  const current = product;

  function setImage(slot: SlotKey, asset: ImageAsset) {
    const next = JSON.parse(JSON.stringify(current)) as Product;
    next.images[slot] = asset;
    updateProduct(current.modelCode, next);
    toast.success("Photo updated", SLOTS.find((s) => s.key === slot)?.label);
  }

  function readFile(file: File, slot: SlotKey) {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", "Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Capture the natural aspect ratio at upload time so preview AND print
      // render the ratio-hugging frame identically (no onLoad dependency).
      const img = new Image();
      img.onload = () => {
        const ratio =
          img.naturalWidth && img.naturalHeight
            ? img.naturalWidth / img.naturalHeight
            : 1;
        setImage(slot, { dataUrl, ratio });
      };
      img.onerror = () => setImage(slot, { dataUrl, ratio: 1 });
      img.src = dataUrl;
    };
    reader.onerror = () =>
      toast.error("Read failed", "Could not read the file.");
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent, slot: SlotKey) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file, slot);
  }

  function openPicker(slot: SlotKey) {
    pendingSlot.current = slot;
    fileRef.current?.click();
  }

  function resetSlot(slot: SlotKey) {
    const next = JSON.parse(JSON.stringify(current)) as Product;
    next.images[slot] = { dataUrl: "", ratio: 1 };
    updateProduct(current.modelCode, next);
    toast.success("Photo cleared", SLOTS.find((s) => s.key === slot)?.label);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="animate-slide-over relative flex w-full max-w-2xl flex-col rounded-xl border border-workspace-600 bg-workspace-850 shadow-panel">
        {/* header */}
        <div className="flex items-center justify-between border-b border-workspace-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500/15 text-accent-400">
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
            </span>
            <div>
              <h2 className="font-grotesk text-sm font-semibold text-ink-100">
                Photos
              </h2>
              <p className="font-mono text-[10px] text-ink-500">
                {product.modelCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-ink-500 transition-colors hover:bg-workspace-700 hover:text-ink-100"
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

        {/* body */}
        <div className="scroll-thin max-h-[70vh] overflow-y-auto p-4">
          <p className="mb-3 text-[12px] leading-relaxed text-ink-500">
            Drag & drop images or click to browse. Images are stored as
            data-URLs and persist with the product.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {SLOTS.map((slot) => {
              const value = product.images[slot.key].dataUrl;
              return (
                <div
                  key={slot.key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(slot.key);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, slot.key)}
                  onClick={() => openPicker(slot.key)}
                  className={`group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-all ${
                    dragOver === slot.key
                      ? "border-accent-500 bg-accent-500/10"
                      : value
                        ? "border-workspace-600 bg-workspace-900"
                        : "border-workspace-600 bg-workspace-900/60 hover:border-workspace-500"
                  }`}
                >
                  {value ? (
                    <>
                      <img
                        src={value}
                        alt={slot.label}
                        className="absolute inset-0 h-full w-full object-contain p-2"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded-lg bg-workspace-800 px-2.5 py-1 text-[11px] font-medium text-ink-100">
                          Replace
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 px-3 text-center">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        className="text-ink-700"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="16"
                          height="12"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle cx="8" cy="9.5" r="1.2" fill="currentColor" />
                        <path
                          d="M3 15l4.5-4.5 3 3 2.5-2.5 4 4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[12px] font-medium text-ink-300">
                        {slot.label}
                      </span>
                      <span className="text-[10px] text-ink-700">
                        {slot.hint}
                      </span>
                    </div>
                  )}

                  {value && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetSlot(slot.key);
                      }}
                      className="absolute right-1.5 top-1.5 rounded-md bg-workspace-800/90 p-1 text-ink-500 opacity-0 transition-opacity hover:text-danger-400 group-hover:opacity-100"
                      title="Clear"
                      aria-label="Clear"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 2l8 8M10 2l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-workspace-700 px-4 py-3">
          <span className="text-[11px] text-ink-700">
            PNG / JPG · stored locally
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-medium text-workspace-950 transition-colors hover:bg-accent-500"
          >
            Done
          </button>
        </div>
      </div>

      {/* hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file, pendingSlot.current);
          e.target.value = "";
        }}
      />
    </div>
  );
}
