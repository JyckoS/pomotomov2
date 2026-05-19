import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { user, pomodoroTimerType } from '@/db/schema';
import { getDictionary } from '@/lib/preferences/i18n';

async function main() {
  console.log('Starting migration: localize pomodoro preset names');

  const users = await db.select({ id: user.id, languageMode: user.languageMode }).from(user);

  const durationKeyMap: Record<string, string> = {
    '25:5': 'default',
    '45:15': 'longFocus',
    '50:10': 'deepWork',
    '52:17': 'deepProductivity',
    '90:20': 'ultraFocus',
  };

  let updatedCount = 0;

  for (const u of users) {
    try {
      const lang = (u.languageMode === 'auto' ? 'en' : (u.languageMode as any)) as any;
      const dict = getDictionary(lang);

      for (const durKey of Object.keys(durationKeyMap)) {
        const [focus, brk] = durKey.split(':').map((v) => Number(v));
        const key = durationKeyMap[durKey];
        const newName = dict.pomodoroSection?.timerTypeNames?.[key];
        if (!newName) continue;

        const res = await db
          .update(pomodoroTimerType)
          .set({ name: newName, updatedAt: new Date() })
          .where(
            and(
              eq(pomodoroTimerType.userId, u.id),
              eq(pomodoroTimerType.focusDurationMinutes, focus),
              eq(pomodoroTimerType.breakDurationMinutes, brk),
              eq(pomodoroTimerType.isPreset, true),
            ),
          );

        // drizzle returns number of affected rows in some drivers; we can't rely on it universally, so increment conservatively
        updatedCount += 1;
      }
    } catch (err) {
      console.error('Failed for user', u.id, err);
    }
  }

  console.log('Migration complete. Approx updates attempted:', updatedCount);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
