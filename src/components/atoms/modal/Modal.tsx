import React, { FC, MouseEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useHasMounted, usePortal } from 'src/hooks';
import ReactDOM from 'react-dom';
import { useSpring, animated } from 'react-spring';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const baseOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  minHeight: '100vh',
} as any;

export const Modal: FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const portal = usePortal(typeof document !== 'undefined' ? document : null);
  const springProps = useSpring({
    to: { opacity: isOpen ? 0.6 : 0 },
    from: { opacity: 0 },
  });
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const handleModalClick = (e: MouseEvent) => e.stopPropagation();
  const handleEscape = (e: KeyboardEvent) => {
    if (e.code === 'Escape') onClose();
  };
  if (!hasMounted || !portal) return null;
  return (
    <>
      {ReactDOM.createPortal(
        <>
          <animated.div
            data-testid="modal-overlay"
            role="presentation"
            style={springProps}
            sx={{
              ...baseOverlayStyles,
              zIndex: 'modal-overlay',
              bg: 'purple',
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
            onClick={onClose}
            onKeyUp={() => null}
            tabIndex={-1}
          ></animated.div>
          <div
            data-testid="modal-container"
            sx={{
              ...baseOverlayStyles,
              display: 'grid',
              placeItems: 'center',
              padding: 3,
              zIndex: 'modal',
              pointerEvents: 'none',
            }}
          >
            <div
              data-testid="modal"
              ref={modalRef}
              role="presentation"
              onClick={handleModalClick}
              onKeyUp={handleEscape}
              tabIndex={-1}
              sx={{
                zIndex: 'modal',
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              {children}
            </div>
          </div>
        </>,
        portal
      )}
    </>
  );
};
