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

export async function uploadAudioChunk(blob, language) {
  const formData = new FormData();
  formData.append("audio", blob, `audio-${Date.now()}.webm`);
  if (language && language !== "auto") {
    formData.append("language", language);
  }

  return request("/transcribe", {
    method: "POST",
    body: formData
  });
}

export async function improveAnswer(payload) {
  return request("/improve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

export async function streamAsk(payload, signal, onChunk) {
  const { backendUrl } = await getAppConfig();
  const response = await fetch(`${backendUrl}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to stream coaching.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        if (!dataStr) continue;
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.done) return parsed.final;
          if (parsed.delta) onChunk(parsed.delta);
        } catch (e) {
          // ignore parsing error for chunk
        }
      }
    }
  }
}

export async function uploadResumePdf(file) {
  const formData = new FormData();
  formData.append("resume", file, file.name);

  return request("/resume/upload", {
    method: "POST",
    body: formData
  });
}
