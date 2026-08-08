import { useEffect, useRef, useState } from "react";

import { useCatalog, useActiveProduct } from "../../store/catalog";
import { useToast } from "../studio/Toasts";
import { seedProduct } from "../../lib/seed";
import type { Product } from "../../types/catalog";
import {
  SECTIONS,
  VARIANT_KEYS,
  VARIANT_FIELDS,
  sectionMatches,
  fieldMatches,
  type SectionDef,
  type VariantKey,
} from "./sections";

import { FieldEditor } from "./fields";

/* ------------------------------------------------------------------ */
/*  Edit panel — rebuild-quality slide-over (~440px)                   */
/* ------------------------------------------------------------------ */

type Mode = "form" | "paste";

export function EditPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const product = useActiveProduct();
  const updateProduct = useCatalog((s) => s.updateProduct);
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("model");
  const [modes, setModes] = useState<Record<string, Mode>>({});
  const [pasteTexts, setPasteTexts] = useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = useState(false);
  const savedTimer = useRef<number | null>(null);

  /* reset local state when the panel opens or the product changes */
  useEffect(() => {
    if (open) {
      setQuery("");
      setOpenSection("model");
      setModes({});
      setPasteTexts({});
    }
  }, [open, product?.modelCode]);

  /* keep paste text in sync with product for sections in form mode */
  useEffect(() => {
    if (!product) return;
    setPasteTexts((prev) => {
      const next = { ...prev };
      for (const section of SECTIONS) {
        if (modes[section.id] !== "paste") {
          next[section.id] = JSON.stringify(section.pick(product), null, 2);
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!open || !product) return null;

  const visibleSections = SECTIONS.filter((s) => sectionMatches(s, query));

  function flashSaved() {
    setSavedFlash(true);
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSavedFlash(false), 1600);
  }

  function patch(path: string, value: unknown) {
    if (!product) return;
    const next = JSON.parse(JSON.stringify(product)) as Product;
    const keys = path.split(".");
    const last = keys.pop()!;
    const target = keys.reduce<any>((o, k) => (o[k] = o[k] ?? {}), next);
    target[last] = value;
    updateProduct(product.modelCode, next);
    flashSaved();
  }

  function applySection(section: SectionDef, data: unknown) {
    if (!product) return;
    const next = section.apply(product, data);
    updateProduct(product.modelCode, next);
    flashSaved();
  }

  function resetSection(section: SectionDef) {
    if (!product) return;
    const baseline = section.apply(product, section.pick(seedProduct));
    updateProduct(product.modelCode, baseline);
    setPasteTexts((prev) => ({
      ...prev,
      [section.id]: JSON.stringify(section.pick(baseline), null, 2),
    }));
    toast.success("Section reset", section.label);
  }

  function resetAll() {
    if (!product) return;
    const next = JSON.parse(JSON.stringify(seedProduct)) as Product;
    next.modelCode = product.modelCode;
    next.templateId = product.templateId;
    updateProduct(product.modelCode, next);
    setPasteTexts({});
    toast.success("Product reset", "Restored seed values");
  }

  function setMode(sectionId: string, mode: Mode) {
    setModes((prev) => ({ ...prev, [sectionId]: mode }));
  }

  return (
    <div className="fixed inset-0 z-40">
      {/* backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* slide-over panel */}
      <aside className="animate-slide-over absolute right-0 top-0 flex h-full w-[440px] max-w-[92vw] flex-col border-l border-workspace-600 bg-workspace-850 shadow-panel">
        {/* header */}
        <div className="flex items-center justify-between border-b border-workspace-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-500/15 text-accent-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9.5 2.5l2 2L5 11l-2.5.5L3 9l6.5-6.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h2 className="font-grotesk text-sm font-semibold text-ink-100">
                Edit product
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

        {/* sticky search + chip nav */}
        <div className="border-b border-workspace-700 px-4 pb-3 pt-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-700"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle
                cx="6"
                cy="6"
                r="4"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M9.5 9.5L12 12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-workspace-600 bg-workspace-900 py-2 pl-8 pr-8 text-[13px] text-ink-100 outline-none transition-colors placeholder:text-ink-700 focus:border-accent-500"
              placeholder="Search fields…"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-700 hover:text-ink-100"
                aria-label="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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

          {/* section chip nav */}
          <div className="scroll-thin mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
            {SECTIONS.map((section) => {
              const visible = sectionMatches(section, query);
              const active = openSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setOpenSection(section.id)}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                    active
                      ? "border-accent-500/60 bg-accent-500/15 text-accent-400"
                      : visible
                        ? "border-workspace-600 text-ink-300 hover:border-workspace-500 hover:text-ink-100"
                        : "border-workspace-700 text-ink-700"
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* accordion body */}
        <div className="scroll-thin flex-1 overflow-y-auto px-4 py-3">
          {visibleSections.length === 0 && (
            <div className="py-10 text-center text-sm text-ink-500">
              No fields match “{query}”.
            </div>
          )}

          {visibleSections.map((section) => (
            <SectionAccordion
              key={section.id}
              section={section}
              open={openSection === section.id}
              onToggle={() =>
                setOpenSection(openSection === section.id ? null : section.id)
              }
              mode={modes[section.id] ?? "form"}
              onMode={(m) => setMode(section.id, m)}
              pasteText={pasteTexts[section.id] ?? ""}
              onPasteText={(t) =>
                setPasteTexts((prev) => ({ ...prev, [section.id]: t }))
              }
              product={product}
              query={query}
              onPatch={patch}
              onApplySection={applySection}
              onReset={() => resetSection(section)}
            />
          ))}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-workspace-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-[12px] font-medium transition-opacity ${
                savedFlash ? "text-accent-400 opacity-100" : "opacity-0"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6.5L4.5 9 10 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved
            </span>
            <span className="text-[11px] text-ink-700">
              {product.modelCode}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (openSection)
                  resetSection(SECTIONS.find((s) => s.id === openSection)!);
              }}
              className="rounded-lg border border-workspace-600 px-2.5 py-1.5 text-[12px] font-medium text-ink-300 transition-colors hover:border-workspace-500 hover:text-ink-100"
              title="Reset the open section to seed values"
            >
              Reset section
            </button>
            <button
              onClick={resetAll}
              className="rounded-lg border border-danger-500/40 px-2.5 py-1.5 text-[12px] font-medium text-danger-400 transition-colors hover:bg-danger-500/10"
              title="Reset the whole product to seed values"
            >
              Reset all
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section accordion                                                  */
/* ------------------------------------------------------------------ */

function SectionAccordion({
  section,
  open,
  onToggle,
  mode,
  onMode,
  pasteText,
  onPasteText,
  product,
  query,
  onPatch,
  onApplySection,
  onReset,
}: {
  section: SectionDef;
  open: boolean;
  onToggle: () => void;
  mode: Mode;
  onMode: (m: Mode) => void;
  pasteText: string;
  onPasteText: (t: string) => void;
  product: Product;
  query: string;
  onPatch: (path: string, value: unknown) => void;
  onApplySection: (section: SectionDef, data: unknown) => void;
  onReset: () => void;
}) {
  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-workspace-700 bg-workspace-800/60">
      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-ink-500 transition-transform ${open ? "rotate-90" : ""}`}
          >
            <path
              d="M4.5 2.5L8 6l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[13px] font-semibold text-ink-100">
            {section.label}
          </span>
        </button>

        {/* mode toggle */}
        <div className="flex rounded-lg border border-workspace-600 bg-workspace-900 p-0.5">
          {(["form", "paste"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => onMode(m)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                mode === m
                  ? "bg-accent-500/20 text-accent-400"
                  : "text-ink-500 hover:text-ink-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="rounded p-1 text-ink-700 transition-colors hover:text-danger-400"
          title="Reset section"
          aria-label="Reset section"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5A4 4 0 119.5 8M9.5 4.5V8H6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* body */}
      {open && (
        <div className="border-t border-workspace-700 px-3 py-3">
          {mode === "form" ? (
            <SectionForm
              section={section}
              product={product}
              query={query}
              onPatch={onPatch}
            />
          ) : (
            <SectionPaste
              section={section}
              text={pasteText}
              onText={onPasteText}
              onApply={onApplySection}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form mode                                                          */
/* ------------------------------------------------------------------ */

function SectionForm({
  section,
  product,
  query,
  onPatch,
}: {
  section: SectionDef;
  product: Product;
  query: string;
  onPatch: (path: string, value: unknown) => void;
}) {
  if (section.id === "variants") {
    return <VariantsForm product={product} query={query} onPatch={onPatch} />;
  }

  const fields = section.fields.filter((f) => fieldMatches(f, query));
  if (fields.length === 0) {
    return <EmptyMatch />;
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <FieldEditor
          key={field.label}
          field={field}
          product={product as unknown as Record<string, unknown>}
          onPatch={onPatch}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Variants form (tabs per variant)                                   */
/* ------------------------------------------------------------------ */

function VariantsForm({
  product,
  query,
  onPatch,
}: {
  product: Product;
  query: string;
  onPatch: (path: string, value: unknown) => void;
}) {
  const [tab, setTab] = useState<VariantKey>("touchscreen");
  const variant = product.variants[tab];
  const fields = VARIANT_FIELDS.filter((f) => fieldMatches(f, query));

  return (
    <div>
      {/* variant tabs */}
      <div className="mb-3 flex gap-1.5">
        {VARIANT_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              tab === key
                ? "border-accent-500/60 bg-accent-500/15 text-accent-400"
                : "border-workspace-600 text-ink-300 hover:border-workspace-500"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {fields.length === 0 ? (
        <EmptyMatch />
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field) => (
            <FieldEditor
              key={field.label}
              field={field}
              product={variant as unknown as Record<string, unknown>}
              onPatch={(path, value) =>
                onPatch(`variants.${tab}.${path}`, value)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Paste mode                                                         */
/* ------------------------------------------------------------------ */

function SectionPaste({
  section,
  text,
  onText,
  onApply,
}: {
  section: SectionDef;
  text: string;
  onText: (t: string) => void;
  onApply: (section: SectionDef, data: unknown) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  function handleChange(value: string) {
    onText(value);
    try {
      const parsed = JSON.parse(value);
      const result = section.schema.safeParse(parsed);
      if (result.success) {
        setError(null);
        onApply(section, result.data);
      } else {
        const first = result.error.issues[0];
        const path = first.path.length ? first.path.join(".") : "(root)";
        setError(`${path}: ${first.message}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setError(`JSON parse error: ${message}`);
    }
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        className="scroll-thin h-56 w-full resize-none rounded-lg border border-workspace-600 bg-workspace-900 p-3 font-mono text-[11px] leading-relaxed text-ink-300 outline-none transition-colors focus:border-accent-500"
        placeholder={`Paste ${section.label} JSON here…`}
      />
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-[11px] font-medium ${
            error ? "text-danger-400" : "text-accent-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              error ? "bg-danger-400" : "bg-accent-400"
            }`}
          />
          {error ? "Invalid" : "Live · synced"}
        </span>
      </div>
      {error && (
        <p className="mt-1.5 break-words font-mono text-[10px] leading-relaxed text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
}

function EmptyMatch() {
  return (
    <div className="py-4 text-center text-[12px] text-ink-500">
      No fields match this search.
    </div>
  );
}
