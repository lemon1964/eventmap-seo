// src/features/demo/ParallelRoutesDemoContent.tsx
import Link from "next/link";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";

type ParallelRoutesDemoContentProps = {
  locale: Locale;
  mode: "children-only" | "with-modal";
};

export function ParallelRoutesDemoContent({
  locale,
  mode,
}: ParallelRoutesDemoContentProps) {
  const isWithModal = mode === "with-modal";

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Parallel Routes Demo</p>
        <h1>{isWithModal ? "Children + @modal" : "Main content flow"}</h1>
        <p>
          The same layout can render the regular page through children and an
          additional UI stream through a named parallel route slot.
        </p>
      </div>

      <div className="app-grid">
        <article className="app-surface app-stack app-muted-copy">
          <span className="app-badge">children</span>
          <h2>Primary route tree</h2>
          <p>
            The regular page content stays in the main route tree and continues
            to use the existing layout shell.
          </p>
        </article>

        <article className="app-surface app-stack app-muted-copy">
          <span className="app-badge">@modal</span>
          <h2>Second UI stream</h2>
          <p>
            The modal slot is a named parallel route. It does not add @modal to
            the URL, but the layout receives it as another React node.
          </p>
        </article>
      </div>

      <div className="app-cluster">
        <Link className="button button--secondary" href={routes.demo(locale)}>
          Back to Demo Lab
        </Link>

        {isWithModal ? (
          <Link
            className="button button--secondary"
            href={routes.demoParallelRoutes(locale)}
          >
            Return to children-only URL
          </Link>
        ) : (
          <Link
            className="button"
            href={routes.demoParallelRoutesWithModal(locale)}
          >
            Open @modal slot
          </Link>
        )}

        <Link className="button" href={routes.search(locale)}>
          Open product search
        </Link>

        <Link className="button" href={routes.demoRoutes(locale)}>
          Open route map
        </Link>
      </div>
    </section>
  );
}
