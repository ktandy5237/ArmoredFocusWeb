// src/hooks/useBonusProgress.ts
import { useState, useCallback, useEffect } from 'react';
import { generateId } from '@/src/lib/utils';
import type { Rules, LogEntry } from '@/src/lib/types';

interface BonusProgress {
  [bonusId: string]: {
    current: number;          // current streak/count
    target: number;           // required to complete
    lastCompleted?: string;   // ISO date of last completion
    lastAttempt?: string;     // ISO date of last day attempted
  };
}

interface UseBonusProgressProps {
  rules: Rules;
  dailyLog: LogEntry[];
  setDailyLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  setUserStats: React.Dispatch<React.SetStateAction<{ exp: number; level: number; name: string }>>;
}

export function useBonusProgress({
  rules,
  dailyLog,
  setDailyLog,
  setUserStats,
}: UseBonusProgressProps) {
  const [progress, setProgress] = useState<BonusProgress>(() => {
    // Initialize from rules.bonuses
    const initial: BonusProgress = {};
    rules.bonuses.forEach(bonus => {
      if (bonus.id && bonus.target) {
        initial[bonus.id] = {
          current: 0,
          target: bonus.target,
        };
      }
    });
    return initial;
  });

  // ────────────────────────────────────────────────
  //  Check today's log for relevant bonus actions
  // ────────────────────────────────────────────────
  const checkDailyBonusActions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];

    // Example: look for "Plan Day" action in today's log
    const todayLogs = dailyLog.filter(log => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === today;
    });

    setProgress(prev => {
      const updated = { ...prev };

      rules.bonuses.forEach(bonus => {
        if (!bonus.id || !bonus.target) return;

        let shouldIncrement = false;

        // Custom logic per bonus (expand as you add more)
        if (bonus.name.includes('Plan Day')) {
          // Check if user logged a "Plan Day" quest today
          shouldIncrement = todayLogs.some(log =>
            log.questType.toLowerCase().includes('plan day')
          );
        }
        // Add more bonus conditions here (e.g. commission thresholds, meetings, etc.)

        if (shouldIncrement) {
          const currentEntry = updated[bonus.id] || { current: 0, target: bonus.target };
          const lastAttempt = currentEntry.lastAttempt;

          // If last attempt was yesterday → continue streak
          // If skipped a day → reset to 1
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newCurrent = currentEntry.current;

          if (!lastAttempt || lastAttempt === yesterdayStr) {
            newCurrent += 1;
          } else if (lastAttempt < yesterdayStr) {
            // Missed a day → reset streak
            newCurrent = 1;
          }

          updated[bonus.id] = {
            current: newCurrent,
            target: currentEntry.target,
            lastAttempt: today,
            lastCompleted:
              newCurrent >= currentEntry.target
                ? today
                : currentEntry.lastCompleted,
          };

          // Award bonus XP if completed
          if (newCurrent >= currentEntry.target && currentEntry.current < currentEntry.target) {
            const bonusExp = bonus.reward && typeof bonus.reward === 'number'
              ? bonus.reward
              : 100; // fallback

            setUserStats(prev => ({
              ...prev,
              exp: prev.exp + bonusExp,
            }));

            // Log the bonus award
            setDailyLog(prev => [
              {
                id: generateId(),
                clientName: 'System',
                questType: `Bonus Completed: ${bonus.name}`,
                exp: bonusExp,
                date: new Date().toISOString(),
                note: `Reached ${newCurrent}/${currentEntry.target}`,
              },
              ...prev,
            ]);

            // Reset streak after award (or keep rolling — your choice)
            updated[bonus.id].current = 0;
          }
        }
      });

      return updated;
    });
  }, [dailyLog, rules.bonuses, setDailyLog, setUserStats]);

  // Run check on mount + when dailyLog changes
  useEffect(() => {
    checkDailyBonusActions();
  }, [dailyLog, checkDailyBonusActions]);

  // ────────────────────────────────────────────────
  //  Manual trigger (e.g. after certain actions)
  // ────────────────────────────────────────────────
  const refreshBonusProgress = useCallback(() => {
    checkDailyBonusActions();
  }, [checkDailyBonusActions]);

  // ────────────────────────────────────────────────
  //  Get progress for a specific bonus
  // ────────────────────────────────────────────────
  const getBonusProgress = useCallback((bonusId: string) => {
    return progress[bonusId] || { current: 0, target: 1 };
  }, [progress]);

  // ────────────────────────────────────────────────
  //  Public API
  // ────────────────────────────────────────────────
  return {
    progress,
    getBonusProgress,
    refreshBonusProgress,
  };
}