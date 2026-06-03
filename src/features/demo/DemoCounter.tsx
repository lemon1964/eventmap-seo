// src/features/demo/DemoCounter.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function DemoCounter() {
  const t = useTranslations("demo");
  const [count, setCount] = useState(0);

  return (
    <section className="app-surface demo-counter" aria-label={t("counterAria")}>
      <div>
        <p className="demo-counter__label">{t("clientTitle")}</p>
        <h2>{t("selectedCount", { count })}</h2>
        <p>{t("clientDescription")}</p>
      </div>

      <div className="demo-counter__actions">
        <button
          aria-label={t("decrease")}
          className="demo-counter__button"
          type="button"
          onClick={() => setCount((current) => Math.max(0, current - 1))}
        >
          -
        </button>
        <span className="demo-counter__value">{count}</span>
        <button
          aria-label={t("increase")}
          className="demo-counter__button"
          type="button"
          onClick={() => setCount((current) => current + 1)}
        >
          +
        </button>
      </div>
    </section>
  );
}
