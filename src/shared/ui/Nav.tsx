// src/shared/ui/Nav.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";
import { AudioToggle } from "@/shared/ui/AudioToggle";
import { CourseLink } from "@/shared/ui/CourseLink";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";

type NavProps = {
  locale: Locale;
};

export async function Nav({ locale }: NavProps) {
  const t = await getTranslations({ locale, namespace: "nav" });

  const navItems = [
    { href: routes.home(locale), label: t("home") },
    { href: routes.search(locale), label: t("search") },
    { href: routes.favorites(locale), label: t("favorites") },
    { href: routes.login(locale), label: t("login") },
    { href: routes.demo(locale), label: t("demo") },
  ];

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link className="nav__brand" href={routes.home(locale)}>
          EventMap
        </Link>

        <nav className="nav__links" aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link className="nav__link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav__actions">
          <CourseLink />
          <AudioToggle />
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
// // src/shared/ui/Nav.tsx
// import Link from "next/link";
// import { getTranslations } from "next-intl/server";
// import type { Locale } from "@/shared/lib/locales";
// import { routes } from "@/shared/lib/routes";
// import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";

// type NavProps = {
//   locale: Locale;
// };

// export async function Nav({ locale }: NavProps) {
//   const t = await getTranslations({ locale, namespace: "nav" });

//   const navItems = [
//     { href: routes.home(locale), label: t("home") },
//     { href: routes.search(locale), label: t("search") },
//     { href: routes.favorites(locale), label: t("favorites") },
//     { href: routes.login(locale), label: t("login") },
//     { href: routes.demo(locale), label: t("demo") },
//   ];

//   return (
//     <header className="nav">
//       <div className="nav__inner">
//         <Link className="nav__brand" href={routes.home(locale)}>
//           EventMap
//         </Link>
//         <nav className="nav__links" aria-label="Основная навигация">
//           {navItems.map((item) => (
//             <Link className="nav__link" href={item.href} key={item.href}>
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//         <LanguageSwitcher locale={locale} />
//       </div>
//     </header>
//   );
// }
