// src/app/[locale]/demo/modal-vs-full-page/page.tsx
import Link from "next/link";
import { buildSearchHref } from "@/entities/search/searchFilters";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type ModalVsFullPageDemoProps = {
  params: LocaleParams;
};

export default async function ModalVsFullPageDemo({
  params,
}: ModalVsFullPageDemoProps) {
  const locale = await getLocaleFromParams(params);
  const musicSearchPath = buildSearchHref({
    filters: { category: "music" },
    locale,
  });
  const detailPath = routes.eventDetail(locale, "london-music-night");
  const links = [
    { href: musicSearchPath, label: "Open search music" },
    { href: detailPath, label: "Open full page event" },
    { href: routes.home(locale), label: "Open product home" },
    { href: routes.demo(locale), label: "Back to Demo Lab" },
  ];
  const concepts = [
    {
      title: "Same event data",
      description:
        "Full page and modal receive the same event object before rendering.",
    },
    {
      title: "Full page route owns metadata",
      description:
        "The direct event URL keeps generateMetadata, canonical, hreflang and share previews.",
    },
    {
      title: "Modal route owns quick preview UX",
      description:
        "The intercepted route renders inside @modal and stays focused on the list browsing flow.",
    },
    {
      title: "One component, two modes",
      description:
        "EventDetails keeps the existing JSX in one place while routes provide different actions.",
    },
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Intercepting routes</p>
        <h1>Modal vs full page</h1>
        <p>
          Same event data can appear as a full SEO page or as a compact modal
          preview, depending on how the user enters the route.
        </p>
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <h2>Open these URLs</h2>
        <div className="app-cluster">
          {links.map((link) => (
            <Link className="app-chip" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="app-grid">
        {concepts.map((concept) => (
          <article
            className="app-surface app-stack app-muted-copy"
            key={concept.title}
          >
            <span className="app-badge">concept</span>
            <h2>{concept.title}</h2>
            <p>{concept.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
