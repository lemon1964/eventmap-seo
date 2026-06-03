// src/app/[locale]/demo/suspense-streaming/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { SlowServerBlock } from "@/features/demo/SlowServerBlock";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { SkeletonBlock } from "@/shared/ui/SkeletonBlock";

type SuspenseStreamingPageProps = {
  params: LocaleParams;
};

export default async function SuspenseStreamingPage({
  params,
}: SuspenseStreamingPageProps) {
  const locale = await getLocaleFromParams(params);
  const links = [
    { href: routes.demo(locale), label: "Back to Demo Lab" },
    { href: routes.search(locale), label: "Open product search" },
    {
      href: routes.demoModalVsFullPage(locale),
      label: "Open modal vs full page",
    },
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Suspense Lab</p>
        <h1>Suspense and streaming</h1>
        <p>
          The route renders a fast shell first, then a slow server component
          resolves inside an explicit Suspense boundary.
        </p>
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <span className="app-badge">fast shell</span>
        <h2>Route shell</h2>
        <p>
          This content is ready immediately. The slow block below waits on the
          server and streams into the page when it is ready.
        </p>
        <div className="app-cluster">
          {links.map((link) => (
            <Link className="app-chip" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <Suspense
        fallback={
          <SkeletonBlock
            description="This block is visible while the slow server block is rendering."
            label="fallback"
            title="Streaming fallback"
          />
        }
      >
        <SlowServerBlock />
      </Suspense>
    </section>
  );
}
