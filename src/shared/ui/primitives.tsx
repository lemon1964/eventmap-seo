// src/shared/ui/primitives.tsx
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type Size = "sm" | "md";
type Tone = "primary" | "secondary" | "muted";

function classes(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: Size;
};

export function Button({
  className,
  size = "md",
  tone = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classes(
        "button",
        "ui-button",
        `ui-button--${tone}`,
        `ui-button--${size}`,
        className,
      )}
      {...props}
    />
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={classes("ui-input", className)} {...props} />;
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={classes("ui-badge", `ui-badge--${tone}`, className)}
      {...props}
    />
  );
}

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Surface({ className, ...props }: SurfaceProps) {
  return <div className={classes("app-surface", "ui-surface", className)} {...props} />;
}

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Section({ className, ...props }: SectionProps) {
  return <section className={classes("section", className)} {...props} />;
}

export type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function SectionHeader({
  action,
  className,
  eyebrow,
  title,
  ...props
}: SectionHeaderProps) {
  return (
    <div className={classes("section-header", className)} {...props}>
      <div>
        {eyebrow ? <p className="hero__eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
