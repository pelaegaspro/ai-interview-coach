import { useCallback, useEffect, useMemo, useState } from "react";
import { getFallbackAppConfig } from "../lib/appConfig";

const fallbackConfig = getFallbackAppConfig();

const fallbackOverlayState = {
  opacity: 0.85,
  clickThrough: false,
  visible: true
};

export function useOverlayState() {
  const [appConfig, setAppConfig] = useState(fallbackConfig);
  const [overlay, setOverlay] = useState(fallbackOverlayState);

  useEffect(() => {
    let unsubscribe;

    async function initialize() {
      if (!window.overlayApi) {
        return;
      }

      try {
        const [config, state] = await Promise.all([
          window.overlayApi.getConfig(),
          window.overlayApi.getState()
        ]);

        setAppConfig(config);
        setOverlay(state);

        unsubscribe = window.overlayApi.subscribe((nextState) => {
          setOverlay(nextState);
        });
      } catch (error) {
        console.error("Unable to initialize overlay state:", error);
      }
    }

    initialize();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const setOpacity = useCallback(async (value) => {
    setOverlay((current) => ({ ...current, opacity: value }));

    if (!window.overlayApi) {
      return;
    }

    const nextState = await window.overlayApi.setOpacity(value);
    setOverlay(nextState);
  }, []);

  const setClickThrough = useCallback(async (value) => {
    setOverlay((current) => ({ ...current, clickThrough: value }));

    if (!window.overlayApi) {
      return;
    }

    const nextState = await window.overlayApi.setClickThrough(value);
    setOverlay(nextState);
  }, []);

  const toggleVisibility = useCallback(async () => {
    if (!window.overlayApi) {
      return;
    }

    const nextState = await window.overlayApi.toggleVisibility();
    setOverlay(nextState);
  }, []);

  const windowAction = useCallback(async (action) => {
    if (!window.overlayApi) {
      return false;
    }

    return window.overlayApi.windowAction(action);
  }, []);

  return useMemo(
    () => ({
      appConfig,
      overlay,
      setOpacity,
      setClickThrough,
      toggleVisibility,
      windowAction
    }),
    [appConfig, overlay, setOpacity, setClickThrough, toggleVisibility, windowAction]
  );
}
