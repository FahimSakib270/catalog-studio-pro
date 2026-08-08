/**
 * SmartImage — full-image frames with no cropping.
 *
 * Used for product / in-use / logo photos across every template (preview
 * AND print). The frame keeps a fixed aspect ratio (or fills its parent
 * when `fill` is set) and shows the ENTIRE photo via object-contain, with a
 * blurred, scaled copy behind it so the frame never has empty bars and
 * never crops the subject.
 *
 * QR is the exception: it renders on a plain white card with object-contain
 * and NO blur layer, so the code stays crisp and scannable.
 */

export type SmartImageVariant = "product" | "inUse" | "logo" | "qr";

interface SmartImageProps {
  src: string;
  alt: string;
  variant?: SmartImageVariant;
  /** Dark templates use a stronger blur layer (opacity-30 vs opacity-20). */
  dark?: boolean;
  /** Fill the parent frame (h-full w-full) instead of a fixed aspect ratio. */
  fill?: boolean;
  className?: string;
}

const ASPECT: Record<SmartImageVariant, string> = {
  product: "aspect-[4/3]",
  inUse: "aspect-[4/3]",
  logo: "aspect-[3/2]",
  qr: "aspect-square",
};

export function SmartImage({
  src,
  alt,
  variant = "product",
  dark = false,
  fill = false,
  className = "",
}: SmartImageProps) {
  const aspect = fill ? "h-full w-full" : ASPECT[variant];

  // QR: plain white card, object-contain, no blur layer.
  if (variant === "qr") {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-sm border ${aspect} ${className}`}
        style={{
          borderColor: "var(--t-hairline)",
          backgroundColor: "#ffffff",
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

  // Photo frames: blurred cover layer behind a full object-contain layer.
  return (
    <div
      className={`relative overflow-hidden ${aspect} ${className}`}
      style={{ breakInside: "avoid" }}
    >
      {/* background layer — same image, blurred + scaled, fills the frame */}
      <img
        src={src}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl ${
          dark ? "opacity-30" : "opacity-20"
        }`}
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      />
      {/* foreground layer — FULL photo, centered, never cropped */}
      <img
        src={src}
        alt={alt}
        className="relative h-full w-full object-contain p-2"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      />
    </div>
  );
}
