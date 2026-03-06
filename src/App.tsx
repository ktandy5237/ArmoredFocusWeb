// src/App.tsx
import { useState } from 'react';
import {
  Scroll, Map, Book, Sword} from 'lucide-react';

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
  BINDER_THEME} from './lib/theme';

import type { Client, LogEntry, Rules, UserStats, ModelName, ModelsState } from './lib/types';

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
  const [models, setModels] = useState<ModelsState>({
  drawCard: false,
  startQuest: false,
  questResult: false,
  // you can omit the others — Partial<> allows it
  });

  // Temporary Model context
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
  //  Model Helpers
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-stone-900 to-stone-950 border-b-4 border-[#daa520] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center gap-3 flex-wrap">
          {[
            { id: 'hub',    label: 'Hub',    icon: Scroll, accent: 'cyan'   },
            { id: 'quests', label: 'Quests', icon: Sword, accent: 'emerald' },
            { id: 'binder', label: 'Binder', icon: Book,  accent: 'purple'  },
            { id: 'rules',  label: 'Rules',  icon: Map,   accent: 'amber'   },
          ].map(({ id, label, icon: Icon, accent }) => (
            <button
              key={id}
              onClick={() => setView(id as any)}
              className={`px-8 py-3 rounded-t-xl font-serif font-bold text-lg transition-all flex items-center gap-2 border-t-4 ${
                view === id
                  ? `bg-gradient-to-t from-black/40 text-white border-${accent}-500 shadow-lg`
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
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
            openStartQuest={openStartQuest}
            openQuestResult={openQuestResult}
          />
        )}

        {view === 'rules' && (
          <RulesView rules={rules} setRules={setRules} />
        )}
      </main>

      {/* Models */}
      {models.drawCard && (
        <DrawCardModel
          onClose={() => setModels(m => ({ ...m, drawCard: false }))}
          onSave={(newCard) => {
            clientOps.addNewCard(newCard);
            setModels(m => ({ ...m, drawCard: false }));
          }}
          rules={rules}
        />
      )}

      {models.startQuest && (
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

      {models.questResult && selectedClient && activeQuestId && (
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
    </div>
  );
}