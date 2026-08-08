import { useLayoutEffect, useRef, useState } from "react";

/**
 * SmartImage v2 — ratio-hugging frames with a flat, clean stage.
 *
 * Used for product / in-use / logo photos across every template (preview
 * AND print). The OUTER STAGE is a fixed-height box with a flat tint (no
 * blur, no smudge). The INNER FRAME hugs the photo's own aspect ratio
 * (clamped to 0.8–2.2) so the image is shown in full with ZERO cropping and
 * ZERO letterbox bars. Template corner ticks hug the inner frame.
 *
 * The ratio is read FROM DATA (captured at upload time) — never from onLoad —
 * so the preview and the hidden print tree render identically with zero
 * waiting. If no ratio is supplied (fallback), it measures onLoad instead.
 *
 * QR is the exception: it renders on a plain white square card with
 * object-contain and NO stage, so the code stays crisp and scannable.
 */

export type SmartImageVariant = "product" | "inUse" | "logo" | "qr";

interface SmartImageProps {
  src: string;
  alt: string;
  /** Natural aspect ratio (w/h) captured at upload. Preferred over onLoad. */
  ratio?: number;
  variant?: SmartImageVariant;
  /** Dark templates use a lighter tint + light dot grid. */
  dark?: boolean;
  /** Outer stage height (e.g. "95mm", "22mm", or "100%" to fill parent). */
  stageHeight?: string;
  className?: string;
}

/** Clamp the photo's natural ratio so extreme panoramas/tall shots stay tidy. */
function clampRatio(r: number): number {
  return Math.min(2.2, Math.max(0.8, r));
}

function CornerTicks() {
  const c = "absolute h-3 w-3 border-[var(--t-accent)]";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

export function SmartImage({
  src,
  alt,
  ratio,
  variant = "product",
  dark = false,
  stageHeight = "100%",
  className = "",
}: SmartImageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  const [fit, setFit] = useState<{ w: number; h: number } | null>(null);

  // Prefer the stored ratio; fall back to onLoad measurement.
  const effectiveRatio = ratio && ratio > 0 ? clampRatio(ratio) : measured;

  // Measure the stage and size the inner frame to hug the photo's ratio.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !effectiveRatio) return;
    const measure = () => {
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      if (!sw || !sh) return;
      if (effectiveRatio >= sw / sh) {
        const w = sw;
        setFit({ w, h: w / effectiveRatio });
      } else {
        const h = sh;
        setFit({ w: h * effectiveRatio, h });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [effectiveRatio]);

  // QR: plain white square card, object-contain, no stage / no blur.
  if (variant === "qr") {
    return (
      <div
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm border ${className}`}
        style={{
          borderColor: "var(--t-hairline)",
          backgroundColor: "#ffffff",
          breakInside: "avoid",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain p-3"
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        />
      </div>
    );
  }

  // Photo stage: flat tint + faint dot grid (no blur).
  const stageBg = dark
    ? "color-mix(in srgb, white 7%, transparent)"
    : "color-mix(in srgb, var(--t-ink) 5%, transparent)";
  const dotColor = dark
    ? "color-mix(in srgb, white 8%, transparent)"
    : "color-mix(in srgb, var(--t-ink) 8%, transparent)";

  return (
    <div
      ref={stageRef}
      className={`smart-stage relative w-full overflow-hidden ${className}`}
      style={{
        height: stageHeight,
        backgroundColor: stageBg,
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "12px 12px",
        breakInside: "avoid",
      }}
    >
      {/* inner frame — hugs the photo's own shape */}
      <div
        className="inner-frame relative mx-auto"
        style={{ width: fit?.w, height: fit?.h }}
      >
        <img
          src={src}
          alt={alt}
          onLoad={(e) => {
            const el = e.currentTarget;
            if (el.naturalWidth && el.naturalHeight) {
              setMeasured(clampRatio(el.naturalWidth / el.naturalHeight));
            }
          }}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
        />
        {variant === "product" && <CornerTicks />}
      </div>
    </div>
  );
}
