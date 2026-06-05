// src/shared/ui/AudioToggle.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";// import { useEffect, useRef, useState } from "react";

const emptySubscribe = () => () => {};

const reportPlayError = (error: unknown) => {
  const message = error instanceof DOMException ? `${error.name}: ${error.message}` : String(error);

  window.alert(message);
};

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  
  useEffect(() => {
    audioRef.current = new Audio("/audio/instrumental.mp3");
    audioRef.current.loop = true;
    // audioRef.current.volume = 0.35;

    const tryPlay = () => {
      if (!audioRef.current || playing) return;

      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(reportPlayError);
      // .catch(() => {});
    };

    document.body.addEventListener("click", tryPlay, { once: true });

    return () => {
      document.body.removeEventListener("click", tryPlay);
    };
    // копия поведения workbench: запуск после первого пользовательского клика
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  };

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;

      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (!href) return;

      const isSpecialScheme =
        href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("sms:");

      let isExternal = false;

      try {
        const url = new URL(href, window.location.href);
        isExternal = url.origin !== window.location.origin;
      } catch {
        // relative links are safe
      }

      if (isSpecialScheme || isExternal) {
        stopAudio();
      }
    };

    const onPageHide = () => stopAudio();
    const onBeforeUnload = () => stopAudio();

    const onVisibilityChange = () => {
      if (document.hidden) stopAudio();
    };

    document.addEventListener("click", onDocClick, true);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const toggleAudio = () => {
    window.alert("AudioToggle: click received");

    if (!audioRef.current) {
      window.alert("AudioToggle: audioRef is empty");
      return;
    }

    if (playing) {
      stopAudio();
      return;
    }

    audioRef.current
      .play()
      .then(() => {
        window.alert("AudioToggle: play resolved");
        setPlaying(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

        window.alert(`AudioToggle: play rejected\n${message}`);
      });
  };
  // const toggleAudio = () => {
  //   if (!audioRef.current) return;

  //   if (playing) {
  //     stopAudio();
  //     return;
  //   }

  //   audioRef.current
  //     .play()
  //     .then(() => setPlaying(true))
  //     .catch(reportPlayError);
  //     // .catch(() => {});
  // };

  return (
    <button
      type="button"
      onTouchStart={() => window.alert("AudioToggle: touchstart")}
      onPointerDown={() => window.alert("AudioToggle: pointerdown")}
      onClick={toggleAudio}
      aria-label="Audio debug"
      style={{
        position: "relative",
        zIndex: 9999,
        width: "56px",
        height: "56px",
        flex: "0 0 56px",
        border: "3px solid red",
        background: "yellow",
        color: "black",
        fontSize: "20px",
        touchAction: "manipulation",
        pointerEvents: "auto",
      }}
    >
      {hydrated ? "H 🔇" : "S 🔇"}
    </button>
  );
  // return (
  //   <button
  //     type="button"
  //     className="nav__audio-toggle"
  //     onClick={toggleAudio}
  //     aria-label={playing ? "Выключить музыку" : "Включить музыку"}
  //     title={playing ? "Выключить музыку" : "Включить музыку"}
  //   >
  //     {playing ? "🔊" : "🔇"}
  //   </button>
  // );
}
