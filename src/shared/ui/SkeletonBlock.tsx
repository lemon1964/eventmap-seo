// src/shared/ui/SkeletonBlock.tsx
type SkeletonBlockProps = {
    description: string;
    label: string;
    title: string;
  };
  
  export function SkeletonBlock({
    description,
    label,
    title,
  }: SkeletonBlockProps) {
    return (
      <article className="app-surface app-stack app-muted-copy" aria-busy="true">
        <span className="app-badge">{label}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </article>
    );
  }
  