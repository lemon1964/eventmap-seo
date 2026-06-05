"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

type HydrationProbeProps = {
  label: string;
};

export function HydrationProbe({ label }: HydrationProbeProps) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => window.alert(`${label}: click works`)}
      style={{
        position: "relative",
        zIndex: 99999,
        border: "2px solid red",
        background: "yellow",
        color: "black",
        padding: "8px",
        margin: "4px",
      }}
    >
      {label}: {hydrated ? "H" : "S"}
    </button>
  );
}