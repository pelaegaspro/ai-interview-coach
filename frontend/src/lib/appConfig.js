const fallbackOverlayRange = __OVERLAY_RANGE__;

export function getFallbackAppConfig() {
  return {
    backendUrl: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8787",
    overlayRange: fallbackOverlayRange,
    shortcuts: {
      visibility: "Ctrl+Shift+A",
      clickThrough: "Ctrl+Shift+M"
    }
  };
}
