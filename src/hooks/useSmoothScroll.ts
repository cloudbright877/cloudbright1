import { useCallback } from 'react';
import { smoothScrollToAnchor, smoothScrollToTop, smoothScrollToBottom } from '@/lib/smoothScroll';

/**
 * Hook for convenient smooth scrolling usage
 */
export const useSmoothScroll = () => {
  const scrollToAnchor = useCallback((
    anchorId: string, 
    options: {
      headerSelector?: string;
      extraOffset?: number;
      centerContent?: boolean;
    } = {}
  ) => {
    smoothScrollToAnchor(anchorId, options);
  }, []);

  const scrollToTop = useCallback(() => {
    smoothScrollToTop();
  }, []);

  const scrollToBottom = useCallback(() => {
    smoothScrollToBottom();
  }, []);

  return {
    scrollToAnchor,
    scrollToTop,
    scrollToBottom,
  };
};
