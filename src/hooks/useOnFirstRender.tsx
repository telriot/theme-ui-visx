import { useEffect, useState } from 'react';

export const useOnFirstRender = (callback: () => any, indexDep?: string | number): void => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(indexDep);
  useEffect(() => {
    if (isFirstRender || (typeof indexDep !== 'undefined' && indexDep !== currentIndex)) {
      callback();
    }
    setIsFirstRender(false);
    setCurrentIndex(indexDep);
  }, [callback, isFirstRender, currentIndex, indexDep]);
};
