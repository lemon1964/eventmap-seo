// src/shared/ui/RouteMapCard.tsx
import type { RouteMapItem } from "@/entities/routeMap/routes";

type RouteMapCardProps = {
  item: RouteMapItem;
  labels: {
    pattern: string;
    example: string;
    segments: string;
    layer: string;
  };
};

export function RouteMapCard({ item, labels }: RouteMapCardProps) {
  return (
    <article className="app-surface app-stack route-map-card">
      <div className="route-map-card__header">
        <span className="app-badge route-map-card__badge">{item.layer}</span>
        <strong className="app-code-text route-map-card__pattern">{item.pattern}</strong>
      </div>

      <dl className="app-detail-list route-map-card__details">
        <div>
          <dt>{labels.pattern}</dt>
          <dd>{item.pattern}</dd>
        </div>
        <div>
          <dt>{labels.example}</dt>
          <dd className="app-code-text route-map-card__example">{item.example}</dd>
        </div>
        <div>
          <dt>{labels.segments}</dt>
          <dd className="app-code-text route-map-card__segments">
            {item.dynamicSegments.map((segment) => (
              <span key={segment}>[{segment}]</span>
            ))}
          </dd>
        </div>
        <div>
          <dt>{labels.layer}</dt>
          <dd>{item.layer}</dd>
        </div>
      </dl>
    </article>
  );
}
