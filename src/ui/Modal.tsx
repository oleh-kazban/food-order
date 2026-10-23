import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
};

export function Modal({ open, children, className = '', onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const modal = dialog.current;

    if (open) {
      modal?.showModal();
    }

    return () => modal?.close();
  }, [open]);

  return createPortal(
    <dialog
      className={`modal ${className}`}
      ref={dialog}
      onClose={() => {
        if (open && onClose) {
          onClose();
        }
      }}
    >
      {open ? children : null}
    </dialog>,
    document.getElementById('modal') as Element,
  );
}
