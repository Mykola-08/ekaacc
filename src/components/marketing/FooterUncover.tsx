'use client';

import React from 'react';

export default function FooterUncover({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const footerRef = React.useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = React.useState(0);

  React.useEffect(() => {
    if (!footerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-[#f5f5f7]">
      <div
        className="relative z-10 bg-secondary min-h-screen"
        style={{ marginBottom: `${footerHeight}px` }}
      >
        {children}
      </div>

      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full z-0"
      >
        {footer}
      </div>
    </div>
  );
}
