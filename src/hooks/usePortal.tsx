import { useState, useEffect } from 'react';

export const usePortal = (
  document: Document | null
): HTMLDivElement | null | undefined => {
  const [portal] = useState(document?.createElement('div'));
  useEffect(() => {
    if (!portal) return undefined;
    document?.body.appendChild(portal);
    return () => {
      document?.body.removeChild(portal);
    };
  }, [portal, document?.body]);
  return portal;
};
