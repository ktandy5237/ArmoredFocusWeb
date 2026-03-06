// src/hooks/useRulesOperations.ts
import { useCallback } from 'react';
import { generateId } from '@/lib/utils';
import type { Rules, RuleItem, Level } from '@/lib/types';

interface UseRulesOperationsProps {
  rules: Rules;
  setRules: React.Dispatch<React.SetStateAction<Rules>>;
}

export function useRulesOperations({ rules, setRules }: UseRulesOperationsProps) {
  // ────────────────────────────────────────────────
  //  Generic: Add new rule to any category
  // ────────────────────────────────────────────────
  const addRule = useCallback(
    (category: keyof Rules, partialRule: Partial<RuleItem> = {}) => {
      const newRule: RuleItem = {
        id: generateId(),
        name: 'New Rule',
        value: 0,
        unit: category === 'completionTypes' ? '%' : 'Exp',
        ...partialRule,
      };

      setRules(prev => ({
        ...prev,
        [category]: [...(prev[category] as RuleItem[]), newRule],
      }));
    },
    [setRules]
  );

  // ────────────────────────────────────────────────
  //  Generic: Update any field of a rule
  // ────────────────────────────────────────────────
  const updateRule = useCallback(
    <K extends keyof Rules>(
      category: K,
      ruleId: string,
      field: string,
      value: any
    ) => {
      setRules(prev => ({
        ...prev,
        [category]: (prev[category] as any[]).map(item =>
          item.id === ruleId ? { ...item, [field]: value } : item
        ),
      }));
    },
    [setRules]
  );

  // ────────────────────────────────────────────────
  //  Generic: Delete a rule by id
  // ────────────────────────────────────────────────
  const deleteRule = useCallback(
    <K extends keyof Rules>(category: K, ruleId: string) => {
      setRules(prev => ({
        ...prev,
        [category]: (prev[category] as any[]).filter(item => item.id !== ruleId),
      }));
    },
    [setRules]
  );

  // ────────────────────────────────────────────────
  //  Level-specific: Add new level (appends to the end)
  // ────────────────────────────────────────────────
  const addLevel = useCallback(() => {
    setRules(prev => {
      const lastLevel = prev.levels[prev.levels.length - 1];
      const nextLevelNumber = lastLevel ? lastLevel.level + 1 : 1;
      const nextExp = lastLevel ? lastLevel.exp + 1000 : 500;

      const newLevel: Level = {
        id: generateId(),
        level: nextLevelNumber,
        exp: nextExp,
        title: `Level ${nextLevelNumber}`,
        reward: 'New Title / Item',
      };

      return {
        ...prev,
        levels: [...prev.levels, newLevel],
      };
    });
  }, [setRules]);

  // ────────────────────────────────────────────────
  //  Level-specific: Update level field
  // ────────────────────────────────────────────────
  const updateLevel = useCallback(
    (levelId: string, field: keyof Level, value: any) => {
      setRules(prev => ({
        ...prev,
        levels: prev.levels.map(lvl =>
          lvl.id === levelId ? { ...lvl, [field]: value } : lvl
        ),
      }));
    },
    [setRules]
  );

  // ────────────────────────────────────────────────
  //  Level-specific: Delete level
  // ────────────────────────────────────────────────
  const deleteLevel = useCallback(
    (levelId: string) => {
      setRules(prev => ({
        ...prev,
        levels: prev.levels.filter(lvl => lvl.id !== levelId),
      }));
    },
    [setRules]
  );

  // ────────────────────────────────────────────────
  //  Universal level rewards (simple string list)
  // ────────────────────────────────────────────────
  const addUniversalReward = useCallback((rewardText: string) => {
    if (!rewardText.trim()) return;

    setRules(prev => ({
      ...prev,
      universalLevelRewards: [
        ...prev.universalLevelRewards,
        { id: generateId(), reward: rewardText.trim() },
      ],
    }));
  }, [setRules]);

  const deleteUniversalReward = useCallback((rewardId: string) => {
    setRules(prev => ({
      ...prev,
      universalLevelRewards: prev.universalLevelRewards.filter(r => r.id !== rewardId),
    }));
  }, [setRules]);

  // ────────────────────────────────────────────────
  //  Public API
  // ────────────────────────────────────────────────
  return {
    // Generic rule operations
    addRule,
    updateRule,
    deleteRule,

    // Level operations
    addLevel,
    updateLevel,
    deleteLevel,

    // Universal rewards
    addUniversalReward,
    deleteUniversalReward,
  };
}