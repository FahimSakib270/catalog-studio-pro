/**
 * Print engine — dependency-free, fully offline.
 *
 * The brochure is always mounted in a hidden #printRoot (see PrintRoot).
 * This helper ensures fonts AND all images are decoded before triggering the
 * browser's native print dialog, so the PDF never shows empty grey stages.
 * The @media print CSS in index.css hides all studio chrome and shows only
 * the A4 pages.
 */

export async function printBrochure(): Promise<void> {
  // 1. Ensure all bundled fonts are loaded so CJK + display faces render.
  try {
    await document.fonts.ready;
  } catch {
    /* fonts.ready is a promise; ignore any edge-case rejection */
  }

  // 2. Decode every <img> in the hidden print tree so data-URL photos are
  //    fully rasterized before the print dialog opens.
  const root = document.getElementById("printRoot");
  if (root) {
    const imgs = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        typeof img.decode === "function"
          ? img.decode().catch(() => {})
          : Promise.resolve(),
      ),
    );
  }

  // 3. Give the browser a tick to settle layout before opening the dialog.
  await new Promise((r) => setTimeout(r, 250));

  window.print();
}
