// src/app/[locale]/demo/final-architecture/page.tsx
import Link from "next/link";
import {
  architectureLayers,
  authUxNotes,
  backendEvolutionNotes,
  demoRoutes,
  importRules,
  productRoutes,
  serverClientBoundaries,
  systemContracts,
  type ArchitectureCard,
  type ArchitectureRoute,
} from "@/entities/architecture/finalArchitecture";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

const renderCardGrid = (items: ArchitectureCard[], badge: string) => (
  <div className="app-grid">
    {items.map((item) => (
      <article className="app-surface app-stack app-muted-copy" key={item.title}>
        <p className="app-badge">{badge}</p>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
      </article>
    ))}
  </div>
);

const renderRouteGrid = (items: ArchitectureRoute[], badge: string) => (
  <div className="app-grid">
    {items.map((item) => (
      <article className="app-surface app-stack app-muted-copy" key={item.path}>
        <p className="app-badge">{badge}</p>
        <h2 className="app-code-text">{item.path}</h2>
        <p>{item.role}</p>
      </article>
    ))}
  </div>
);

type PageProps = {
  params: LocaleParams;
};

export default async function FinalArchitecturePage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Module 10.1</p>
        <h1>Final architecture</h1>
        <p>
          This checkpoint maps EventMap after i18n, server-rendered search,
          metadata, modal routes, streaming, localStorage favorites and
          Supabase cloud favorites.
        </p>
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">Product EventMap vs Demo Lab</p>
        <h2>Two route groups, two responsibilities</h2>
        <p>
          Product EventMap keeps real user scenarios clean. Demo Lab explains
          course patterns and architecture decisions on separate pages.
        </p>
      </div>

      <div className="app-stack">
        <h2>Product routes</h2>
        {renderRouteGrid(productRoutes, "Product")}
      </div>

      <div className="app-stack">
        <h2>Demo routes</h2>
        {renderRouteGrid(demoRoutes, "Demo")}
      </div>

      <div className="app-stack">
        <h2>Layer map</h2>
        {renderCardGrid(architectureLayers, "Layer")}
      </div>

      <div className="app-stack">
        <h2>Import rules</h2>
        {renderCardGrid(importRules, "Rule")}
      </div>

      <div className="app-stack">
        <h2>Server/client boundary</h2>
        {renderCardGrid(serverClientBoundaries, "Boundary")}
      </div>

      <div className="app-stack">
        <h2>System contracts</h2>
        {renderCardGrid(systemContracts, "Contract")}
      </div>

      <div className="app-stack">
        <h2>Auth UI boundary</h2>
        {renderCardGrid(authUxNotes, "Auth")}
      </div>

      <div className="app-stack">
        <h2>Backend evolution</h2>
        {renderCardGrid(backendEvolutionNotes, "Backend")}
      </div>

      <div className="app-cluster">
        <Link className="button button--secondary" href={routes.demo(locale)}>
          Back to Demo Lab
        </Link>
        <Link className="button button--secondary" href={routes.search(locale)}>
          Open Search
        </Link>
        <Link className="button button--secondary" href={routes.favorites(locale)}>
          Open Favorites
        </Link>
        <Link className="button button--secondary" href={routes.login(locale)}>
          Open Login
        </Link>
      </div>
    </section>
  );
}
