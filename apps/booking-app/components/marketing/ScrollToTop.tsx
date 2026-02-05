import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (internal anchor link), let the smooth scroll provider handle it
    if (hash) {
      // Find the element and scroll to it smoothly
      const element = document.getElementById(hash.substring(1));
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 80; // Account for sticky header

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      return;
    }

    // For regular page navigation (no hash), scroll to top immediately
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
