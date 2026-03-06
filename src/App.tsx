// src/App.tsx
import { useState } from 'react';
import {
  Scroll, Map, Book, Sword, Plus, Layers, UserPlus,
  ChevronDown, ChevronUp, X
} from 'lucide-react';

import HubView    from './features/hub/HubView';
import BinderView from './features/binder/BinderView';
import QuestsView from './features/quests/QuestsView';
import RulesView  from './features/rules/RulesView';

import DrawCardModel    from './models/DrawCardModel';
import StartQuestModel  from './models/StartQuestModel';
import QuestResultModel from './models/QuestResultModel';

import { useQuestOperations }   from './hooks/useQuestOperations';
import { useClientOperations }  from './hooks/useClientOperations';
import { useRulesOperations }   from './hooks/useRulesOperations';
import { useBonusProgress }     from './hooks/useBonusProgress';

import { initialRules } from './lib/rules';
import {
  THEME,
  HUB_THEME,
  QUEST_THEME,
  BINDER_THEME,
  METALLIC_SHADOW,
  METALLIC_FONT
} from './lib/theme';

import type { Client, LogEntry, Rules, UserStats, ModelName } from './lib/types';

export default function App() {
  // ────────────────────────────────────────────────
  //  Core State
  // ────────────────────────────────────────────────
  const [view, setView] = useState<'hub' | 'quests' | 'binder' | 'rules'>('hub');

  const [clients, setClients] = useState<Client[]>([]);
  const [dailyLog, setDailyLog] = useState<LogEntry[]>([]);
  const [rules, setRules] = useState<Rules>(initialRules);
  const [userStats, setUserStats] = useState<UserStats>({
    name: 'Keegan',
    exp: 0,
    level: 1,
  });

  // UI / Model state
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [Models, setModels] = useState<Record<ModelName, boolean>>({
    drawCard: false,
    startQuest: false,
    questResult: false,
    // mergeCard: false,
    // boosterPack: false,
    // levelTable: false,
  });

  // Temporary state for Models (selected context)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeSide, setActiveSide] = useState<'Client' | 'Business'>('Client');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [questActionType, setQuestActionType] = useState<'Complete' | 'Continue'>('Complete');
  const [isStandaloneCreation, setIsStandaloneCreation] = useState(false);

  // ────────────────────────────────────────────────
  //  Hooks
  // ────────────────────────────────────────────────
  const questOps = useQuestOperations({
    clients,
    setClients,
    dailyLog,
    setDailyLog,
    userStats,
    setUserStats,
    rules,
  });

  const clientOps = useClientOperations({
    clients,
    setClients,
    dailyLog,
    setDailyLog,
    rules,
  });

  const rulesOps = useRulesOperations({
    rules,
    setRules,
  });

  const bonusProgress = useBonusProgress({
    rules,
    dailyLog,
    setDailyLog,
    setUserStats,
  });

  // ────────────────────────────────────────────────
  //  Model Open Helpers
  // ────────────────────────────────────────────────
  const openDrawCard = () => setModels(m => ({ ...m, drawCard: true }));
  const openStartQuest = (standalone = false, client?: Client, side?: 'Client' | 'Business') => {
    setIsStandaloneCreation(standalone);
    setSelectedClient(client || null);
    setActiveSide(side || 'Client');
    setModels(m => ({ ...m, startQuest: true }));
  };

  const openQuestResult = (client: Client, side: 'Client' | 'Business', questId: string, action: 'Complete' | 'Continue') => {
    setSelectedClient(client);
    setActiveSide(side);
    setActiveQuestId(questId);
    setQuestActionType(action);
    setModels(m => ({ ...m, questResult: true }));
  };

  // ────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────
  const getViewBackground = () => {
    switch (view) {
      case 'hub':    return HUB_THEME.bg;
      case 'quests': return QUEST_THEME.bg;
      case 'binder': return BINDER_THEME.bg;
      default:       return THEME.bg;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${getViewBackground()}`}>
      {/* Header / Tabs */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-stone-900 to-stone-950 border-b-4 border-[#daa520] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-3 flex-wrap">
          {[
            { id: 'hub',    label: 'Hub',    icon: Scroll, theme: HUB_THEME    },
            { id: 'quests', label: 'Quests', icon: Sword, theme: QUEST_THEME  },
            { id: 'binder', label: 'Binder', icon: Book,  theme: BINDER_THEME },
            { id: 'rules',  label: 'Rules',  icon: Map,   theme: THEME        },
          ].map(({ id, label, icon: Icon, theme }) => (
            <button
              key={id}
              onClick={() => setView(id as any)}
              className={`px-8 py-3 rounded-t-xl font-serif font-bold text-lg transition-all flex items-center gap-2 border-t-4 ${
                view === id
                  ? `bg-gradient-to-t from-black/40 text-white border-${theme?.textAccent?.split('-')[1] || 'amber'}-500 shadow-lg`
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'hub' && (
          <HubView
            clients={clients}
            dailyLog={dailyLog}
            userStats={userStats}
            setUserStats={setUserStats}
            setModels={setModels}
            setExpandedCardId={setExpandedCardId}
            expandedCardId={expandedCardId}
          />
        )}

        {view === 'binder' && (
          <BinderView
            clients={clients}
            expandedCardId={expandedCardId}
            setExpandedCardId={setExpandedCardId}
          />
        )}

        {view === 'quests' && (
          <QuestsView
            clients={clients}
            dailyLog={dailyLog}
            expandedCardId={expandedCardId}
            setExpandedCardId={setExpandedCardId}
            openQuestResult={openQuestResult}
            openStartQuest={openStartQuest}
          />
        )}

        {view === 'rules' && (
          <RulesView
            rules={rules}
            setRules={setRules}
          />
        )}
      </main>

      {/* Models */}
      {Models.drawCard && (
        <DrawCardModel
          onClose={() => setModels(m => ({ ...m, drawCard: false }))}
          onSave={(newCard) => {
            clientOps.addNewCard(newCard);
            setModels(m => ({ ...m, drawCard: false }));
          }}
          rules={rules}
        />
      )}

      {Models.startQuest && (
        <StartQuestModel
          isStandalone={isStandaloneCreation}
          client={selectedClient ?? undefined}
          side={activeSide}
          onClose={() => setModels(m => ({ ...m, startQuest: false }))}
          rules={rules}
          setClients={setClients}
          setDailyLog={setDailyLog}
          setUserStats={setUserStats}
        />
      )}

      {Models.questResult && selectedClient && activeQuestId && (
        <QuestResultModel
          client={selectedClient}
          side={activeSide}
          questId={activeQuestId}
          action={questActionType}
          onClose={() => setModels(m => ({ ...m, questResult: false }))}
          rules={rules}
          setClients={setClients}
          setDailyLog={setDailyLog}
          setUserStats={setUserStats}
        />
      )}

      {/* Add MergeCardModel, BoosterPackModel, etc. here when ready */}
    </div>
  );
}