// src/shared/ui/PageShell.tsx
import type { Locale } from "@/shared/lib/locales";
import { Footer } from "@/shared/ui/Footer";
import { Nav } from "@/shared/ui/Nav";

type PageShellProps = {
  children: React.ReactNode;
  locale: Locale;
};

export async function PageShell({ children, locale }: PageShellProps) {
  return (
    <>
      <Nav locale={locale} />
      <main className="page-shell">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
