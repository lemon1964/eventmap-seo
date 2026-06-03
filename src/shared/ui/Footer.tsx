// src/shared/ui/Footer.tsx
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/lib/locales";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>{t("course")}</span>
      </div>
    </footer>
  );
}
