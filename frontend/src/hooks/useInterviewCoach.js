import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { askCoach, uploadAudioChunk, uploadResumePdf } from "../lib/apiClient";
import {
  AUDIO_CHUNK_MS,
  DEFAULT_MODE,
  MAX_TRANSCRIPTION_QUEUE_DEPTH,
  RECENT_DUPLICATE_WINDOW_MS,
  getSupportedRecorderMimeType
} from "../lib/media";

export function useInterviewCoach() {
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [coaching, setCoaching] = useState(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [resumeStatus, setResumeStatus] = useState({
    message: "No resume uploaded yet. Upload a PDF to personalize every answer."
  });

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const transcriptionQueueRef = useRef([]);
  const isProcessingQueueRef = useRef(false);
  const askTimeoutRef = useRef(null);
  const askAbortRef = useRef(null);
  const sessionVersionRef = useRef(0);

  const transcriptText = useMemo(
    () => transcriptSegments.map((segment) => segment.text).join(" "),
    [transcriptSegments]
  );

  const liveContext = useMemo(() => {
    const windowedTranscript = transcriptSegments
      .slice(-6)
      .map((segment) => segment.text)
      .join(" ")
      .trim();

    return windowedTranscript.slice(-1400);
  }, [transcriptSegments]);

  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const processTranscriptionQueue = useCallback(async () => {
    if (isProcessingQueueRef.current) {
      return;
    }

    isProcessingQueueRef.current = true;
    setIsTranscribing(true);

    while (transcriptionQueueRef.current.length > 0) {
      const nextChunk = transcriptionQueueRef.current.shift();

      if (!nextChunk || nextChunk.sessionVersion !== sessionVersionRef.current) {
        continue;
      }

      try {
        const response = await uploadAudioChunk(nextChunk.blob);
        const cleanedText = String(response.text || "").trim();

        if (cleanedText && nextChunk.sessionVersion === sessionVersionRef.current) {
          setTranscriptSegments((current) => {
            const previous = current[current.length - 1];
            const isRecentDuplicate =
              previous &&
              previous.text.toLowerCase() === cleanedText.toLowerCase() &&
              Date.now() - previous.createdAt < RECENT_DUPLICATE_WINDOW_MS;

            if (isRecentDuplicate) {
              return current;
            }

            return [
              ...current,
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                text: cleanedText,
                createdAt: Date.now()
              }
            ].slice(-40);
          });
        }
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    isProcessingQueueRef.current = false;
    setIsTranscribing(false);
  }, []);

  const enqueueAudioChunk = useCallback(
    (blob) => {
      if (!blob || blob.size === 0) {
        return;
      }

      transcriptionQueueRef.current.push({
        blob,
        sessionVersion: sessionVersionRef.current
      });

      while (transcriptionQueueRef.current.length > MAX_TRANSCRIPTION_QUEUE_DEPTH) {
        transcriptionQueueRef.current.shift();
      }

      processTranscriptionQueue();
    },
    [processTranscriptionQueue]
  );

  const startListening = useCallback(async () => {
    try {
      setError("");

      if (typeof MediaRecorder === "undefined") {
        throw new Error("MediaRecorder is not available in this Electron runtime.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      });

      streamRef.current = stream;
      const mimeType = getSupportedRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
            audioBitsPerSecond: 128000
          })
        : new MediaRecorder(stream);

      recorder.addEventListener("dataavailable", (event) => {
        enqueueAudioChunk(event.data);
      });

      recorder.addEventListener("stop", () => {
        stopTracks();
        setIsListening(false);
      });

      recorder.addEventListener("error", (event) => {
        setError(event.error?.message || "Microphone capture failed.");
      });

      mediaRecorderRef.current = recorder;
      recorder.start(AUDIO_CHUNK_MS);
      setPermissionStatus("granted");
      setIsListening(true);
    } catch (captureError) {
      setPermissionStatus("denied");
      setError(captureError.message || "Unable to access the microphone.");
      stopTracks();
      setIsListening(false);
    }
  }, [enqueueAudioChunk, stopTracks]);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopTracks();
    }

    mediaRecorderRef.current = null;
    setIsListening(false);
  }, [stopTracks]);

  const clearSession = useCallback(() => {
    sessionVersionRef.current += 1;
    transcriptionQueueRef.current = [];
    window.clearTimeout(askTimeoutRef.current);
    setTranscriptSegments([]);
    setCoaching(null);
    setError("");
    setIsGenerating(false);
    setIsTranscribing(false);

    if (askAbortRef.current) {
      askAbortRef.current.abort();
      askAbortRef.current = null;
    }
  }, []);

  const uploadResume = useCallback(async (file) => {
    try {
      setError("");
      setIsUploadingResume(true);
      const response = await uploadResumePdf(file);
      setResumeStatus({
        message: `${response.metadata.filename} uploaded. ${response.characters} characters added to prompt memory.`
      });
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploadingResume(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.permissions?.query) {
      return undefined;
    }

    let permissionHandle;

    navigator.permissions
      .query({ name: "microphone" })
      .then((status) => {
        permissionHandle = status;
        setPermissionStatus(status.state);
        status.onchange = () => setPermissionStatus(status.state);
      })
      .catch(() => {
        setPermissionStatus("unknown");
      });

    return () => {
      if (permissionHandle) {
        permissionHandle.onchange = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!liveContext || liveContext.length < 12) {
      return undefined;
    }

    if (askAbortRef.current) {
      askAbortRef.current.abort();
      askAbortRef.current = null;
    }

    window.clearTimeout(askTimeoutRef.current);

    askTimeoutRef.current = window.setTimeout(async () => {
      const controller = new AbortController();
      askAbortRef.current = controller;
      setIsGenerating(true);

      try {
        const response = await askCoach(
          {
            transcript: liveContext,
            mode
          },
          controller.signal
        );
        setCoaching(response);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (askAbortRef.current === controller) {
          askAbortRef.current = null;
        }

        setIsGenerating(false);
      }
    }, 700);

    return () => {
      window.clearTimeout(askTimeoutRef.current);
    };
  }, [liveContext, mode]);

  useEffect(() => {
    return () => {
      window.clearTimeout(askTimeoutRef.current);

      if (askAbortRef.current) {
        askAbortRef.current.abort();
      }

      stopListening();
      stopTracks();
    };
  }, [stopListening, stopTracks]);

  return {
    mode,
    setMode,
    transcriptSegments,
    transcriptText,
    coaching,
    error,
    isListening,
    isTranscribing,
    isGenerating,
    isUploadingResume,
    permissionStatus,
    resumeStatus,
    startListening,
    stopListening,
    clearSession,
    uploadResume
  };
}
