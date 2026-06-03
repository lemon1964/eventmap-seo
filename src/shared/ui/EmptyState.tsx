// src/shared/ui/EmptyState.tsx
import { Surface } from "@/shared/ui/primitives";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Surface className="app-muted-copy empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </Surface>
  );
}
