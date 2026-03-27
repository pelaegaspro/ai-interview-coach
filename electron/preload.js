const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("overlayApi", {
  getConfig: () => ipcRenderer.invoke("app:get-config"),
  getState: () => ipcRenderer.invoke("overlay:get-state"),
  setOpacity: (opacity) => ipcRenderer.invoke("overlay:set-opacity", opacity),
  setClickThrough: (enabled) => ipcRenderer.invoke("overlay:set-click-through", enabled),
  toggleVisibility: () => ipcRenderer.invoke("overlay:toggle-visibility"),
  windowAction: (action) => ipcRenderer.invoke("overlay:window-action", action),
  subscribe: (listener) => {
    const wrappedListener = (_event, payload) => listener(payload);
    ipcRenderer.on("overlay:state-changed", wrappedListener);

    return () => {
      ipcRenderer.removeListener("overlay:state-changed", wrappedListener);
    };
  }
});
