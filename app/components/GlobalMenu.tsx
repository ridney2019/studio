"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const primaryItems = [
  { label: "home", href: "/" },
  { label: "location", href: "/#location" },
  { label: "blog", href: "/blog" },
];

const utilityItems = [
  { label: "contact", href: "/contact" },
  { label: "workshop", href: "/workshop" },
];

export default function GlobalMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActivePath = (href: string) => {
    const pathOnly = href.split("#")[0];
    return pathOnly === "/" ? pathname === "/" : pathname === pathOnly;
  };

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
            {primaryItems.map((item) => {
              const isActive = isActivePath(item.href);

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

            <div className="global-menu-divider" />

            <div className="global-menu-utility-row">
              {utilityItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`global-menu-utility-link${isActivePath(item.href) ? " active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
