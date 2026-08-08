import type { BrochureCtx } from "./context";
import { pick } from "./context";
import { SmartImage } from "./SmartImage";

/**
 * LAST — Contact. Mirrors the cover.
 * Thank-you headline, salesman name large, QR white card (fallback note),
 * ribbon phone/email/wechat, company band.
 */

export function Contact({ ctx }: { ctx: BrochureCtx }) {
  const p = ctx.product;
  const thankYou = pick(ctx, "Thank you", "感谢垂询");
  const sub = pick(
    ctx,
    "Let's build something great together.",
    "期待与您携手共创。",
  );
  const salesman = pick(ctx, "Sales Representative", "销售代表");
  const qrNote = pick(ctx, "Scan to contact", "扫码联系");
  const qrFallback = pick(ctx, "QR code", "二维码");
  const phone = "+86 400 000 0000";
  const email = "sales@catalogstudio.pro";
  const wechat = "catalogstudio";

  return (
    <div className="flex h-full w-full flex-col">
      {/* top strip */}
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="f-mono text-[9px] uppercase tracking-[0.18em]">
          {p.modelCode}
        </span>
        <span className="f-mono text-[9px] uppercase tracking-[0.18em]">
          {pick(ctx, "Contact", "联系方式")}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-6">
        {/* thank-you headline */}
        <h1 className="f-display text-[40px] font-bold leading-[0.95] tracking-tight">
          {thankYou}
        </h1>
        <p
          className="mt-3 text-[12px] italic leading-relaxed"
          style={{ color: "var(--t-grey)" }}
        >
          {sub}
        </p>

        {/* salesman name */}
        <div className="mt-8">
          <div
            className="f-mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: "var(--t-grey)" }}
          >
            {salesman}
          </div>
          <div className="f-display mt-1 text-[28px] font-semibold leading-tight">
            Alex Chen
          </div>
        </div>

        {/* QR white card */}
        <div
          className="mt-6 flex items-center gap-4"
          style={{ breakInside: "avoid" }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-sm border"
            style={{
              borderColor: "var(--t-hairline)",
              backgroundColor: "#ffffff",
              printColorAdjust: "exact",
              WebkitPrintColorAdjust: "exact",
            }}
          >
            {p.images.qr.dataUrl ? (
              <SmartImage src={p.images.qr.dataUrl} alt="QR" variant="qr" />
            ) : (
              <span
                className="f-mono text-[8px] uppercase tracking-[0.12em]"
                style={{ color: "#9ca3af" }}
              >
                {qrFallback}
              </span>
            )}
          </div>
          <div>
            <div className="f-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
              {qrNote}
            </div>
            <div
              className="mt-1 f-mono text-[8px] uppercase tracking-[0.12em]"
              style={{ color: "var(--t-grey)" }}
            >
              {wechat}
            </div>
          </div>
        </div>
      </div>

      {/* ribbon phone/email/wechat */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3"
        style={{
          backgroundColor: "var(--t-accent)",
          breakInside: "avoid",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        <span
          className="f-mono text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--t-paper)" }}
        >
          {phone}
        </span>
        <span
          className="f-mono text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--t-paper)" }}
        >
          {email}
        </span>
        <span
          className="f-mono text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--t-paper)" }}
        >
          WeChat · {wechat}
        </span>
      </div>

      {/* company band */}
      <div
        className="flex items-center justify-between px-6 py-2.5"
        style={{
          backgroundColor: "var(--t-accent2)",
          breakInside: "avoid",
          printColorAdjust: "exact",
          WebkitPrintColorAdjust: "exact",
        }}
      >
        <span
          className="f-display text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--t-paper)" }}
        >
          {pick(ctx, "Catalog Studio Pro", "目录工作室")}
        </span>
        <span
          className="f-mono text-[8px] uppercase tracking-[0.16em]"
          style={{ color: "var(--t-paper)" }}
        >
          {pick(ctx, "Thank you", "感谢")}
        </span>
      </div>
    </div>
  );
}
