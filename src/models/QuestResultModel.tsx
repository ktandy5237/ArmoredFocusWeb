// src/Models/QuestResultModel.tsx
import { useState, useMemo } from 'react';
import {
  X, CheckCircle, ArrowRight, DollarSign, Calendar,
  AlertCircle, Clock, FileText,
  Sword
} from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import { THEME } from '@/src/lib/theme';
import { formatDisplayDate, getDaysOut } from '@/src/lib/utils';
import { useQuestOperations } from '@/src/hooks/useQuestOperations';

import type { Client, Rules } from '@/src/lib/types';
import Icon from '@/app/ReusableUI/Icons/PencilIcon';

interface QuestResultModelProps {
  client: Client;
  side: 'Client' | 'Business';
  questId: string;
  action: 'Complete' | 'Continue';   // determines Model mode
  onClose: () => void;
  // Passed from parent (usually App.tsx)
  rules: Rules;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setDailyLog: React.Dispatch<React.SetStateAction<any[]>>;
  setUserStats: React.Dispatch<React.SetStateAction<any>>;
}

export default function QuestResultModel({
  client,
  side,
  questId,
  action,
  onClose,
  rules,
  setClients,
  setDailyLog,
  setUserStats,
}: QuestResultModelProps) {
  const { calculateFinalExp, finishQuest } = useQuestOperations({
    clients: [], // not needed here - we pass setters directly
    setClients,
    dailyLog: [],
    setDailyLog,
    userStats: { exp: 0, level: 1, name: '' },
    setUserStats,
    rules,
  });

  const quest = (side === 'Client' ? client.clientSide : client.businessSide)
    .quests?.find(q => q.id === questId);

  if (!quest) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
        <div className="bg-white p-8 rounded-xl max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Quest Not Found</h2>
          <p className="text-stone-600 mb-6">The selected quest could not be located.</p>
          <RPGButton onClick={onClose}>Close</RPGButton>
        </div>
      </div>
    );
  }

  const [completionTypeId, setCompletionTypeId] = useState(
    rules.completionTypes[0]?.id || ''
  );
  const [commission, setCommission] = useState<number | ''>('');
  const [isCooldown, setIsCooldown] = useState(false);
  const [nextQuestTypeId, setNextQuestTypeId] = useState(
    rules.cardQuestTypes[0]?.id || ''
  );
  const [nextDueDate, setNextDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // tomorrow
  );
  const [resultNote, setResultNote] = useState('');

  // Preview final XP
  const previewExp = useMemo(() => {
    return calculateFinalExp(
      quest,
      client,
      side,
      Number(commission) || 0,
      action === 'Complete' ? completionTypeId : undefined
    );
  }, [quest, client, side, commission, completionTypeId, action, calculateFinalExp]);

  const handleSubmit = () => {
    finishQuest(
      client.id,
      side,
      questId,
      action,
      {
        completionTypeId: action === 'Complete' ? completionTypeId : undefined,
        commission: Number(commission) || 0,
        nextQuestTypeId: action === 'Continue' && !isCooldown ? nextQuestTypeId : undefined,
        nextDueDate: action === 'Continue' ? nextDueDate : undefined,
        isCooldown: action === 'Continue' ? isCooldown : false,
        note: resultNote.trim() || undefined,
      }
    );

    onClose();
  };

  const title = action === 'Complete' ? 'Complete Quest' : 'Continue / Progress Quest';
  const icon = action === 'Complete' ? CheckCircle : ArrowRight;
  const buttonVariant = action === 'Complete' ? 'action' : 'primary';
  const buttonText = action === 'Complete' ? 'Complete & Award XP' : 'Log Progress';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[120] backdrop-blur-sm p-4">
      <div className="bg-[#fdfbf7] w-full max-w-lg rounded-xl shadow-2xl border-4 border-[#d4c5a9] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`p-5 border-b border-[#d4c5a9] flex justify-between items-center ${action === 'Complete' ? 'bg-emerald-800' : 'bg-blue-800'} text-white`}>
          <div className="flex items-center gap-3">
            <Icon size={28} />
            <h2 className="font-serif font-bold text-xl">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quest Info */}
          <div className="bg-white p-4 rounded-lg border border-stone-200">
            <h3 className="font-medium text-[#8b4513] mb-2 flex items-center gap-2">
              <Sword size={18} />
              {quest.type}
            </h3>
            <div className="text-sm text-stone-600">
              Due: {formatDisplayDate(quest.dueDate)}
              {getDaysOut(quest.dueDate) < 0 && (
                <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
              )}
            </div>
          </div>

          {/* Completion Type (only for Complete) */}
          {action === 'Complete' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Result / Completion Type
              </label>
              <select
                className="w-full px-4 py-2.5 border border-[#d4c5a9] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={completionTypeId}
                onChange={e => setCompletionTypeId(e.target.value)}
              >
                {rules.completionTypes.map(ct => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name} (+{ct.bonusPercent}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Commission */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600" />
              Commission Earned
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-stone-400" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2.5 border border-[#d4c5a9] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={commission}
                onChange={e => setCommission(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Continue-only fields */}
          {action === 'Continue' && (
            <div className="space-y-5 border-t border-stone-200 pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCooldown}
                  onChange={e => setIsCooldown(e.target.checked)}
                  className="w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-stone-800">Put into Cooldown (no new quest type)</span>
              </label>

              {!isCooldown && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Next Quest Type
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#d4c5a9] rounded-lg bg-white"
                    value={nextQuestTypeId}
                    onChange={e => setNextQuestTypeId(e.target.value)}
                  >
                    {rules.cardQuestTypes.map(qt => (
                      <option key={qt.id} value={qt.id}>
                        {qt.name} ({qt.exp} base XP)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  New Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-[#d4c5a9] rounded-lg"
                  value={nextDueDate}
                  onChange={e => setNextDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {/* Result Note */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-amber-700" />
              Result / Progress Note
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[#d4c5a9] rounded-lg min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={resultNote}
              onChange={e => setResultNote(e.target.value)}
              placeholder="Describe what happened, next steps, or any observations..."
            />
          </div>

          {/* XP Preview */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200 text-center">
            <div className="text-sm text-amber-800 mb-1">Estimated XP Award</div>
            <div className="text-4xl font-bold text-amber-700">{previewExp} XP</div>
            <div className="text-xs text-amber-600 mt-1">
              (includes multipliers, commission, and {action === 'Complete' ? 'completion bonus' : 'progress factors'})
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#d4c5a9] bg-[#fdfbf7] flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-stone-600 font-medium hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <RPGButton
            variant={buttonVariant}
            onClick={handleSubmit}
            className="px-8 py-2.5 text-base flex items-center gap-2"
          >
            {action === 'Complete' ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
            {buttonText}
          </RPGButton>
        </div>
      </div>
    </div>
  );
}