"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getPhaseDurationSeconds, playDing } from "@/lib/pomodoro/utils";
import type { Phase, PomodoroSettings, TimerType } from "@/types/pomodoro";

const POMODORO_STORAGE_KEY = "pomotomo:pomodoro:state:v1";

type PersistedPomodoroState = {
  timerTypes: TimerType[];
  settings: PomodoroSettings;
  selectedTimerTypeId: string | null;
  phase: Phase;
  isRunning: boolean;
  remainingSeconds: number;
  runEndsAtMs: number | null;
  runSegmentStartRemainingSeconds: number | null;
};

type PomodoroContextValue = {
  timerTypes: TimerType[];
  settings: PomodoroSettings;
  phase: Phase;
  isRunning: boolean;
  selectedTimerType: TimerType | null;
  selectedTimerTypeId: string | null;
  timeLeftSeconds: number;
  progress: number;
  settingsError: string | null;
  toggleRunning: () => void;
  skipPhase: () => void;
  selectTimerType: (timerTypeId: string) => void;
  updateSettings: (patch: Partial<PomodoroSettings>) => Promise<void>;
  onTimerTypeCreated: (timerType: TimerType) => void;
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function readPersistedPomodoroState(): PersistedPomodoroState | null {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(POMODORO_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as PersistedPomodoroState;
    if (!Array.isArray(parsed.timerTypes) || !parsed.settings) {
      return null;
    }
    if (parsed.selectedTimerTypeId !== null && typeof parsed.selectedTimerTypeId !== "string") {
      return null;
    }
    if (
      parsed.runSegmentStartRemainingSeconds !== undefined &&
      parsed.runSegmentStartRemainingSeconds !== null &&
      typeof parsed.runSegmentStartRemainingSeconds !== "number"
    ) {
      return null;
    }
    if (!parsed.timerTypes.every((timerType) => typeof timerType.id === "string")) {
      return null;
    }

    if (parsed.phase !== "focus" && parsed.phase !== "break") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function PomodoroProvider({
  initialTimerTypes,
  initialSettings,
  children,
}: {
  initialTimerTypes: TimerType[];
  initialSettings: PomodoroSettings;
  children: ReactNode;
}) {
  const initialSelectedTimerTypeId =
    initialSettings.selectedTimerTypeId &&
    initialTimerTypes.some((timerType) => timerType.id === initialSettings.selectedTimerTypeId)
      ? initialSettings.selectedTimerTypeId
      : initialTimerTypes[0]?.id ?? null;

  const fallbackFocusDuration = getPhaseDurationSeconds(
    initialTimerTypes.find((timerType) => timerType.id === initialSelectedTimerTypeId) ?? initialTimerTypes[0] ?? null,
    "focus",
  );

  const [timerTypes, setTimerTypes] = useState<TimerType[]>(initialTimerTypes);
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  const [phase, setPhase] = useState<Phase>("focus");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTimerTypeId, setSelectedTimerTypeId] = useState<string | null>(initialSelectedTimerTypeId);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(fallbackFocusDuration);
  const [runEndsAtMs, setRunEndsAtMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [hasHydratedPersistedState, setHasHydratedPersistedState] = useState(false);

  const selectedTimerType = useMemo(() => {
    if (selectedTimerTypeId === null) {
      return timerTypes[0] ?? null;
    }

    return timerTypes.find((timerType) => timerType.id === selectedTimerTypeId) ?? timerTypes[0] ?? null;
  }, [selectedTimerTypeId, timerTypes]);

  const currentPhaseTotalSeconds = useMemo(
    () => getPhaseDurationSeconds(selectedTimerType, phase),
    [selectedTimerType, phase],
  );

  const timeLeftSeconds = useMemo(() => {
    if (isRunning && runEndsAtMs !== null) {
      return Math.max(0, Math.ceil((runEndsAtMs - nowMs) / 1000));
    }
    return Math.max(0, remainingSeconds);
  }, [isRunning, runEndsAtMs, nowMs, remainingSeconds]);

  const progress =
    currentPhaseTotalSeconds === 0
      ? 0
      : (currentPhaseTotalSeconds - timeLeftSeconds) / currentPhaseTotalSeconds;

  const phaseRef = useRef(phase);
  const selectedTimerTypeRef = useRef<TimerType | null>(selectedTimerType);
  const settingsRef = useRef(settings);
  const runSegmentStartRemainingSecondsRef = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    selectedTimerTypeRef.current = selectedTimerType;
  }, [selectedTimerType]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const recordPomodoroSeconds = async (seconds: number) => {
    if (seconds <= 0) {
      return;
    }

    const response = await fetch("/api/pomodoro/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seconds }),
    }).catch(() => null);

    if (!response || !response.ok) {
      return;
    }
  };

  const recordFocusSegment = async (currentTimeLeftSeconds: number) => {
    if (phaseRef.current !== "focus") {
      return;
    }

    const runSegmentStartRemainingSeconds = runSegmentStartRemainingSecondsRef.current;
    if (runSegmentStartRemainingSeconds === null) {
      return;
    }

    runSegmentStartRemainingSecondsRef.current = null;

    const elapsedSeconds = Math.max(0, runSegmentStartRemainingSeconds - currentTimeLeftSeconds);
    await recordPomodoroSeconds(elapsedSeconds);
  };

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      setNowMs(now);

      setRunEndsAtMs((currentRunEndsAtMs) => {
        if (currentRunEndsAtMs === null || now < currentRunEndsAtMs) {
          return currentRunEndsAtMs;
        }

        const activeTimerType = selectedTimerTypeRef.current;
        if (!activeTimerType) {
          setIsRunning(false);
          return null;
        }

        const currentPhase = phaseRef.current;
        const nextPhase: Phase = currentPhase === "focus" ? "break" : "focus";
        const nextPhaseDuration = getPhaseDurationSeconds(activeTimerType, nextPhase);
        const shouldAutoContinue =
          currentPhase === "focus"
            ? settingsRef.current.autoStartBreak
            : settingsRef.current.autoStartPomodoros;

        if (currentPhase === "focus") {
          void recordFocusSegment(0);
        }

        void playDing().catch(() => null);
        setPhase(nextPhase);
        setRemainingSeconds(nextPhaseDuration);
        runSegmentStartRemainingSecondsRef.current = shouldAutoContinue ? nextPhaseDuration : null;

        if (!shouldAutoContinue) {
          setIsRunning(false);
          return null;
        }

        return now + nextPhaseDuration * 1000;
      });
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    const persistedState = readPersistedPomodoroState();
    const timeoutId = window.setTimeout(() => {
      if (persistedState) {
        setTimerTypes(persistedState.timerTypes);
        setSettings(persistedState.settings);
        setPhase(persistedState.phase);
        setIsRunning(persistedState.isRunning);
        setSelectedTimerTypeId(persistedState.selectedTimerTypeId);
        setRemainingSeconds(persistedState.remainingSeconds);
        setRunEndsAtMs(persistedState.runEndsAtMs);
        runSegmentStartRemainingSecondsRef.current =
          persistedState.runSegmentStartRemainingSeconds ??
          (persistedState.isRunning ? persistedState.remainingSeconds : null);
        setNowMs(Date.now());
      }

      setHasHydratedPersistedState(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const phaseLabel = phase === "focus" ? "Focus" : "Break";
    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    document.title = `${phaseLabel} ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} • PomoTomo v2`;
  }, [phase, timeLeftSeconds]);

  useEffect(
    () => () => {
      document.title = "PomoTomo v2";
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasHydratedPersistedState) return;

    const valueToPersist: PersistedPomodoroState = {
      timerTypes,
      settings,
      selectedTimerTypeId: selectedTimerType?.id ?? null,
      phase,
      isRunning,
      remainingSeconds: timeLeftSeconds,
      runEndsAtMs: isRunning ? runEndsAtMs : null,
      runSegmentStartRemainingSeconds: runSegmentStartRemainingSecondsRef.current,
    };

    window.localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(valueToPersist));
  }, [hasHydratedPersistedState, isRunning, phase, runEndsAtMs, selectedTimerType, settings, timeLeftSeconds, timerTypes]);

  const updateSettings = async (patch: Partial<PomodoroSettings>) => {
    const previousSettings = settings;
    setSettingsError(null);
    setSettings((currentSettings) => ({ ...currentSettings, ...patch }));

    const response = await fetch("/api/pomodoro/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    }).catch(() => null);

    if (!response || !response.ok) {
      setSettings(previousSettings);
      setSettingsError("Unable to save settings right now.");
      return;
    }

    const payload: { settings: PomodoroSettings } = await response.json();
    setSettings(payload.settings);
  };

  const selectTimerType = (timerTypeId: string) => {
    const timerType = timerTypes.find((candidate) => candidate.id === timerTypeId);
    if (!timerType) return;

    setSelectedTimerTypeId(timerTypeId);
    setPhase("focus");
    setRemainingSeconds(getPhaseDurationSeconds(timerType, "focus"));
    setRunEndsAtMs(null);
    runSegmentStartRemainingSecondsRef.current = null;
    setNowMs(Date.now());
    setIsRunning(false);
    void updateSettings({ selectedTimerTypeId: timerTypeId });
  };

  const toggleRunning = () => {
    if (!selectedTimerType) return;

    if (isRunning) {
      void recordFocusSegment(timeLeftSeconds);
      setRemainingSeconds(timeLeftSeconds);
      setRunEndsAtMs(null);
      setIsRunning(false);
      return;
    }

    const nextTimeLeft = timeLeftSeconds > 0 ? timeLeftSeconds : currentPhaseTotalSeconds;
    runSegmentStartRemainingSecondsRef.current = nextTimeLeft;
    setRemainingSeconds(nextTimeLeft);
    setRunEndsAtMs(Date.now() + nextTimeLeft * 1000);
    setNowMs(Date.now());
    setIsRunning(true);
  };

  const skipPhase = () => {
    if (!selectedTimerType) return;

    const nextPhase: Phase = phase === "focus" ? "break" : "focus";
    const nextPhaseDuration = getPhaseDurationSeconds(selectedTimerType, nextPhase);

    if (phase === "focus" && isRunning) {
      void recordFocusSegment(timeLeftSeconds);
    }

    setPhase(nextPhase);
    setRemainingSeconds(nextPhaseDuration);
    setNowMs(Date.now());

    if (isRunning) {
      runSegmentStartRemainingSecondsRef.current = nextPhaseDuration;
      setRunEndsAtMs(Date.now() + nextPhaseDuration * 1000);
      return;
    }

    runSegmentStartRemainingSecondsRef.current = null;
    setRunEndsAtMs(null);
  };

  const onTimerTypeCreated = (timerType: TimerType) => {
    setTimerTypes((current) => [...current, timerType]);
    setSelectedTimerTypeId(timerType.id);
    setPhase("focus");
    setRemainingSeconds(getPhaseDurationSeconds(timerType, "focus"));
    setRunEndsAtMs(null);
    runSegmentStartRemainingSecondsRef.current = null;
    setNowMs(Date.now());
    setIsRunning(false);
    void updateSettings({ selectedTimerTypeId: timerType.id });
  };

  const value: PomodoroContextValue = {
    timerTypes,
    settings,
    phase,
    isRunning,
    selectedTimerType,
    selectedTimerTypeId: selectedTimerType?.id ?? null,
    timeLeftSeconds,
    progress,
    settingsError,
    toggleRunning,
    skipPhase,
    selectTimerType,
    updateSettings,
    onTimerTypeCreated,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider.");
  }

  return context;
}
