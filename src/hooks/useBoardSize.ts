"use client";

import { useCallback, useEffect, useState } from "react";

export function useBoardSize(isFullscreen: boolean, options?: { min?: number; max?: number }) {
  const min = options?.min ?? 280;
  const max = options?.max ?? 560;

  const calcSize = useCallback(() => {
    const padding = isFullscreen ? 48 : 32;
    const viewportMax = isFullscreen
      ? Math.min(window.innerWidth - 24, window.innerHeight - 200) - padding
      : Math.min(window.innerWidth - 32, max);
    return Math.max(min, Math.floor(viewportMax));
  }, [isFullscreen, min, max]);

  const [size, setSize] = useState(calcSize);

  useEffect(() => {
    const update = () => setSize(calcSize());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [calcSize]);

  return size;
}
