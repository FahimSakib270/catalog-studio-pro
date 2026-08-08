/**
 * SmartImage v3 — shrink-wrap photo cards.
 *
 * NO grey stage, NO dot-grid, NO ratio inner-frame. The photo sits on a
 * plain white card that hugs the image exactly (small uniform padding +
 * red corner ticks). All leftover space is plain page background.
 *
 * Pure CSS sizing (w-fit + max-w-full + max-h) — the photo's OWN aspect
 * ratio sizes the card, so preview and the hidden #printRoot render
 * identically with zero JS state and zero cropping.
 *
 * QR is the exception: an unchanged plain white square card with
 * object-contain so the code stays crisp and scannable.
 */

export type SmartImageVariant = "product" | "inUse" | "logo" | "qr";

interface SmartImageProps {
  src: string;
  alt: string;
  variant?: SmartImageVariant;
  /** Cap the photo height (e.g. "95mm" cover, "80mm" quote, "20mm" logo). */
  maxHeight?: string;
  className?: string;
}

function CornerTicks() {
  const c = "absolute h-3 w-3 border-[#e11d48]";
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
  variant = "product",
  maxHeight = "95mm",
  className = "",
}: SmartImageProps) {
  // QR: plain white square card, object-contain, no corner ticks.
  if (variant === "qr") {
    return (
      <div
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm border ${className}`}
        style={{
          borderColor: "var(--t-hairline)",
          backgroundColor: "#ffffff",
          breakInside: "avoid",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
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

  // Photo card: shrink-wraps the image, white on every template.
  return (
    <div
      className={`relative w-fit max-w-full rounded-md bg-white p-[3mm] ${className}`}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
        border: "1px solid rgba(0,0,0,0.08)",
        breakInside: "avoid",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="block h-auto w-auto max-w-full"
        style={{
          maxHeight,
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      />
      <CornerTicks />
    </div>
  );
}
