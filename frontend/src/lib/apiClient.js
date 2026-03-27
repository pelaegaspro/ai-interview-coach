let cachedConfigPromise;

function getFallbackConfig() {
  return {
    backendUrl: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8787",
    overlayRange: {
      min: 0.6,
      max: 0.95
    },
    shortcuts: {
      visibility: "Ctrl+Shift+A",
      clickThrough: "Ctrl+Shift+M"
    }
  };
}

export async function getAppConfig() {
  if (!cachedConfigPromise) {
    cachedConfigPromise = window.overlayApi?.getConfig
      ? window.overlayApi.getConfig().catch(() => getFallbackConfig())
      : Promise.resolve(getFallbackConfig());
  }

  return cachedConfigPromise;
}

async function request(path, options = {}) {
  const { backendUrl } = await getAppConfig();
  const response = await fetch(`${backendUrl}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function uploadAudioChunk(blob) {
  const formData = new FormData();
  formData.append("audio", blob, `audio-${Date.now()}.webm`);

  return request("/transcribe", {
    method: "POST",
    body: formData
  });
}

export async function askCoach(payload, signal) {
  return request("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });
}

export async function uploadResumePdf(file) {
  const formData = new FormData();
  formData.append("resume", file, file.name);

  return request("/resume/upload", {
    method: "POST",
    body: formData
  });
}
