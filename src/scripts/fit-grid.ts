// Fit mode: on roomy screens (see FIT_QUERY) the page fills the viewport instead of scrolling.
// CSS gives each project grid a definite height and lets the screenshot absorb it; this script
// picks the column count whose cards come closest to a 16:9 screenshot. Without JS the page
// keeps its natural, scrolling layout.
const FIT_QUERY = '(min-width: 64rem) and (min-height: 34rem)';
const MIN_IMAGE = 64; // px; below this a screenshot is not worth showing
const TARGET_RATIO = 16 / 9;
const MAX_COLS = 6;

const root = document.documentElement;
const mq = matchMedia(FIT_QUERY);
let frame = 0;

function bodyHeight(cards: HTMLElement[]): number {
  return Math.max(...cards.map((card) => card.querySelector<HTMLElement>('.body')?.offsetHeight ?? 0));
}

function fitGrid(grid: HTMLElement) {
  const cards = [...grid.children] as HTMLElement[];
  const n = cards.length;
  if (!n) return;

  grid.style.removeProperty('--min-h');
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
  const W = grid.clientWidth;
  const H = grid.clientHeight;

  let best = { cols: 1, score: -Infinity };
  let roomiest = { cols: 1, image: -Infinity };

  for (let cols = 1; cols <= Math.min(n, MAX_COLS); cols++) {
    grid.style.setProperty('--cols', String(cols));
    const rows = Math.ceil(n / cols);
    const image = (H - (rows - 1) * gap) / rows - bodyHeight(cards);
    const width = (W - (cols - 1) * gap) / cols;
    if (image > roomiest.image) roomiest = { cols, image };
    if (image < MIN_IMAGE) continue;
    const score = -Math.abs(Math.log(width / image / TARGET_RATIO));
    if (score > best.score) best = { cols, score };
  }

  if (best.score > -Infinity) {
    grid.style.setProperty('--cols', String(best.cols));
    return;
  }
  // Nothing fits: use the roomiest layout and let the grid grow so the page scrolls.
  grid.style.setProperty('--cols', String(roomiest.cols));
  const rows = Math.ceil(n / roomiest.cols);
  grid.style.setProperty('--min-h', `${rows * (bodyHeight(cards) + MIN_IMAGE) + (rows - 1) * gap}px`);
}

function apply() {
  root.classList.toggle('fit', mq.matches);
  document.querySelectorAll<HTMLElement>('.posts').forEach((grid) => {
    grid.style.removeProperty('--cols');
    grid.style.removeProperty('--min-h');
    if (mq.matches) fitGrid(grid);
    // Reveal only now: before this the grid is hidden (CSS) so the column change causes no layout jump.
    grid.dataset.fit = '';
  });
}

function schedule() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(apply);
}

document.addEventListener('astro:page-load', schedule);
addEventListener('resize', schedule);
mq.addEventListener('change', schedule);
document.fonts?.ready.then(schedule);

export {};
