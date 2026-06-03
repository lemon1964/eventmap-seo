// src/app/[locale]/demo/suspense-streaming/loading.tsx
import { SkeletonBlock } from "@/shared/ui/SkeletonBlock";

export default function SuspenseStreamingLoading() {
  return (
    <section className="container demo-page">
      <SkeletonBlock
        description="Route-level loading appears while this route segment is loading."
        label="loading.tsx"
        title="Preparing Suspense demo"
      />
    </section>
  );
}
