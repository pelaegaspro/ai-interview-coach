export const AUDIO_CHUNK_MS = 4000;
export const DEFAULT_MODE = "behavioral";
export const MAX_TRANSCRIPTION_QUEUE_DEPTH = 6;
export const RECENT_DUPLICATE_WINDOW_MS = 1500;

export function getSupportedRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ];

  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || "";
}
