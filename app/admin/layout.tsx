import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="admin-shell"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 500px at 15% -10%, rgba(224, 59, 85, 0.1), transparent 60%), linear-gradient(180deg, #f6f6f7 0%, #eceef1 100%)",
        color: "#111111",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .admin-shell, .admin-shell * {
              color: inherit;
            }

            .admin-shell main,
            .admin-shell section,
            .admin-shell article,
            .admin-shell h1,
            .admin-shell h2,
            .admin-shell h3,
            .admin-shell p,
            .admin-shell label,
            .admin-shell span,
            .admin-shell li {
              color: #111111;
            }

            .admin-shell input,
            .admin-shell textarea,
            .admin-shell select {
              color: #111111 !important;
              -webkit-text-fill-color: #111111 !important;
              caret-color: #111111;
            }

            .admin-shell input::placeholder,
            .admin-shell textarea::placeholder {
              color: rgba(17, 17, 17, 0.6) !important;
              -webkit-text-fill-color: rgba(17, 17, 17, 0.6) !important;
            }

            .admin-shell option {
              color: #111111;
              background: #f5f6f8;
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
