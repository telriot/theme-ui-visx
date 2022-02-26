import React, { FC, MouseEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useHasMounted, usePortal } from 'src/hooks';
import ReactDOM from 'react-dom';
import { useSpring, animated } from 'react-spring';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const portal = usePortal(typeof document !== 'undefined' ? document : null);
  const springProps = useSpring({
    to: { opacity: isOpen ? 1 : 0 },
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
        <animated.div
          data-testid="modal-overlay"
          role="presentation"
          style={springProps}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: 3,
            zIndex: isOpen ? 'modal-overlay' : 'hidden',
            bg: 'purple',
            // bg: transparentize('purple', isOpen ? 0.7 : 1),
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          onClick={onClose}
          onKeyUp={() => null}
          tabIndex={-1}
        >
          <div
            data-testid="modal"
            ref={modalRef}
            role="presentation"
            onClick={handleModalClick}
            onKeyUp={handleEscape}
            tabIndex={-1}
            sx={{
              zIndex: isOpen ? 'modal' : 'hidden',
              opacity: isOpen ? 1 : 0,
            }}
          >
            {children}
          </div>
        </animated.div>,
        portal
      )}
    </>
  );
};
