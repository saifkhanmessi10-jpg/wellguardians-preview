"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import clsx from "clsx";
import { nav } from "@/content/site";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label="WellGuardians home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.children ? (
                <li key={item.href} className="relative" onMouseLeave={() => setOpenMenu(null)}>
                  <button
                    type="button"
                    aria-expanded={openMenu === item.href}
                    aria-controls={`menu-${item.label}`}
                    onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                    onMouseEnter={() => setOpenMenu(item.href)}
                    className={clsx("flex items-center gap-1 rounded px-3 py-2 text-[0.92rem] font-medium hover:text-forest-800", isActive(item.href) ? "text-forest-800" : "text-ink")}
                  >
                    {item.label}
                    <ChevronDown aria-hidden className={clsx("size-4 transition-transform", openMenu === item.href && "rotate-180")} />
                  </button>
                  <div id={`menu-${item.label}`} hidden={openMenu !== item.href} className="absolute left-0 top-full pt-2">
                    <ul className="w-80 rounded-lg border border-line bg-white p-2 shadow-[0_12px_32px_-12px_rgba(22,58,49,.35)]">
                      <li>
                        <Link href={item.href} className="block rounded px-3 py-2.5 font-semibold text-forest-800 hover:bg-forest-50">
                          All {item.label.toLowerCase()}
                        </Link>
                      </li>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded px-3 py-2.5 text-[0.95rem] hover:bg-forest-50">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={clsx("rounded px-3 py-2 text-[0.92rem] font-medium hover:text-forest-800", isActive(item.href) ? "text-forest-800 underline decoration-marigold decoration-2 underline-offset-8" : "text-ink")}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/book" className="btn-primary hidden min-h-11 px-5 sm:inline-flex">
            Book a free consultation
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-paper lg:hidden">
        <nav aria-label="Mobile" className="wrap py-4">
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <li key={item.href} className="py-1">
                <Link href={item.href} className="block py-3 text-lg font-semibold text-forest-900">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-3 border-l-2 border-marigold pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-2 text-ink-soft">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-1">
              <Link href="/contact" className="block py-3 text-lg font-semibold text-forest-900">Contact</Link>
            </li>
          </ul>
          <Link href="/book" className="btn-primary mt-4 w-full">
            Book a free consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
