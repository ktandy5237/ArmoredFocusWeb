import { Rules } from "./types";

export const initialRules: Rules = {
  general: [
    { id: 'g1', name: 'New Card Drawn', value: 25, unit: 'Exp' },
    { id: 'g2', name: 'Exp per Commission Dollar', value: 1, unit: 'Exp/$' },
  ],
  cardQuestTypes: [
    // ← paste all your original card quest types here
    { id: 'qt1', name: 'Quote New - Initiated by Me', exp: 50 },
    { id: 'qt2', name: 'Quote New - Initiated by Them', exp: 25 },
    // ... etc.
  ],
  standaloneQuestTypes: [],
  completionTypes: [],
  multipliers: [],
  bonuses: [],
  levels: [],
  universalLevelRewards: [],
};