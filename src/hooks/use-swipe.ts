import { useRef, useCallback } from "react";

interface UseSwipeOptions {
  on_swipe_left?: () => void;
  on_swipe_right?: () => void;
  threshold?: number;
}

const DEFAULT_THRESHOLD = 50;

export function use_swipe({
  on_swipe_left,
  on_swipe_right,
  threshold = DEFAULT_THRESHOLD,
}: UseSwipeOptions) {
  const touch_start_x = useRef<number | null>(null);
  const touch_start_y = useRef<number | null>(null);

  const on_touch_start = useCallback((e: React.TouchEvent) => {
    touch_start_x.current = e.touches[0].clientX;
    touch_start_y.current = e.touches[0].clientY;
  }, []);

  const on_touch_end = useCallback(
    (e: React.TouchEvent) => {
      if (touch_start_x.current === null || touch_start_y.current === null)
        return;

      const dx = e.changedTouches[0].clientX - touch_start_x.current;
      const dy = e.changedTouches[0].clientY - touch_start_y.current;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0) {
          on_swipe_right?.();
        } else {
          on_swipe_left?.();
        }
      }

      touch_start_x.current = null;
      touch_start_y.current = null;
    },
    [on_swipe_left, on_swipe_right, threshold]
  );

  return { on_touch_start, on_touch_end };
}
