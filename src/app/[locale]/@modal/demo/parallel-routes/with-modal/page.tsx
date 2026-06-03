// src/app/[locale]/@modal/demo/parallel-routes/with-modal/page.tsx
import Link from "next/link";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type ParallelRoutesModalPageProps = {
  params: LocaleParams;
};

export default async function ParallelRoutesModalPage({
  params,
}: ParallelRoutesModalPageProps) {
  const locale = await getLocaleFromParams(params);

  return (
    <div className="modal-backdrop">
      <aside className="modal-panel app-stack" aria-label="@modal slot">
        <div className="modal-panel__header">
          <span className="app-badge">@modal slot</span>
          <Link
            className="button button--secondary"
            href={routes.demoParallelRoutes(locale)}
          >
            Close slot
          </Link>
        </div>

        <div className="modal-panel__body app-stack app-muted-copy">
          <h2>This panel is rendered outside children.</h2>
          <p>
            The children page and this panel are rendered by the same locale
            layout through two route trees.
          </p>
          <p>
            Close slot is a regular Link to the children-only URL. No client
            router, state or intercepting route is involved in this lesson.
          </p>
        </div>
      </aside>
    </div>
  );
}
