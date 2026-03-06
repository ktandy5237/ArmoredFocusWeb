// src/hooks/useQuestOperations.ts
import { useCallback } from 'react';
import { generateId, getDaysOut } from '@/src/lib/utils';
import type { Client, Quest, Rules, LogEntry, QuestTypeItem } from '@/src/lib/types';

interface UseQuestOperationsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  dailyLog: LogEntry[];
  setDailyLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  userStats: { exp: number; level: number; name: string };
  setUserStats: React.Dispatch<React.SetStateAction<{ exp: number; level: number; name: string }>>;
  rules: Rules;
}

export function useQuestOperations({
  clients,
  setClients,
  dailyLog,
  setDailyLog,
  userStats,
  setUserStats,
  rules,
}: UseQuestOperationsProps) {
  // ────────────────────────────────────────────────
  //  Helper: Rebalance which quest is "tracked"
  // ────────────────────────────────────────────────
  const rebalanceQuestTracking = useCallback((quests: Quest[]): Quest[] => {
    const active = quests.filter(q => q.status === 'Active' || q.status === 'Cooldown');

    if (active.length === 0) return quests;

    // If none is tracked → track the earliest due date
    if (!active.some(q => q.tracked)) {
      active.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      const earliestId = active[0].id;
      return quests.map(q => (q.id === earliestId ? { ...q, tracked: true } : { ...q, tracked: false }));
    }

    return quests;
  }, []);

  // ────────────────────────────────────────────────
  //  Start a new quest on a client card
  // ────────────────────────────────────────────────
const startQuest = useCallback((
    clientId: string,
    side: 'Client' | 'Business',
    questType: QuestTypeItem,           // ← use the new type
    dueDate: string,
    note?: string
  ) => {
    setClients(prevClients =>
      prevClients.map(client => {
        if (client.id !== clientId) return client;

        const targetSide = side === 'Client' ? 'clientSide' : 'businessSide';
        const newQuest: Quest = {
          id: generateId(),
          type: questType.name,
          baseExp: questType.exp,
          dueDate,
          status: 'Active',
          tracked: true, // will be rebalanced below
          notes: note ? [{ id: generateId(), text: note, date: new Date().toISOString() }] : [],
        };

        const updatedSide = {
          ...client[targetSide],
          quests: [...(client[targetSide].quests || []), newQuest],
        };

        // Rebalance tracking
        updatedSide.quests = rebalanceQuestTracking(updatedSide.quests);

        // Log entry
        const logEntry: LogEntry = {
          id: generateId(),
          clientName: client.name || client.businessSide?.businessName || 'Unknown',
          questType: `Quest Started: ${questType.name}`,
          exp: 0,
          date: new Date().toISOString(),
          note,
        };

        updatedSide.logs = [logEntry, ...(updatedSide.logs || [])];

        return {
          ...client,
          [targetSide]: updatedSide,
        };
      })
    );

    // Also add to global daily log
    setDailyLog(prev => [
      {
        id: generateId(),
        clientName: 'System',
        questType: `Quest Started on card`,
        exp: 0,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [setClients, setDailyLog, rebalanceQuestTracking]);

  // ────────────────────────────────────────────────
  //  Calculate final XP for a completed/continued quest
  // ────────────────────────────────────────────────
  const calculateFinalExp = useCallback((
    quest: Quest,
    client: Client,
    side: 'Client' | 'Business',
    commission: number = 0,
    completionTypeId?: string
  ): number => {
    let total = quest.baseExp || 0;
    let multiplierPercent = 0;

    // Time-based multipliers
    const days = getDaysOut(quest.dueDate);
    if (days > 0) {
      multiplierPercent += rules.multipliers.find(m => m.name === 'Early')?.value || 0;
    } else if (days < 0) {
      multiplierPercent += rules.multipliers.find(m => m.name === 'Late')?.value || 0;
    }

    // Card flags
    if (client.isCOI) multiplierPercent += rules.multipliers.find(m => m.name === 'COI Card')?.value || 0;
    if (client.isBNI) multiplierPercent += rules.multipliers.find(m => m.name === 'BNI Card')?.value || 0;

    // Carrier bonuses
    const carriers = side === 'Client' ? client.clientSide.carriers : client.businessSide.carriers;
    if (carriers.includes('Farmers')) {
      multiplierPercent += rules.multipliers.find(m => m.name === 'Carrier: Farmers')?.value || 0;
    } else if (carriers.some(c => c.includes('Foremost') || c.includes('Bristol'))) {
      multiplierPercent += rules.multipliers.find(m => m.name === 'Carrier: Foremost/Bristol West')?.value || 0;
    }

    // Completion bonus
    if (completionTypeId) {
      const completion = rules.completionTypes.find(ct => ct.id === completionTypeId);
      if (completion) multiplierPercent += completion.bonusPercent || 0;
    }

    total *= (1 + multiplierPercent / 100);

    // Commission bonus
    const expPerDollar = rules.general.find(r => r.name === 'Exp per Commission Dollar')?.value || 1;
    total += commission * expPerDollar;

    return Math.round(total);
  }, [rules]);

  // ────────────────────────────────────────────────
  //  Complete or continue a quest
  // ────────────────────────────────────────────────
  const finishQuest = useCallback((
    clientId: string,
    side: 'Client' | 'Business',
    questId: string,
    action: 'Complete' | 'Continue',
    payload: {
      completionTypeId?: string;
      commission?: number;
      nextQuestTypeId?: string;
      nextDueDate?: string;
      isCooldown?: boolean;
      note?: string;
    }
  ) => {
    setClients(prevClients =>
      prevClients.map(client => {
        if (client.id !== clientId) return client;

        const targetSideKey = side === 'Client' ? 'clientSide' : 'businessSide';
        const targetSide = { ...client[targetSideKey] };

        const questIndex = targetSide.quests.findIndex(q => q.id === questId);
        if (questIndex === -1) return client;

        const quest = targetSide.quests[questIndex];

        const finalExp = calculateFinalExp(
          quest,
          client,
          side,
          payload.commission || 0,
          action === 'Complete' ? payload.completionTypeId : undefined
        );

        // Award XP to player
        setUserStats(prev => ({
          ...prev,
          exp: prev.exp + finalExp,
        }));

        // Log entry
        const logEntry: LogEntry = {
          id: generateId(),
          clientName: client.name || client.businessSide?.businessName || 'Unknown',
          questType: `${quest.type} (${action})`,
          exp: finalExp,
          date: new Date().toISOString(),
          note: payload.note,
        };

        targetSide.logs = [logEntry, ...targetSide.logs];
        setDailyLog(prev => [logEntry, ...prev]);

        // Handle completion
        if (action === 'Complete') {
          if (client.isStandalone) {
            // Remove standalone card entirely
            return null; // will be filtered out
          }

          targetSide.quests[questIndex] = {
            ...quest,
            status: 'Completed',
            completedDate: new Date().toISOString(),
            completionType: rules.completionTypes.find(ct => ct.id === payload.completionTypeId)?.name,
            notes: payload.note
              ? [...quest.notes, { id: generateId(), text: payload.note, date: new Date().toISOString() }]
              : quest.notes,
          };
        } else {
          // Continue
          if (payload.isCooldown) {
            targetSide.quests[questIndex] = {
              ...quest,
              status: 'Cooldown',
              dueDate: payload.nextDueDate || quest.dueDate,
              type: `${quest.type} (Cooldown)`,
              notes: payload.note
                ? [...quest.notes, { id: generateId(), text: payload.note, date: new Date().toISOString() }]
                : quest.notes,
            };
          } else {
            const nextType = [
              ...rules.cardQuestTypes,
              ...rules.standaloneQuestTypes,
            ].find(qt => qt.id === payload.nextQuestTypeId);

            if (nextType) {
              targetSide.quests[questIndex] = {
                ...quest,
                type: nextType.name,
                baseExp: nextType.exp,
                dueDate: payload.nextDueDate || quest.dueDate,
                status: 'Active',
                notes: payload.note
                  ? [...quest.notes, { id: generateId(), text: payload.note, date: new Date().toISOString() }]
                  : quest.notes,
              };
            }
          }
        }

        // Rebalance tracking
        targetSide.quests = rebalanceQuestTracking(targetSide.quests);

        return {
          ...client,
          [targetSideKey]: targetSide,
        };
      }).filter(Boolean) as Client[] // remove nulls from standalone completion
    );
  }, [setClients, setDailyLog, setUserStats, calculateFinalExp, rebalanceQuestTracking, rules]);

  // ────────────────────────────────────────────────
  //  Public API
  // ────────────────────────────────────────────────
  return {
    startQuest,
    finishQuest,
    calculateFinalExp,
    rebalanceQuestTracking,
  };
}