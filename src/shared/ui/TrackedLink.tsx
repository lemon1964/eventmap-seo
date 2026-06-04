// src/shared/ui/TrackedLink.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/shared/lib/track";

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  event: string;
  src: string;
  ariaCurrent?: "page";
};

export function TrackedLink({
  href,
  className,
  children,
  event,
  src,
  ariaCurrent,
}: TrackedLinkProps) {
  return (
    <Link
      aria-current={ariaCurrent}
      className={className}
      href={href}
      onClick={() => track(event, src)}
    >
      {children}
    </Link>
  );
}