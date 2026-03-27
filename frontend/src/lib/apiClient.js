import { getFallbackAppConfig } from "./appConfig";

let cachedConfigPromise;

function normaliseError(err) {
  if (!err) {
    return "Something went wrong.";
  }

  const name = String(err.name || "");
  const msg = String(err.message || err);
  const full = `${name} ${msg}`;

  if (
    full.includes("Failed to fetch") ||
    full.includes("NetworkError") ||
    full.includes("Load failed")
  ) {
    return "Cannot reach the server. Check your internet connection.";
  }

  if (
    full.includes("timeout") ||
    full.includes("TimeoutError") ||
    full.includes("signal timed out")
  ) {
    return "The request timed out. The server may be busy - please try again.";
  }

  if (full.includes("401") || full.toLowerCase().includes("invalid api key")) {
    return "Invalid API key. Check your .env file.";
  }

  if (full.includes("429") || full.toLowerCase().includes("rate limit")) {
    return "Rate limit reached. Please wait a moment before trying again.";
  }

  if (full.includes("AbortError") || name === "AbortError") {
    return "";
  }

  return msg;
}

export async function getAppConfig() {
  if (!cachedConfigPromise) {
    cachedConfigPromise = window.overlayApi?.getConfig
      ? window.overlayApi.getConfig().catch(() => getFallbackAppConfig())
      : Promise.resolve(getFallbackAppConfig());
  }

  return cachedConfigPromise;
}

async function request(path, options = {}) {
  const { backendUrl } = await getAppConfig();
  const timeout = AbortSignal.timeout(15000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

  try {
    const response = await fetch(`${backendUrl}${path}`, { ...options, signal });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const rawError = Object.assign(
        new Error(`${response.status} ${data.message || "Request failed."}`.trim()),
        { status: response.status }
      );

      throw Object.assign(new Error(normaliseError(rawError)), {
        name: rawError.name,
        status: rawError.status
      });
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw err;
    }

    throw new Error(normaliseError(err));
  }
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
