import { useState, useEffect } from 'react';

export const useKeyDownListener = (eventKey: string) => {
  const [isKeyDown, setIsKeyDown] = useState<boolean>(false);

  useEffect(() => {
    if (!process.browser || typeof window === 'undefined') return;
    window.addEventListener('keydown', (event) => {
      if (event.key === eventKey) {
        setIsKeyDown(true);
      }
    });
    window.addEventListener('keyup', (event) => {
      if (event.key === eventKey) {
        setIsKeyDown(false);
      }
    });
  }, [eventKey]);
  return isKeyDown;
};
