import { useState, useEffect, useCallback } from 'react';

export const useXDragAndZoom = (xMax: number) => {
  const [xTranslation, setXTranslation] = useState<number>(0);
  const [initialDrag, setInitialDrag] = useState<number>(0);
  const [xRange, setXRange] = useState<[number, number]>([
    0,
    Math.max(xMax, 0),
  ]);

  const handleDragMove = useCallback(
    (e: any) => {
      const drag = e.dx + initialDrag;
      const maxDrag = xRange[1] - xMax;

      setXTranslation((prev) => {
        if (!Math.abs(maxDrag)) return prev;
        if (Math.abs(drag) > Math.abs(maxDrag)) return prev;
        if (drag > maxDrag) return maxDrag;
        return Math.min(drag, 0);
      });
    },
    [initialDrag, xRange, xMax]
  );

  const handleWheelZoom = useCallback(
    (e: any) => {
      if (e.deltaY < 0) setXRange(([start, end]) => [start, end * 1.1]);
      else {
        setXRange(([start, end]) => {
          const maxTranslation = end * 0.9 - xMax;
          if (Math.abs(xTranslation) > Math.abs(maxTranslation)) {
            setXTranslation(Math.max(0, -maxTranslation));
          }
          return [start, Math.max(xMax, end * 0.9)];
        });
      }
    },
    [xMax, xTranslation]
  );

  const handleDragEnd = () => {
    setInitialDrag(xTranslation);
  };

  useEffect(() => {
    setXRange([0, xMax]);
  }, [xMax]);

  return {
    handleDragMove,
    handleDragEnd,
    handleWheelZoom,
    xRange,
    xTranslation,
    initialDrag,
  };
};
