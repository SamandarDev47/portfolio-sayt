"use client";

import { useEffect, useState } from "react";

type PersistentObjectStateResult<T extends Record<string, unknown>> = {
  state: T;
  isReady: boolean;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  setState: React.Dispatch<React.SetStateAction<T>>;
  clear: () => void;
};

export function usePersistentObjectState<T extends Record<string, unknown>>(
  draftKey: string,
  initialState: T,
): PersistentObjectStateResult<T> {
  const storageKey = `devfolio:draft:${draftKey}`;
  const [state, setState] = useState<T>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      try {
        const rawDraft = window.localStorage.getItem(storageKey);

        if (rawDraft) {
          const parsedDraft = JSON.parse(rawDraft) as Partial<T>;
          setState({ ...initialState, ...parsedDraft });
        } else {
          setState(initialState);
        }
      } catch {
        setState(initialState);
      } finally {
        setIsReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialState, storageKey]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [isReady, state, storageKey]);

  function setField<K extends keyof T>(key: K, value: T[K]) {
    setState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  }

  function clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(storageKey);
  }

  return {
    state,
    isReady,
    setField,
    setState,
    clear,
  };
}
