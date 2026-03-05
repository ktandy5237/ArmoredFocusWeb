// src/modals/StartQuestModal.tsx
import { useState } from 'react';
import { X, Calendar, FileText, AlertCircle, Sword } from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import { THEME } from '@/src/lib/theme';
import { useQuestOperations } from '@/src/hooks/useQuestOperations';

import type { Client, Rules } from '@/src/lib/types';
import { generateId } from '../lib/utils';

interface StartQuestModalProps {
  isStandalone?: boolean;           // true = standalone task, false = tied to a client
  client?: Client;                  // required if !isStandalone
  side?: 'Client' | 'Business';     // required if !isStandalone
  onClose: () => void;
  rules: Rules;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setDailyLog: React.Dispatch<React.SetStateAction<any[]>>;
  setUserStats?: React.Dispatch<React.SetStateAction<any>>; // optional
}

export default function StartQuestModal({
  isStandalone = false,
  client,
  side,
  onClose,
  rules,
  setClients,
  setDailyLog,
  setUserStats,
}: StartQuestModalProps) {
  const { startQuest } = useQuestOperations({
    clients: [], // not directly used here
    setClients,
    dailyLog: [],
    setDailyLog,
    userStats: { exp: 0, level: 1, name: '' },
    setUserStats: setUserStats || (() => {}),
    rules,
  });

  const [selectedQuestTypeId, setSelectedQuestTypeId] = useState<string>(
    isStandalone
      ? rules.standaloneQuestTypes[0]?.id || ''
      : rules.cardQuestTypes[0]?.id || ''
  );

  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] // default: 3 days from now
  );

  const [note, setNote] = useState('');

  const questTypes = isStandalone ? rules.standaloneQuestTypes : rules.cardQuestTypes;

  const selectedType = questTypes.find(qt => qt.id === selectedQuestTypeId);

  const handleSubmit = () => {
    if (!selectedType) {
      alert('Please select a quest type');
      return;
    }

    if (!dueDate) {
      alert('Please select a due date');
      return;
    }

    if (isStandalone && !note.trim()) {
      alert('Standalone quests require a note/description');
      return;
    }

    if (isStandalone) {
      // Standalone quest → create temporary card
      const tempClient: Client = {
        id: `standalone-${Date.now()}`,
        primarySide: 'Standalone',
        name: 'Standalone Task',
        isStandalone: true,
        clientSide: {
          notes: [],
          logs: [],
          quests: [{
            id: generateId(),
            type: selectedType.name,
            baseExp: selectedType.exp,
            dueDate,
            status: 'Active',
            tracked: true,
            notes: note.trim() ? [{
              id: generateId(),
              text: note.trim(),
              date: new Date().toISOString(),
            }] : [],
          }],
          lob: [],
          carriers: [],
        },
        businessSide: {
          businessName: '',
          phone: '',
          ein: '',
          established: '',
          occupancy: 'Own',
          notes: [],
          logs: [],
          quests: [],
          lob: [],
          carriers: [],
        },
        connections: { referredBy: [], referrals: [], household: [] },
        isCOI: false,
        isBNI: false,
        userRating: 0,
        relationshipScore: 0,
      };

      setClients(prev => [...prev, tempClient]);

      // Log
      setDailyLog(prev => [
        {
          id: generateId(),
          clientName: 'Standalone',
          questType: `Standalone Quest Started: ${selectedType.name}`,
          exp: 0,
          date: new Date().toISOString(),
          note: note.trim() || undefined,
        },
        ...prev,
      ]);
    } else if (client && side) {
      // Regular card quest
      startQuest(
        client.id,
        side,
        selectedType,
        dueDate,
        note.trim() || undefined
      );
    }

    onClose();
  };

  const title = isStandalone ? 'Start Standalone Quest' : 'Start New Quest';
  const subtitle = isStandalone
    ? 'Create a temporary one-off task (card removed on completion)'
    : `For: ${client?.name || client?.businessSide?.businessName || 'Selected Card'} (${side})`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[120] backdrop-blur-sm p-4">
      <div className="bg-[#fdfbf7] w-full max-w-lg rounded-xl shadow-2xl border-4 border-[#d4c5a9] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`${THEME.header} p-5 border-b border-[#d4c5a9] flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <Sword size={26} className="text-[#eebb4d]" />
            <div>
              <h2 className="font-serif font-bold text-xl">{title}</h2>
              <p className="text-sm text-[#f5deb3]/90 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#f5deb3] hover:text-white p-1 rounded hover:bg-black/20 transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Quest Type */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 uppercase tracking-wide">
              Quest Type
            </label>
            <select
              className="w-full px-4 py-3 border border-[#d4c5a9] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
              value={selectedQuestTypeId}
              onChange={e => setSelectedQuestTypeId(e.target.value)}
            >
              {questTypes.map(qt => (
                <option key={qt.id} value={qt.id}>
                  {qt.name} ({qt.exp} base XP)
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Calendar size={18} className="text-amber-700" />
              Due Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-[#d4c5a9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2 flex items-center gap-2 uppercase tracking-wide">
              <FileText size={18} className="text-amber-700" />
              {isStandalone ? 'Task Description (required)' : 'Initial Notes / Context'}
            </label>
            <textarea
              className="w-full px-4 py-3 border border-[#d4c5a9] rounded-lg min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={isStandalone ? "Describe what needs to be done..." : "Any context, background, or reminders..."}
            />
            {isStandalone && note.trim() === '' && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                Required for standalone quests
              </p>
            )}
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
            variant="action"
            onClick={handleSubmit}
            disabled={isStandalone && !note.trim()}
            className="px-8 py-2.5 text-base flex items-center gap-2"
          >
            <Sword size={18} />
            Begin Quest
          </RPGButton>
        </div>
      </div>
    </div>
  );
}