import { useEffect } from 'react';
import { useThrottle } from '@react-hook/throttle';

export interface ResizeObserverResults {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

const initialDimentions = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

export const useResizeObserver = (ref: any): ResizeObserverResults => {
  const [dimensions, setDimensions] = useThrottle<any>(initialDimentions, 30);

  useEffect(() => {
    const observeTarget = ref.current;
    let observer: ResizeObserver;
    if (observeTarget) {
      observer = new ResizeObserver((entries: any) =>
        entries.forEach((entry: any) => setDimensions(entry.contentRect))
      );
      observer.observe(observeTarget);
    }
    return observeTarget ? () => observer.unobserve(observeTarget) : undefined;
  }, [ref, setDimensions]);
  return dimensions;
};
