// src/features/quests/QuestsView.tsx
import { useState } from 'react';
import {
  Sword, Search as SearchIcon,
  Map, AlertCircle, Clock} from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import ScrollLog from "@/src/components/ScrollLog/Scrolllog"
import ClientCard from '@/src/components/ClientCard/ClientCard';

import { QUEST_THEME } from '@/src/lib/theme';

import type { Client, LogEntry } from '@/src/lib/types';
import { getDaysOut } from '@/src/lib/utils';

interface QuestsViewProps {
  clients: Client[];
  dailyLog: LogEntry[];
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  openStartQuest: (standalone?: boolean, client?: Client, side?: 'Client' | 'Business') => void;
  openQuestResult: (client: Client, side: 'Client' | 'Business', questId: string, action: 'Complete' | 'Continue') => void;
}

export default function QuestsView({
  clients,
  dailyLog,
  expandedCardId,
  setExpandedCardId,
  openStartQuest,
  openQuestResult,
}: QuestsViewProps) {
  const [search, setSearch] = useState('');

  // Filter clients that have at least one active or cooldown quest
  const activeQuestClients = clients.filter(client =>
    client.clientSide?.quests?.some(q => q.status === 'Active' || q.status === 'Cooldown') ||
    client.businessSide?.quests?.some(q => q.status === 'Active' || q.status === 'Cooldown')
  );

  // Apply search filter
  const filteredClients = activeQuestClients.filter(client => {
    if (!search.trim()) return true;

    const term = search.toLowerCase();
    const name = (client.name || client.businessSide?.businessName || '').toLowerCase();
    const phone = (client.phone || client.businessSide?.phone || '').toLowerCase();

    // Also search active quest types
    const hasMatchingQuest = 
      client.clientSide?.quests?.some(q => 
        (q.status === 'Active' || q.status === 'Cooldown') &&
        q.type.toLowerCase().includes(term)
      ) ||
      client.businessSide?.quests?.some(q => 
        (q.status === 'Active' || q.status === 'Cooldown') &&
        q.type.toLowerCase().includes(term)
      );

    return name.includes(term) || phone.includes(term) || hasMatchingQuest;
  });

  // Sort by most urgent quest (overdue first, then soonest due)
  const sortedClients = [...filteredClients].sort((a, b) => {
    const getUrgentDays = (c: Client) => {
      const allQuests = [
        ...(c.clientSide?.quests || []),
        ...(c.businessSide?.quests || []),
      ].filter(q => q.status === 'Active' || q.status === 'Cooldown');

      if (allQuests.length === 0) return 9999;

      const tracked = allQuests.find(q => q.tracked) || allQuests[0];
      return getDaysOut(tracked.dueDate);
    };

    return getUrgentDays(a) - getUrgentDays(b); // smaller (more negative = overdue) first
  });

  return (
    <div className={`relative h-full w-full ${QUEST_THEME.bg}`}>
      {/* Left Sidebar: Scroll Log + Quick Actions */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 min-w-[380px] max-w-[500px] p-6 flex flex-col gap-6 overflow-hidden">
        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <RPGButton
            onClick={() => openStartQuest(false)}
            className="py-5 text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            <Sword size={22} />
            Start Card Quest
          </RPGButton>

          <RPGButton
            onClick={() => openStartQuest(true)}
            variant="gold"
            className="py-5 text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            <AlertCircle size={22} />
            Start Standalone Task
          </RPGButton>
        </div>

        {/* Today's Scroll Log */}
        <div className="flex-1 relative">
          <ScrollLog dailyLog={dailyLog} />
        </div>
      </div>

      {/* Right Tray: Active Quests */}
      <div className="absolute right-0 top-0 bottom-0 left-[33%] p-6 overflow-y-auto">
        <div className={`${QUEST_THEME.tray} rounded-2xl p-6 h-full`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-emerald-700/40 pb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-emerald-100 drop-shadow-md flex items-center gap-3">
                <Map size={32} className="text-emerald-400" />
                Active Quests
              </h1>
              <p className="text-emerald-200/80 mt-1">
                {sortedClients.length} active {sortedClients.length === 1 ? 'quest' : 'quests'} in progress
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-emerald-950/60 border border-emerald-700 rounded-xl text-emerald-100 placeholder-emerald-300/60 focus:outline-none focus:border-emerald-500"
                placeholder="Search quests or clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Quest Cards */}
          {sortedClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-80">
              <Clock size={80} className="text-emerald-400/50 mb-6" />
              <h2 className="text-2xl font-serif font-bold text-emerald-100 mb-3">
                The Realm is Quiet
              </h2>
              <p className="text-emerald-200 max-w-md">
                No active quests at the moment. Start a new one above to continue your adventure.
              </p>
              <RPGButton
                onClick={() => openStartQuest(false)}
                className="mt-8 px-8 py-4 text-lg"
              >
                Begin a Quest
              </RPGButton>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedClients.map(client => {
                const side = client.clientSide?.quests?.some(q => q.tracked) ? 'Client' : 'Business';
                return (
                  <ClientCard
                    key={client.id}
                    client={client}
                    isExpanded={expandedCardId === client.id}
                    onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)}
                    onUpdate={() => {}} // connect real update later
                    // Optional: pass openQuestResult to allow completing from card
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}