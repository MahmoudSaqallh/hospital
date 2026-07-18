"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "./LoadingScreen";
import { useLoadingChrome } from "./useLoadingChrome";

export type LoadingSource = "splash" | "route";

type LoadingContextValue = {
  registerLoading: (source: LoadingSource) => void;
  unregisterLoading: (source: LoadingSource) => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoadingOverlay() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingOverlay must be used within LoadingOverlayProvider");
  }
  return context;
}

export function LoadingOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sources, setSources] = useState<Set<LoadingSource>>(() => new Set());
  const [chromeLocked, setChromeLocked] = useState(true);
  const sourcesRef = useRef(sources);

  const isVisible = sources.size > 0;
  sourcesRef.current = sources;

  const registerLoading = useCallback((source: LoadingSource) => {
    setSources((prev) => {
      if (prev.has(source)) return prev;
      const next = new Set(prev);
      next.add(source);
      return next;
    });
  }, []);

  const unregisterLoading = useCallback((source: LoadingSource) => {
    setSources((prev) => {
      if (!prev.has(source)) return prev;
      const next = new Set(prev);
      next.delete(source);
      return next;
    });
  }, []);

  useEffect(() => {
    if (isVisible) {
      setChromeLocked(true);
    }
  }, [isVisible]);

  useLoadingChrome(chromeLocked);

  const contextValue = useMemo(
    () => ({ registerLoading, unregisterLoading }),
    [registerLoading, unregisterLoading],
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (sourcesRef.current.size === 0) {
            setChromeLocked(false);
          }
        }}
      >
        {isVisible ? <LoadingScreen key="loading-overlay" /> : null}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function RouteLoadingTrigger() {
  const { registerLoading, unregisterLoading } = useLoadingOverlay();

  useEffect(() => {
    registerLoading("route");
    return () => unregisterLoading("route");
  }, [registerLoading, unregisterLoading]);

  return null;
}
