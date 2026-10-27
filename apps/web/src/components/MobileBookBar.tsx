"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Phones only: keeps the main action one tap away. Hidden where it would be redundant. */
export function MobileBookBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book") || pathname.startsWith("/booking")) return null;
  return (
    <>
      <div aria-hidden className="h-20 sm:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <div className="flex gap-2">
          <Link href="/book" className="btn-primary flex-1">Book a free call</Link>
          <Link href="/contact" className="btn-quiet">Message us</Link>
        </div>
      </div>
    </>
  );
}
