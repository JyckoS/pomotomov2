import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { pomodoroSettings, pomodoroTimerType } from "@/db/schema";

const DEFAULT_TIMER_TYPES = [
  { name: "Default", focusDurationMinutes: 25, breakDurationMinutes: 5 },
  { name: "Long Focus", focusDurationMinutes: 45, breakDurationMinutes: 15 },
  { name: "Deep Work", focusDurationMinutes: 50, breakDurationMinutes: 10 },
  { name: "Deep Productivity", focusDurationMinutes: 52, breakDurationMinutes: 17 },
  { name: "Ultra Focus", focusDurationMinutes: 90, breakDurationMinutes: 20 },
] as const;

const timerTypeSelection = {
  id: pomodoroTimerType.id,
  name: pomodoroTimerType.name,
  focusDurationMinutes: pomodoroTimerType.focusDurationMinutes,
  breakDurationMinutes: pomodoroTimerType.breakDurationMinutes,
  isPreset: pomodoroTimerType.isPreset,
};

const settingsSelection = {
  autoStartBreak: pomodoroSettings.autoStartBreak,
  autoStartPomodoros: pomodoroSettings.autoStartPomodoros,
  selectedTimerTypeId: pomodoroSettings.selectedTimerTypeId,
};

export async function ensurePomodoroConfig(userId: string) {
  let timerTypes = await db
    .select(timerTypeSelection)
    .from(pomodoroTimerType)
    .where(eq(pomodoroTimerType.userId, userId))
    .orderBy(asc(pomodoroTimerType.createdAt), asc(pomodoroTimerType.id));

  if (timerTypes.length === 0) {
    timerTypes = await db
      .insert(pomodoroTimerType)
      .values(
        DEFAULT_TIMER_TYPES.map((timerType) => ({
          userId,
          name: timerType.name,
          focusDurationMinutes: timerType.focusDurationMinutes,
          breakDurationMinutes: timerType.breakDurationMinutes,
          isPreset: true,
        })),
      )
      .returning(timerTypeSelection);
  }

  const existingSettings = await db
    .select(settingsSelection)
    .from(pomodoroSettings)
    .where(eq(pomodoroSettings.userId, userId))
    .limit(1);

  if (existingSettings.length > 0) {
    return {
      timerTypes,
      settings: existingSettings[0],
    };
  }

  const [createdSettings] = await db
    .insert(pomodoroSettings)
    .values({
      userId,
      autoStartBreak: true,
      autoStartPomodoros: false,
      selectedTimerTypeId: timerTypes[0]?.id ?? null,
    })
    .returning(settingsSelection);

  return {
    timerTypes,
    settings: createdSettings,
  };
}

export async function createPomodoroTimerType({
  userId,
  name,
  focusDurationMinutes,
  breakDurationMinutes,
}: {
  userId: string;
  name: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
}) {
  const [createdTimerType] = await db
    .insert(pomodoroTimerType)
    .values({
      userId,
      name,
      focusDurationMinutes,
      breakDurationMinutes,
      isPreset: false,
    })
    .returning(timerTypeSelection);

  return createdTimerType;
}

export async function getPomodoroTimerTypeById({
  userId,
  timerTypeId,
}: {
  userId: string;
  timerTypeId: number;
}) {
  const result = await db
    .select(timerTypeSelection)
    .from(pomodoroTimerType)
    .where(and(eq(pomodoroTimerType.userId, userId), eq(pomodoroTimerType.id, timerTypeId)))
    .limit(1);

  return result[0] ?? null;
}

export async function updatePomodoroSettings({
  userId,
  autoStartBreak,
  autoStartPomodoros,
  selectedTimerTypeId,
}: {
  userId: string;
  autoStartBreak?: boolean;
  autoStartPomodoros?: boolean;
  selectedTimerTypeId?: number | null;
}) {
  const currentConfig = await ensurePomodoroConfig(userId);
  const currentSettings = currentConfig.settings;

  const [updatedSettings] = await db
    .update(pomodoroSettings)
    .set({
      autoStartBreak: autoStartBreak ?? currentSettings.autoStartBreak,
      autoStartPomodoros: autoStartPomodoros ?? currentSettings.autoStartPomodoros,
      selectedTimerTypeId:
        selectedTimerTypeId === undefined ? currentSettings.selectedTimerTypeId : selectedTimerTypeId,
      updatedAt: new Date(),
    })
    .where(eq(pomodoroSettings.userId, userId))
    .returning(settingsSelection);

  return updatedSettings;
}
