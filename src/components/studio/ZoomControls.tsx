import { useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Zoom controls for the A4 preview                                   */
/* ------------------------------------------------------------------ */

export interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFit: () => void;
}

const MIN = 50;
const MAX = 150;
const STEP = 10;

export function ZoomControls({ zoom, onZoomChange, onFit }: ZoomControlsProps) {
  const clamp = useCallback(
    (value: number) => Math.min(MAX, Math.max(MIN, Math.round(value))),
    [],
  );

  return (
    <div className="flex items-center gap-1 rounded-xl border border-workspace-600 bg-workspace-800/90 p-1 shadow-lift backdrop-blur">
      <button
        onClick={() => onZoomChange(clamp(zoom - STEP))}
        disabled={zoom <= MIN}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-workspace-700 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        onClick={onFit}
        className="flex h-7 items-center justify-center rounded-lg px-2 font-mono text-[11px] font-medium text-ink-300 transition-colors hover:bg-workspace-700 hover:text-ink-100"
        title="Fit to view"
      >
        {zoom}%
      </button>

      <button
        onClick={() => onZoomChange(clamp(zoom + STEP))}
        disabled={zoom >= MAX}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-workspace-700 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 3v8M3 7h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
