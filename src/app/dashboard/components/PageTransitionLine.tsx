'use client';

import { usePathname } from 'next/navigation';

export default function PageTransitionLine() {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="pointer-events-none fixed top-0 left-0 right-0 z-40"
    >
      <div className="mx-0 h-1 bg-linear-to-r from-[#1743CE] via-[#4F46E5] to-[#1743CE] page-transition-line" />
    </div>
  );
}


