// src/shared/ui/RenderingStrategyCard.tsx
import type { RenderingStrategyItem } from "@/entities/renderingStrategy/strategies";

type RenderingStrategyCardProps = {
  item: RenderingStrategyItem;
  labels: {
    route: string;
    role: string;
    dataSource: string;
    strategy: string;
    cachePolicy: string;
    reason: string;
  };
};

export function RenderingStrategyCard({
  item,
  labels,
}: RenderingStrategyCardProps) {
  return (
    <article className="app-surface app-stack rendering-strategy-card">
      <header className="rendering-strategy-card__header">
        <div>
          <span>{labels.route}</span>
          <strong className="rendering-strategy-card__route">
            {item.route}
          </strong>
        </div>
        <span className="rendering-strategy-card__mode">
          {item.strategy}
        </span>
      </header>

      <dl className="app-detail-list rendering-strategy-card__meta">
        <div>
          <dt>{labels.role}</dt>
          <dd>{item.role}</dd>
        </div>
        <div>
          <dt>{labels.dataSource}</dt>
          <dd>{item.dataSource}</dd>
        </div>
        <div>
          <dt>{labels.strategy}</dt>
          <dd>{item.strategy}</dd>
        </div>
        <div>
          <dt>{labels.cachePolicy}</dt>
          <dd>{item.cachePolicy}</dd>
        </div>
      </dl>

      <div className="rendering-strategy-card__reason">
        <span>{labels.reason}</span>
        <p>{item.reason}</p>
      </div>
    </article>
  );
}
