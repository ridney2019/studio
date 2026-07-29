"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { label: "home", href: "/" },
  { label: "artists", href: "/#artists" },
  { label: "reviews", href: "/#reviews" },
  { label: "location", href: "/#location" },
  { label: "contact", href: "/contact" },
  { label: "workshop", href: "/workshop" },
  { label: "blog", href: "/blog" },
];

export default function GlobalMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="global-menu-shell">
      <button
        type="button"
        className="global-menu-toggle"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        <span className="pill-dot-indicator" />
        <span>MENU</span>
      </button>

      {isOpen ? (
        <div className="global-menu-panel">
          <div className="global-menu-links">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/" && pathname === "/");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`global-menu-link${isActive ? " active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
