import React, { useCallback, useEffect, useRef } from "react";

const useFocusOnGlobalHotkey = <TElement extends HTMLElement>(
  hotkey: string
) => {
  return useGlobalHotkey<TElement>(hotkey, (ref, e) => {
    if (ref.current !== null && document.activeElement !== ref.current) {
      ref.current.focus();
      e.preventDefault();
    }
  });
};

const useFullscreenOnGlobalHotkey = <TElement extends HTMLElement>(
  hotkey: string
) => {
  return useGlobalHotkey<TElement>(hotkey, (ref, _) => {
    if (ref.current !== null && document.fullscreenElement !== ref.current) {
      ref.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
};

const useGlobalHotkey = <TElement extends HTMLElement>(
  hotkey: string,
  callback: (r: React.RefObject<TElement>, evt: any) => void
) => {
  const ref = useRef<TElement>(null);

  const onKeyDown = useCallback(
    (e: any) => {
      if (
        ref.current === null ||
        e.key !== hotkey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.ctrlKey ||
        (e.target !== document.body && e.target !== ref.current)
      )
        return;

      callback(ref, e);
    },
    [callback, hotkey, ref]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return ref;
};

export { useFullscreenOnGlobalHotkey, useFocusOnGlobalHotkey };
