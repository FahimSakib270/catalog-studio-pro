import { useState } from "react";
import type { FieldDef } from "./sections";
import { getPath, setPath } from "./sections";

/* ------------------------------------------------------------------ */
/*  Shared input styling                                               */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full rounded-lg border border-workspace-600 bg-workspace-900 px-2.5 py-1.5 text-[13px] text-ink-100 outline-none transition-colors placeholder:text-ink-700 focus:border-accent-500";

const langTagCls =
  "flex h-5 w-7 shrink-0 items-center justify-center rounded bg-workspace-700 font-mono text-[9px] font-semibold uppercase text-ink-500";

/* ------------------------------------------------------------------ */
/*  Drag-reorder hook                                                  */
/* ------------------------------------------------------------------ */

function useReorder<T>(items: T[], onChange: (next: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function onDrop(target: number) {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  }

  return {
    dragIndex,
    overIndex,
    setDragIndex,
    setOverIndex,
    onDrop,
  };
}

function RowHandle({
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  active,
}: {
  draggable: boolean;
  onDragStart: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={`flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded text-ink-700 transition-colors hover:text-ink-300 active:cursor-grabbing ${
        active ? "text-accent-400" : ""
      }`}
      title="Drag to reorder"
      aria-label="Drag to reorder"
    >
      <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
        <circle cx="3" cy="2" r="1.2" />
        <circle cx="7" cy="2" r="1.2" />
        <circle cx="3" cy="7" r="1.2" />
        <circle cx="7" cy="7" r="1.2" />
        <circle cx="3" cy="12" r="1.2" />
        <circle cx="7" cy="12" r="1.2" />
      </svg>
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-700 transition-colors hover:bg-danger-500/10 hover:text-danger-400"
      title="Remove"
      aria-label="Remove"
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
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-dashed border-workspace-600 px-2.5 py-1.5 text-[12px] font-medium text-ink-500 transition-colors hover:border-accent-500/50 hover:text-accent-400"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 2.5v7M2.5 6h7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Field label                                                        */
/* ------------------------------------------------------------------ */

function FieldLabel({ label }: { label: string }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Text field                                                         */
/* ------------------------------------------------------------------ */

export function TextField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "text" }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel label={field.label} />
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.label}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bilingual field                                                    */
/* ------------------------------------------------------------------ */

export function BilingualField({
  field,
  en,
  zh,
  onChange,
  textarea,
}: {
  field: Extract<FieldDef, { kind: "bilingual" }>;
  en: string;
  zh: string;
  onChange: (en: string, zh: string) => void;
  textarea?: boolean;
}) {
  const input = (value: string, tag: string, on: (v: string) => void) =>
    textarea ? (
      <textarea
        className={`${inputCls} min-h-[64px] resize-y leading-relaxed`}
        value={value}
        onChange={(e) => on(e.target.value)}
        placeholder={tag === "EN" ? "English" : "中文"}
      />
    ) : (
      <input
        className={inputCls}
        value={value}
        onChange={(e) => on(e.target.value)}
        placeholder={tag === "EN" ? "English" : "中文"}
      />
    );

  return (
    <div>
      <FieldLabel label={field.label} />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>EN</span>
          {input(en, "EN", (v) => onChange(v, zh))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>中</span>
          {input(zh, "ZH", (v) => onChange(en, v))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List field (array of strings)                                      */
/* ------------------------------------------------------------------ */

export function ListField({
  field,
  values,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "list" }>;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const reorder = useReorder(values, onChange);

  return (
    <div>
      <FieldLabel label={field.label} />
      <div className="flex flex-col gap-1.5">
        {values.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 rounded-lg border border-workspace-600 bg-workspace-900 p-1.5 transition-colors ${
              reorder.overIndex === i ? "border-accent-500/60" : ""
            }`}
          >
            <RowHandle
              draggable
              onDragStart={() => reorder.setDragIndex(i)}
              onDragOver={() => reorder.setOverIndex(i)}
              onDrop={() => reorder.onDrop(i)}
              onDragEnd={() => {
                reorder.setDragIndex(null);
                reorder.setOverIndex(null);
              }}
              active={reorder.dragIndex === i}
            />
            <input
              className="flex-1 bg-transparent px-1 text-[13px] text-ink-100 outline-none placeholder:text-ink-700"
              value={item}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder="Item"
            />
            <RemoveButton
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            />
          </div>
        ))}
        <AddButton label="Add item" onClick={() => onChange([...values, ""])} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Specs field (array of {en, zh, val})                               */
/* ------------------------------------------------------------------ */

export function SpecsField({
  field,
  values,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "specs" }>;
  values: { en: string; zh: string; val: string }[];
  onChange: (v: { en: string; zh: string; val: string }[]) => void;
}) {
  const reorder = useReorder(values, onChange);

  return (
    <div>
      <FieldLabel label={field.label} />
      <div className="flex flex-col gap-2">
        {values.map((item, i) => (
          <div
            key={i}
            className={`rounded-lg border border-workspace-600 bg-workspace-900 p-2 transition-colors ${
              reorder.overIndex === i ? "border-accent-500/60" : ""
            }`}
          >
            <div className="flex items-center gap-1.5">
              <RowHandle
                draggable
                onDragStart={() => reorder.setDragIndex(i)}
                onDragOver={() => reorder.setOverIndex(i)}
                onDrop={() => reorder.onDrop(i)}
                onDragEnd={() => {
                  reorder.setDragIndex(null);
                  reorder.setOverIndex(null);
                }}
                active={reorder.dragIndex === i}
              />
              <span className={langTagCls}>EN</span>
              <input
                className="flex-1 bg-transparent px-1 text-[13px] text-ink-100 outline-none placeholder:text-ink-700"
                value={item.en}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = { ...next[i], en: e.target.value };
                  onChange(next);
                }}
                placeholder="Label (EN)"
              />
              <RemoveButton
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={langTagCls}>中</span>
              <input
                className="flex-1 bg-transparent px-1 text-[13px] text-ink-100 outline-none placeholder:text-ink-700"
                value={item.zh}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = { ...next[i], zh: e.target.value };
                  onChange(next);
                }}
                placeholder="标签 (中文)"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="flex h-5 w-7 shrink-0 items-center justify-center rounded bg-workspace-700 font-mono text-[9px] font-semibold text-ink-500">
                VAL
              </span>
              <input
                className="flex-1 bg-transparent px-1 text-[13px] text-ink-100 outline-none placeholder:text-ink-700"
                value={item.val}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = { ...next[i], val: e.target.value };
                  onChange(next);
                }}
                placeholder="Value"
              />
            </div>
          </div>
        ))}
        <AddButton
          label="Add spec"
          onClick={() => onChange([...values, { en: "", zh: "", val: "" }])}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Record field (key/value pairs)                                     */
/* ------------------------------------------------------------------ */

export function RecordField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "record" }>;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}) {
  const entries = Object.entries(value);

  return (
    <div>
      <FieldLabel label={field.label} />
      <div className="flex flex-col gap-1.5">
        {entries.map(([key, val], i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-lg border border-workspace-600 bg-workspace-900 p-1.5"
          >
            <input
              className="w-28 shrink-0 bg-transparent px-1 font-mono text-[12px] text-accent-400 outline-none placeholder:text-ink-700"
              value={key}
              onChange={(e) => {
                const next = { ...value };
                delete next[key];
                next[e.target.value] = val;
                onChange(next);
              }}
              placeholder="key"
            />
            <span className="h-4 w-px bg-workspace-700" />
            <input
              className="flex-1 bg-transparent px-1 text-[13px] text-ink-100 outline-none placeholder:text-ink-700"
              value={val}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              placeholder="Title"
            />
            <RemoveButton
              onClick={() => {
                const next = { ...value };
                delete next[key];
                onChange(next);
              }}
            />
          </div>
        ))}
        <AddButton
          label="Add title"
          onClick={() => onChange({ ...value, "": "" })}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bool field                                                         */
/* ------------------------------------------------------------------ */

export function BoolField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "bool" }>;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-workspace-600 bg-workspace-900 px-3 py-2">
      <span className="text-[13px] text-ink-100">{field.label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? "bg-accent-500" : "bg-workspace-600"
        }`}
        aria-pressed={value}
        aria-label={field.label}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            value ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Price field                                                        */
/* ------------------------------------------------------------------ */

export function PriceField({
  field,
  value,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "price" }>;
  value: {
    currency: string;
    value: number;
    labelEn: string;
    labelZh: string;
    perSetEn: string;
    perSetZh: string;
  };
  onChange: (v: typeof value) => void;
}) {
  return (
    <div>
      <FieldLabel label={field.label} />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>$</span>
          <input
            className={`${inputCls} w-24`}
            value={value.currency}
            onChange={(e) => onChange({ ...value, currency: e.target.value })}
            placeholder="USD"
          />
          <input
            className={inputCls}
            type="number"
            value={Number.isFinite(value.value) ? value.value : 0}
            onChange={(e) =>
              onChange({ ...value, value: Number(e.target.value) || 0 })
            }
            placeholder="0"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>EN</span>
          <input
            className={inputCls}
            value={value.labelEn}
            onChange={(e) => onChange({ ...value, labelEn: e.target.value })}
            placeholder="Label (EN)"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>中</span>
          <input
            className={inputCls}
            value={value.labelZh}
            onChange={(e) => onChange({ ...value, labelZh: e.target.value })}
            placeholder="标签 (中文)"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>EN</span>
          <input
            className={inputCls}
            value={value.perSetEn}
            onChange={(e) => onChange({ ...value, perSetEn: e.target.value })}
            placeholder="per set"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={langTagCls}>中</span>
          <input
            className={inputCls}
            value={value.perSetZh}
            onChange={(e) => onChange({ ...value, perSetZh: e.target.value })}
            placeholder="每套"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generic field dispatcher (used by section renderers)               */
/* ------------------------------------------------------------------ */

export function FieldEditor({
  field,
  product,
  onPatch,
}: {
  field: FieldDef;
  product: Record<string, unknown>;
  onPatch: (path: string, value: unknown) => void;
}) {
  switch (field.kind) {
    case "text":
      return (
        <TextField
          field={field}
          value={(getPath(product, field.path) as string) ?? ""}
          onChange={(v) => onPatch(field.path, v)}
        />
      );
    case "bilingual":
      return (
        <BilingualField
          field={field}
          en={(getPath(product, field.enPath) as string) ?? ""}
          zh={(getPath(product, field.zhPath) as string) ?? ""}
          onChange={(en, zh) => {
            onPatch(field.enPath, en);
            onPatch(field.zhPath, zh);
          }}
        />
      );
    case "list":
      return (
        <ListField
          field={field}
          values={(getPath(product, field.path) as string[]) ?? []}
          onChange={(v) => onPatch(field.path, v)}
        />
      );
    case "specs":
      return (
        <SpecsField
          field={field}
          values={
            (getPath(product, field.path) as {
              en: string;
              zh: string;
              val: string;
            }[]) ?? []
          }
          onChange={(v) => onPatch(field.path, v)}
        />
      );
    case "record":
      return (
        <RecordField
          field={field}
          value={(getPath(product, field.path) as Record<string, string>) ?? {}}
          onChange={(v) => onPatch(field.path, v)}
        />
      );
    case "bool":
      return (
        <BoolField
          field={field}
          value={(getPath(product, field.path) as boolean) ?? false}
          onChange={(v) => onPatch(field.path, v)}
        />
      );
    case "price":
      return (
        <PriceField
          field={field}
          value={
            (getPath(product, field.path) as {
              currency: string;
              value: number;
              labelEn: string;
              labelZh: string;
              perSetEn: string;
              perSetZh: string;
            }) ?? {
              currency: "",
              value: 0,
              labelEn: "",
              labelZh: "",
              perSetEn: "",
              perSetZh: "",
            }
          }
          onChange={(v) => onPatch(field.path, v)}
        />
      );
  }
}

/* ------------------------------------------------------------------ */
/*  setPath re-export for the panel                                    */
/* ------------------------------------------------------------------ */

export { setPath };
