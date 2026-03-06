// src/features/hub/HubView.tsx
import { useState } from 'react';
import {
  Scroll, Coins, UserPlus, Layers, Award, Target, Clock,
  Edit2, CheckCircle, AlertCircle
} from 'lucide-react';
import { RPGButton } from '@/components/ui/RPGButton';
import ClientCard from '@/components/ClientCard/ClientCard'; // assuming extracted
import { HUB_THEME, METALLIC_SHADOW, METALLIC_FONT } from '@/lib/theme';
import { formatDateStandard } from '@/lib/utils';
import type { Client, LogEntry } from '@/lib/types';
import ScrollLog from '@/components/ScrollLog/ScrollLog';

interface HubViewProps {
  clients: Client[];
  dailyLog: LogEntry[];
  userStats: { name: string; exp: number; level: number };
  setUserStats: React.Dispatch<React.SetStateAction<{ name: string; exp: number; level: number }>>;
  setModels: React.Dispatch<React.SetStateAction<any>>;
  setExpandedCardId: (id: string | null) => void;
  expandedCardId: string | null;
  // Optional: pass setClients, rules, etc. if needed for actions
}

export default function HubView({
  clients,
  dailyLog,
  userStats,
  setUserStats,
  setModels,
  setExpandedCardId,
  expandedCardId,
}: HubViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  // Calculate XP progress
  const nextLevelExp = 500 * userStats.level * (userStats.level + 1); // simple progression example
  const currentExpPercent = Math.min(100, Math.floor((userStats.exp / nextLevelExp) * 100));
  const expToNext = nextLevelExp - userStats.exp;

  // Active quests (cards with at least one active/cooldown quest)
  const activeQuestClients = clients.filter(c =>
    c.clientSide?.quests?.some(q => q.status === 'Active' || q.status === 'Cooldown') ||
    c.businessSide?.quests?.some(q => q.status === 'Active' || q.status === 'Cooldown')
  );

  return (
    <div className={`min-h-full ${HUB_THEME.bg} text-blue-50 p-6 overflow-y-auto`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header / Stats Bar */}
        <div className={`${HUB_THEME.panel} rounded-2xl overflow-hidden shadow-2xl`}>
          <div className="bg-blue-950/70 p-5 border-b border-blue-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Level & Name */}
            <div className="flex items-center gap-5">
              <div className="bg-blue-900 border-4 border-blue-400 rounded-xl px-5 py-3 min-w-[140px] text-center shadow-inner">
                <div className="text-blue-300 text-xs uppercase tracking-widest mb-1">Level</div>
                <div className="text-4xl font-bold text-blue-100">{userStats.level}</div>
              </div>

              <div>
                {isEditingName ? (
                  <input
                    autoFocus
                    className="bg-transparent border-b-2 border-cyan-400 text-cyan-100 text-2xl font-bold focus:outline-none"
                    value={userStats.name}
                    onChange={e => setUserStats(s => ({ ...s, name: e.target.value }))}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                  />
                ) : (
                  <h1
                    className="text-3xl font-serif font-bold text-blue-50 cursor-pointer group flex items-center gap-3 hover:text-cyan-200 transition-colors"
                    onClick={() => setIsEditingName(true)}
                  >
                    {userStats.name}
                    <Edit2 size={20} className="opacity-0 group-hover:opacity-70 transition-opacity" />
                  </h1>
                )}
                <p className="text-blue-300/80 text-sm mt-1">Adventurer</p>
              </div>
            </div>

            {/* Today's Date */}
            <div className="bg-blue-900/50 px-5 py-2 rounded-lg border border-blue-500/40 text-right">
              <div className="text-xs text-blue-300 uppercase tracking-wider">Today</div>
              <div className="text-lg font-mono font-bold text-cyan-300">
                {formatDateStandard(new Date().toISOString())}
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="p-6 bg-gradient-to-b from-blue-950/80 to-blue-950/40">
            <div className="flex justify-between text-xs font-bold text-cyan-200 mb-2 font-mono uppercase">
              <span>{userStats.exp.toLocaleString()} Exp</span>
              <span>Next Level: {nextLevelExp.toLocaleString()}</span>
            </div>

            <div className="h-6 bg-blue-950 rounded-full border-2 border-blue-600 overflow-hidden shadow-inner relative">
              <div
                className={`${HUB_THEME.barFill} h-full transition-all duration-1000 ease-out shadow-[0_0_20px_cyan]`}
                style={{ width: `${currentExpPercent}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="text-center mt-2 text-sm font-mono text-cyan-300">
              {expToNext.toLocaleString()} Exp until Level {userStats.level + 1}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <RPGButton
            onClick={() => setModels((m: any) => ({ ...m, startQuest: true }))}
            className="py-6 text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            <Coins size={24} className="text-emerald-300" />
            Start Card Quest
          </RPGButton>

          <RPGButton
            onClick={() => setModels((m: any) => ({ ...m, startQuest: true }))} // can pass isStandalone=true in real impl
            variant="gold"
            className="py-6 text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            <AlertCircle size={24} className="text-amber-300" />
            Start Standalone Task
          </RPGButton>

          <RPGButton
            onClick={() => setModels((m: any) => ({ ...m, drawCard: true }))}
            className="py-6 text-lg flex items-center justify-center gap-3 shadow-xl"
          >
            <Layers size={24} className="text-amber-300" />
            Draw New Card
          </RPGButton>
        </div>

        {/* Active Quests Preview */}
        <div className={`${HUB_THEME.panel} p-6 rounded-2xl`}>
          <h2 className="text-2xl font-serif font-bold text-blue-100 mb-5 flex items-center gap-3">
            <Target size={24} className="text-cyan-400" />
            Active Quests
          </h2>

          {activeQuestClients.length === 0 ? (
            <div className="text-center py-12 opacity-70">
              <Clock size={64} className="mx-auto mb-4 text-blue-400/50" />
              <p className="text-xl text-blue-200">No active quests right now</p>
              <p className="text-blue-300 mt-2">Start one above to begin your adventure!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeQuestClients.slice(0, 6).map(client => (  // limit to 6 for dashboard
                <ClientCard
                  key={client.id}
                  client={client}
                  isExpanded={expandedCardId === client.id}
                  onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)}
                  onUpdate={() => {}} // stub - connect real update if needed
                />
              ))}
            </div>
          )}
        </div>

        {/* Bonus Board / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bonus Board */}
          <div className={`${HUB_THEME.panel} p-6 rounded-2xl`}>
            <h2 className="text-xl font-serif font-bold text-blue-100 mb-5 flex items-center gap-3">
              <Award size={22} className="text-yellow-400" />
              Bonus Progress
            </h2>

            <div className="space-y-4">
              {/* Example bonus - expand with real data */}
              <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-700/40">
                <div className="text-sm font-medium text-cyan-200 mb-2">Plan Day 5 Days Straight</div>
                <div className="h-3 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 w-[40%]" />
                </div>
                <div className="text-xs text-blue-300 mt-1">2 / 5 days</div>
              </div>

              <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-700/40">
                <div className="text-sm font-medium text-cyan-200 mb-2">Weekly Commission Goal</div>
                <div className="h-3 bg-blue-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-[65%]" />
                </div>
                <div className="text-xs text-blue-300 mt-1">$650 / $1,000</div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Scroll Log */}
          <div className={`${HUB_THEME.panel} p-0 rounded-2xl overflow-hidden flex flex-col h-[420px]`}>
            <div className="p-5 border-b border-blue-500/40 flex items-center justify-between bg-blue-950/70">
              <h2 className="text-xl font-serif font-bold text-blue-100 flex items-center gap-3">
                <Scroll size={22} className="text-cyan-400" />
                Recent Deeds
              </h2>
              <span className="text-sm text-blue-300">{dailyLog.length} entries</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollLog dailyLog={dailyLog.slice(0, 15)} /> {/* limit for performance */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}