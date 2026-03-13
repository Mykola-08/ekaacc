import { useIsMatchMedia } from './use-is-match-media';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const isMobile = useIsMatchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  return !!isMobile;
}
