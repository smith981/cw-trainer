export function useIsMobile(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
