import { useEffect, useCallback } from 'react';

interface UseModalProps {
  isOpen: boolean;
  onClose: () => void;
  preventBodyScroll?: boolean;
  closeOnEscape?: boolean;
}

export const useModal = ({ 
  isOpen, 
  onClose, 
  preventBodyScroll = true,
  closeOnEscape = true 
}: UseModalProps) => {
  
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      if (preventBodyScroll) {
        document.body.style.overflow = 'hidden';
      }
      if (closeOnEscape) {
        document.addEventListener('keydown', handleEscapeKey);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey, preventBodyScroll, closeOnEscape]);
};