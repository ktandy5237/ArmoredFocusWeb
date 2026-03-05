// src/lib/rules.ts

export const initialRules = {
  general: [
    { id: 'g1', name: 'New Card Drawn', value: 25, unit: 'Exp' },
    { id: 'g2', name: 'Exp per Commission Dollar', value: 1, unit: 'Exp/$' },
  ],
  cardQuestTypes: [
    { id: 'qt1', name: 'Quote New - Initiated by Me', exp: 50 },
    // ... all the others you had
  ],
  // ... put all the other arrays here: standaloneQuestTypes, completionTypes, multipliers, bonuses, levels, universalLevelRewards
};

export const CLIENT_LOB_OPTIONS = ['Home', 'Auto', 'Toys', 'Umbrella', 'Life', 'Commercial', 'Health', 'Supplemental', 'Warranty', 'Electronics', 'Jewelry', 'Pet', 'Other'];

export const CLIENT_CARRIER_OPTIONS = ['Farmers', 'Bristol West', 'Foremost', 'Progressive', 'National General', 'Kraft Lake', 'Other'];

export const BUSINESS_LOB_OPTIONS = ['GL', 'BoP', 'Farm', 'Comm Auto', 'Workers Comp', 'E&O', 'Inland Marine', 'Umbrella', 'Cyber', 'Other'];

export const BUSINESS_CARRIER_OPTIONS = ['Farmers', 'Foremost', 'Progressive', 'Tapco', 'Hiscox', 'Next', 'Liberty Mutual', 'Berkshire Hathaway', 'Kraft Lake Compare', 'Other'];