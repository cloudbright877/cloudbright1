/**
 * Smooth scroll to element with offset
 * @param anchorId - ID of element to scroll to
 * @param options - Additional scroll options
 */
export const smoothScrollToAnchor = (
  anchorId: string, 
  options: {
    headerSelector?: string;
    extraOffset?: number;
    centerContent?: boolean;
  } = {}
) => {
  const element = document.getElementById(anchorId);
  if (!element) {
    console.warn(`Element with id "${anchorId}" not found`);
    return;
  }

  // Determine header height dynamically
  const headerSelector = options.headerSelector || 'header, [class*="header"], [class*="HeaderLanding"], [class*="body"]';
  let header = document.querySelector(headerSelector);
  
  // If header not found by selector, search for any fixed element at top
  if (!header) {
    header = document.querySelector('[style*="position: fixed"][style*="top: 0"]') || 
             document.querySelector('[class*="fixed"][class*="top"]');
  }
  
  const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
  
  // Additional offset for content centering
  const extraOffset = options.extraOffset ?? (options.centerContent ? 50 : 0);
  
  // Get element position relative to document start
  const elementRect = element.getBoundingClientRect();
  const elementTop = elementRect.top + window.pageYOffset;
  
  // Calculate final position with offsets
  const finalPosition = elementTop - headerHeight - extraOffset;

  window.scrollTo({
    top: Math.max(0, finalPosition), // Ensure we don't scroll above page start
    behavior: 'smooth'
  });
};

/**
 * Simple smooth scroll to element with header offset
 * @param anchorId - ID of element to scroll to
 */
export const simpleSmoothScroll = (anchorId: string) => {
  const element = document.getElementById(anchorId);
  if (!element) {
    console.warn(`Element with id "${anchorId}" not found`);
    return;
  }

  // Find header
  const header = document.querySelector('[class*="body"]') || 
                 document.querySelector('header') || 
                 document.querySelector('[class*="header"]');
  
  const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
  
  // Calculate position with header offset
  const elementRect = element.getBoundingClientRect();
  const elementTop = elementRect.top + window.pageYOffset;
  const finalPosition = elementTop - headerHeight - 20; // Additional 20px offset

  window.scrollTo({
    top: Math.max(0, finalPosition),
    behavior: 'smooth'
  });
};

/**
 * Smooth scroll to top of page
 */
export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Smooth scroll to bottom of page
 */
export const smoothScrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};
