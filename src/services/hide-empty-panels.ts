// Personal-deploy utility: hide panels whose data is genuinely unavailable.
//
// Context: hasPremiumAccess() is pinned to true on this fork so no paywall overlay
// blocks panel rendering. But any panel whose upstream Redis key is EMPTY (because
// the corresponding seeder has no API key, or the source is paid-only) then renders
// as a blank grey box. This scans the panel grid a few seconds after boot and hides
// anything that has no meaningful content. Safe and idempotent — re-runs don't
// re-show a panel because we mark it with data-wm-empty-hidden.

const CHECK_DELAYS_MS = [8000, 20000, 40000];

function panelLooksEmpty(panel: Element): boolean {
  const content = panel.querySelector('.panel-content, .panel-body') as HTMLElement | null;
  if (!content) return false;

  // If the panel renders a "locked" or "error" state, leave it alone — those
  // are intentional messages, not empty squares.
  if (panel.classList.contains('panel-is-locked')) return false;
  if (content.querySelector('.panel-error-state, .panel-locked-state')) return false;

  // If there's a canvas, svg chart, table, list of data rows, or meaningful text,
  // the panel has content.
  const signals = content.querySelectorAll(
    'canvas, svg:not(.panel-locked-icon svg), table, .panel-row, [data-signal], [data-row], [data-item], .chart, .news-item, .ticker, .bar, .grid-row, li'
  );
  if (signals.length >= 1) return false;

  // Text length heuristic — headings + empty-state strings are usually short;
  // a real data panel has dozens of rendered numbers/words.
  const text = (content.textContent || '').replace(/\s+/g, ' ').trim();
  if (text.length > 40) return false;

  // Still showing skeleton shimmer = loading, not empty. Let it retry.
  if (content.querySelector('.skeleton-line, .skeleton-panel, [class*="loading"]')) {
    return false;
  }

  return true;
}

function sweep(): void {
  document.querySelectorAll<HTMLElement>('.panel').forEach((panel) => {
    if (panel.dataset.wmEmptyHidden === '1') return;
    if (!panelLooksEmpty(panel)) return;
    panel.dataset.wmEmptyHidden = '1';
    panel.style.display = 'none';
  });
}

export function initHideEmptyPanels(): void {
  // Start sweeps after DOM is idle and data has had a chance to populate.
  for (const ms of CHECK_DELAYS_MS) {
    window.setTimeout(sweep, ms);
  }
}
