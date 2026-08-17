"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuLink = {
  href: string;
  label: string;
};

const mainLinks: MenuLink[] = [
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/content#faq-admin", label: "FAQ" },
];

const accountLinks: MenuLink[] = [
  { href: "/admin/register", label: "Register" },
  { href: "/admin/forgot-password", label: "Forgot Password" },
  { href: "/admin/verify-email", label: "Verify Email" },
  { href: "/admin/reset-password", label: "Reset Password" },
];

export default function AdminMenu() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const baseHref = href.split("#")[0];
    return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  };

  return (
    <nav className="admin-menu" aria-label="Admin menu">
      <div className="admin-menu__group">
        <span className="admin-menu__label">Manage</span>
        <div className="admin-menu__links">
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? "is-active" : ""}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-menu__group">
        <span className="admin-menu__label">Account</span>
        <div className="admin-menu__links">
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? "is-active" : ""}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-menu {
          position: sticky;
          top: 0;
          z-index: 50;
          display: grid;
          gap: 1rem;
          padding: 1rem 4%;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(246, 247, 248, 0.92);
          backdrop-filter: blur(12px);
        }

        .admin-menu__group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
        }

        .admin-menu__label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          opacity: 0.58;
          min-width: 5.5rem;
        }

        .admin-menu__links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .admin-menu__links a {
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 0.95rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.14);
          text-decoration: none;
          color: #111111;
          background: rgba(255, 255, 255, 0.75);
          font-size: 0.85rem;
          font-weight: 700;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .admin-menu__links a:hover {
          transform: translateY(-1px);
          border-color: rgba(0, 0, 0, 0.24);
          background: #ffffff;
        }

        .admin-menu__links a.is-active {
          background: linear-gradient(135deg, #6f0000 0%, #b2001a 55%, #ff4d4d 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 10px 22px rgba(109, 6, 17, 0.24);
        }

        @media (max-width: 767px) {
          .admin-menu {
            padding: 0.9rem 1rem;
          }

          .admin-menu__label {
            min-width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}