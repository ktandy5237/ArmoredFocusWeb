// src/lib/types.ts

// ────────────────────────────────────────────────
//   Core Entities
// ────────────────────────────────────────────────

export interface LogEntry {
  id: string;
  clientName: string;
  questType: string;
  exp: number;
  date: string;           // ISO string
  note?: string;
}

export interface QuestNote {
  id: string;
  text: string;
  date: string;           // ISO string
}

export interface Quest {
  id: string;
  type: string;
  baseExp: number | undefined;
  dueDate: string;        // YYYY-MM-DD
  status: 'Active' | 'Completed' | 'Cancelled' | 'Cooldown';
  tracked: boolean;
  notes: QuestNote[];
  completedDate?: string;
  completionType?: string;
}

export interface ClientSide {
  notes: QuestNote[];
  logs: LogEntry[];
  quests: Quest[];
  lob: string[];          // Line of Business
  carriers: string[];
}

export interface BusinessSide {
  businessName: string;
  phone: string;
  ein: string;
  established: string;
  occupancy: 'Own' | 'Lease' | 'Other';
  notes: QuestNote[];
  logs: LogEntry[];
  quests: Quest[];
  lob: string[];
  carriers: string[];
}

export interface Connections {
  referredBy: string[];   // client IDs or names
  referrals: string[];    // client IDs or names
  household: Array<{ id: string; name: string }>;
}

export interface Client {
  id: string;
  primarySide: 'Client' | 'Business' | 'Standalone';
  name?: string;                        // Client side
  phone?: string;
  email?: string;
  address?: string;
  mailingAddress?: string;
  dob?: string;
  license?: string;
  residenceType?: 'Homeowner' | 'Rent' | 'Other';

  businessSide: BusinessSide;

  isCOI: boolean;
  isBNI: boolean;
  userRating: number;                   // 0–5
  relationshipScore: number;            // 0–100

  clientSide: ClientSide;
  connections: Connections;

  isStandalone?: boolean;               // temporary task card
}

// ────────────────────────────────────────────────
//   Rules / Game Config
// ────────────────────────────────────────────────

export interface RuleItem {
  id: string;
  name: string;
  value?: number;
  exp?: number;
  bonusPercent?: number;
  reward?: string;
  unit?: string;
  target?: number;          // for bonuses
}

export interface Level {
  id: string;
  level: number;
  exp: number;
  reward: string;
  title: string;
}

export interface Rules {
  general: RuleItem[];
  cardQuestTypes: RuleItem[];
  standaloneQuestTypes: RuleItem[];
  completionTypes: RuleItem[];
  multipliers: RuleItem[];
  bonuses: RuleItem[];
  levels: Level[];
  universalLevelRewards: { id: string; reward: string }[];
}

// ────────────────────────────────────────────────
//   User / Stats
// ────────────────────────────────────────────────

export interface UserStats {
  name: string;
  exp: number;
  level: number;
}

// ────────────────────────────────────────────────
//   Misc / UI Helpers
// ────────────────────────────────────────────────

export type ModelName =
  | 'drawCard'
  | 'startQuest'
  | 'questResult'
  | 'boosterPack'
  | 'mergeCard'
  | 'levelTable'
  | 'modifyQuest';

export interface ModelsState {
  [key in ModelName]?: boolean;
}

export type View = 'hub' | 'quests' | 'binder' | 'rules';