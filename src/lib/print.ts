/**
 * Print engine — dependency-free, fully offline.
 *
 * The brochure is always mounted in a hidden #printRoot (see PrintRoot).
 * This helper just ensures fonts are ready, then triggers the browser's
 * native print dialog. The @media print CSS in index.css hides all studio
 * chrome and shows only the A4 pages.
 */

export async function printBrochure(): Promise<void> {
  // Ensure all bundled fonts are loaded before printing so CJK + display
  // faces render correctly in the PDF.
  try {
    await document.fonts.ready;
  } catch {
    /* fonts.ready is a promise; ignore any edge-case rejection */
  }

  // Give the browser a tick to settle layout before opening the dialog.
  window.print();
}
