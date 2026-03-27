const path = require("node:path");
const dotenv = require("dotenv");
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  session
} = require("electron");
const { startServer, stopServer } = require("../backend/server");
const {
  DEFAULT_BACKEND_PORT,
  DEFAULT_OVERLAY_OPACITY,
  MIN_OVERLAY_OPACITY,
  MAX_OVERLAY_OPACITY,
  OVERLAY_SHORTCUT_ACCELERATOR,
  CLICK_THROUGH_SHORTCUT_ACCELERATOR,
  OVERLAY_SHORTCUT_LABEL,
  CLICK_THROUGH_SHORTCUT_LABEL
} = require("../utils/constants");

dotenv.config();

let mainWindow = null;
let backendInstance = null;

const overlayState = {
  opacity: DEFAULT_OVERLAY_OPACITY,
  clickThrough: false,
  visible: true
};

function getFrontendEntry() {
  if (process.env.VITE_DEV_SERVER_URL) {
    return process.env.VITE_DEV_SERVER_URL;
  }

  return path.join(__dirname, "..", "dist", "index.html");
}

function broadcastOverlayState() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("overlay:state-changed", {
      ...overlayState
    });
  }
}

function applyClickThrough(enabled) {
  overlayState.clickThrough = Boolean(enabled);

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setIgnoreMouseEvents(overlayState.clickThrough, {
      forward: overlayState.clickThrough
    });
  }

  broadcastOverlayState();
  return { ...overlayState };
}

function applyOpacity(opacity) {
  const clampedOpacity = Math.max(
    MIN_OVERLAY_OPACITY,
    Math.min(MAX_OVERLAY_OPACITY, Number(opacity) || DEFAULT_OVERLAY_OPACITY)
  );
  overlayState.opacity = clampedOpacity;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setOpacity(clampedOpacity);
  }

  broadcastOverlayState();
  return { ...overlayState };
}

function setWindowVisibility(visible) {
  overlayState.visible = Boolean(visible);

  if (!mainWindow || mainWindow.isDestroyed()) {
    return { ...overlayState };
  }

  if (overlayState.visible) {
    mainWindow.show();
    mainWindow.focus();
  } else {
    mainWindow.hide();
  }

  broadcastOverlayState();
  return { ...overlayState };
}

function registerGlobalShortcuts() {
  globalShortcut.register(OVERLAY_SHORTCUT_ACCELERATOR, () => {
    setWindowVisibility(!overlayState.visible);
  });

  globalShortcut.register(CLICK_THROUGH_SHORTCUT_ACCELERATOR, () => {
    applyClickThrough(!overlayState.clickThrough);
  });
}

function registerIpcHandlers() {
  ipcMain.handle("app:get-config", () => ({
    backendUrl: `http://127.0.0.1:${DEFAULT_BACKEND_PORT}`,
    overlayRange: {
      min: MIN_OVERLAY_OPACITY,
      max: MAX_OVERLAY_OPACITY
    },
    shortcuts: {
      visibility: OVERLAY_SHORTCUT_LABEL,
      clickThrough: CLICK_THROUGH_SHORTCUT_LABEL
    }
  }));

  ipcMain.handle("overlay:get-state", () => ({ ...overlayState }));
  ipcMain.handle("overlay:set-opacity", (_, opacity) => applyOpacity(opacity));
  ipcMain.handle("overlay:set-click-through", (_, enabled) => applyClickThrough(enabled));
  ipcMain.handle("overlay:toggle-visibility", () => setWindowVisibility(!overlayState.visible));
  ipcMain.handle("overlay:window-action", (_, action) => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return false;
    }

    if (action === "minimize") {
      mainWindow.minimize();
      return true;
    }

    if (action === "close") {
      app.quit();
      return true;
    }

    return false;
  });
}

function configurePermissions() {
  const currentSession = session.defaultSession;

  currentSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === "media" || permission === "microphone";
  });

  currentSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === "media" || permission === "microphone");
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 820,
    minWidth: 420,
    minHeight: 680,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    resizable: true,
    hasShadow: true,
    autoHideMenuBar: true,
    title: "AI Coach",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setOpacity(overlayState.opacity);
  mainWindow.setContentProtection(true);
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  const frontendEntry = getFrontendEntry();
  if (frontendEntry.startsWith("http")) {
    mainWindow.loadURL(frontendEntry);
  } else {
    mainWindow.loadFile(frontendEntry);
  }

  mainWindow.on("show", () => {
    overlayState.visible = true;
    broadcastOverlayState();
  });

  mainWindow.on("hide", () => {
    overlayState.visible = false;
    broadcastOverlayState();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function bootstrap() {
  app.setAppUserModelId("AI Interview Coach");
  backendInstance = await startServer(DEFAULT_BACKEND_PORT);
  configurePermissions();
  registerIpcHandlers();
  registerGlobalShortcuts();
  createWindow();
}

app.whenReady().then(bootstrap).catch((error) => {
  console.error("Failed to start AI Interview Coach:", error);
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (mainWindow) {
    setWindowVisibility(true);
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("before-quit", () => {
  stopServer(backendInstance).catch((error) => {
    console.error("Failed to stop backend server cleanly:", error);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
