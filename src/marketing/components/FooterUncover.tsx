'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function FooterUncover({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
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
      {/* Main Content Container */}
      <div
        className="bg-secondary relative z-10 min-h-screen"
        style={{ marginBottom: `${footerHeight}px` }}
      >
        {children}
      </div>

      {/* Fixed Footer */}
      <div ref={footerRef} className="fixed bottom-0 left-0 z-0 w-full">
        {footer}
      </div>
    </div>
  );
}
