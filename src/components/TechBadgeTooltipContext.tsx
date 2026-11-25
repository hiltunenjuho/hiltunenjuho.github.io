import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

interface TooltipState {
  activeId: string | null;
  pinned: boolean;
  closing: boolean;
}

interface TechBadgeTooltipContextValue extends TooltipState {
  openOnHover: (id: string, anchor: HTMLElement) => void;
  pin: (id: string, anchor: HTMLElement) => void;
  close: (id?: string) => void;
  closeOnHoverEnd: (id: string) => void;
  cancelClose: (id: string) => void;
  registerTooltipElement: (id: string, element: HTMLElement | null) => void;
}

const closedState: TooltipState = {
  activeId: null,
  pinned: false,
  closing: false,
};

const TechBadgeTooltipContext = createContext<TechBadgeTooltipContextValue | null>(null);

export function TechBadgeTooltipProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(closedState);
  const stateRef = useRef(state);
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  stateRef.current = state;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const close = useCallback((id?: string) => {
    const current = stateRef.current;
    if (!current.activeId || (id && current.activeId !== id)) {
      return;
    }

    clearCloseTimer();
    setState((previous) =>
      previous.activeId === current.activeId ? { ...previous, closing: true } : previous,
    );
    closeTimerRef.current = window.setTimeout(() => {
      const latest = stateRef.current;
      if (latest.closing && latest.activeId === current.activeId) {
        anchorRef.current = null;
        tooltipRef.current = null;
        setState(closedState);
      }
      closeTimerRef.current = null;
    }, 160);
  }, [clearCloseTimer]);

  const openOnHover = useCallback((id: string, anchor: HTMLElement) => {
    const current = stateRef.current;
    if (current.pinned && current.activeId !== id) {
      return;
    }

    clearCloseTimer();
    anchorRef.current = anchor;
    setState({
      activeId: id,
      pinned: current.pinned && current.activeId === id,
      closing: false,
    });
  }, [clearCloseTimer]);

  const pin = useCallback((id: string, anchor: HTMLElement) => {
    clearCloseTimer();
    anchorRef.current = anchor;
    setState({ activeId: id, pinned: true, closing: false });
  }, [clearCloseTimer]);

  const closeOnHoverEnd = useCallback((id: string) => {
    const current = stateRef.current;
    if (current.activeId === id && !current.pinned) {
      close(id);
    }
  }, [close]);

  const cancelClose = useCallback((id: string) => {
    if (stateRef.current.activeId !== id) {
      return;
    }

    clearCloseTimer();
    setState((previous) =>
      previous.activeId === id && previous.closing
        ? { ...previous, closing: false }
        : previous,
    );
  }, [clearCloseTimer]);

  const registerTooltipElement = useCallback((id: string, element: HTMLElement | null) => {
    if (stateRef.current.activeId === id) {
      tooltipRef.current = element;
    }
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const current = stateRef.current;
      if (!current.pinned || current.closing || !(event.target instanceof Node)) {
        return;
      }

      if (anchorRef.current?.contains(event.target) || tooltipRef.current?.contains(event.target)) {
        return;
      }

      close(current.activeId ?? undefined);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const current = stateRef.current;
      if (event.key === "Escape" && current.activeId) {
        close(current.activeId);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer, close]);

  const value = useMemo(
    () => ({
      ...state,
      openOnHover,
      pin,
      close,
      closeOnHoverEnd,
      cancelClose,
      registerTooltipElement,
    }),
    [state, openOnHover, pin, close, closeOnHoverEnd, cancelClose, registerTooltipElement],
  );

  return (
    <TechBadgeTooltipContext.Provider value={value}>
      {children}
    </TechBadgeTooltipContext.Provider>
  );
}

export function useTechBadgeTooltip(): TechBadgeTooltipContextValue {
  const context = useContext(TechBadgeTooltipContext);
  if (!context) {
    throw new Error("Tech badge tooltips must be used inside their provider.");
  }
  return context;
}
