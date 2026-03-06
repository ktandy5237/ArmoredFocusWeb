// src/features/rules/RulesView.tsx
import { JSX, useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, AlertCircle } from 'lucide-react';

import { RPGButton } from '@/components/ui/RPGButton';
import { THEME, METALLIC_SHADOW, METALLIC_FONT } from '@/lib/theme';

import type { Rules, RuleItem, Level } from '@/lib/types';
import { useRulesOperations } from '@/hooks/useRulesOperations';

interface RulesViewProps {
  rules: Rules;
  setRules: React.Dispatch<React.SetStateAction<Rules>>;
}

export default function RulesView({ rules, setRules }: RulesViewProps) {
  const {
    addRule,
    updateRule,
    deleteRule,
    addLevel,
    updateLevel,
    deleteLevel,
    addUniversalReward,
    deleteUniversalReward,
  } = useRulesOperations({ rules, setRules });

  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [newRewardText, setNewRewardText] = useState('');

  return (
    <div className={`min-h-full ${THEME.bg} p-8 overflow-y-auto`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b-4 border-[#d4c5a9] pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#2c241b] mb-3">
            Game Rules & Configuration
          </h1>
          <p className="text-[#8b4513] text-lg italic">
            Adjust XP values, quest types, multipliers, levels, and bonuses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* General Rules */}
            <RuleSection
              title="General Rules"
              category="general"
              items={rules.general}
              addItem={() => addRule('general')}
              updateItem={(id, field, value) => updateRule('general', id, field, value)}
              deleteItem={(id) => deleteRule('general', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('general', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-40">
                    <input
                      type="number"
                      className="w-20 text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.value ?? 0}
                      onChange={e => updateRule('general', item.id, 'value', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">{item.unit}</span>
                  </div>
                </>
              )}
            />

            {/* Card Quest Types */}
            <RuleSection
              title="Card Quest Types"
              category="cardQuestTypes"
              items={rules.cardQuestTypes}
              addItem={() => addRule('cardQuestTypes', { exp: 20 })}
              updateItem={(id, field, value) => updateRule('cardQuestTypes', id, field, value)}
              deleteItem={(id) => deleteRule('cardQuestTypes', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('cardQuestTypes', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="number"
                      className="w-full text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.exp ?? 0}
                      onChange={e => updateRule('cardQuestTypes', item.id, 'exp', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">XP</span>
                  </div>
                </>
              )}
            />

            {/* Standalone Quest Types */}
            <RuleSection
              title="Standalone Quest Types"
              category="standaloneQuestTypes"
              items={rules.standaloneQuestTypes}
              addItem={() => addRule('standaloneQuestTypes', { exp: 15 })}
              updateItem={(id, field, value) => updateRule('standaloneQuestTypes', id, field, value)}
              deleteItem={(id) => deleteRule('standaloneQuestTypes', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('standaloneQuestTypes', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="number"
                      className="w-full text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.exp ?? 0}
                      onChange={e => updateRule('standaloneQuestTypes', item.id, 'exp', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">XP</span>
                  </div>
                </>
              )}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Completion Types */}
            <RuleSection
              title="Completion Types & Bonuses"
              category="completionTypes"
              items={rules.completionTypes}
              addItem={() => addRule('completionTypes', { bonusPercent: 0 })}
              updateItem={(id, field, value) => updateRule('completionTypes', id, field, value)}
              deleteItem={(id) => deleteRule('completionTypes', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('completionTypes', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="number"
                      className="w-full text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.bonusPercent ?? 0}
                      onChange={e => updateRule('completionTypes', item.id, 'bonusPercent', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">%</span>
                  </div>
                </>
              )}
            />

            {/* Multipliers */}
            <RuleSection
              title="Multipliers"
              category="multipliers"
              items={rules.multipliers}
              addItem={() => addRule('multipliers', { value: 10, unit: '%' })}
              updateItem={(id, field, value) => updateRule('multipliers', id, field, value)}
              deleteItem={(id) => deleteRule('multipliers', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('multipliers', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="number"
                      className="w-full text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.value ?? 0}
                      onChange={e => updateRule('multipliers', item.id, 'value', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">{item.unit}</span>
                  </div>
                </>
              )}
            />

            {/* Bonuses */}
            <RuleSection
              title="Bonuses & Streaks"
              category="bonuses"
              items={rules.bonuses}
              addItem={() => addRule('bonuses', { reward: "100", unit: 'Exp', target: 5 })}
              updateItem={(id, field, value) => updateRule('bonuses', id, field, value)}
              deleteItem={(id) => deleteRule('bonuses', id)}
              renderItem={(item) => (
                <>
                  <input
                    className="flex-1 bg-transparent border-b border-[#d4c5a9] focus:outline-none focus:border-[#8b4513] py-1"
                    value={item.name}
                    onChange={e => updateRule('bonuses', item.id, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-40">
                    <input
                      type="number"
                      className="w-16 text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.target ?? 0}
                      onChange={e => updateRule('bonuses', item.id, 'target', Number(e.target.value))}
                      placeholder="Target"
                    />
                    <span className="text-sm text-stone-500">→</span>
                    <input
                      type="number"
                      className="w-16 text-right border border-[#d4c5a9] rounded px-2 py-1"
                      value={item.reward ?? 0}
                      onChange={e => updateRule('bonuses', item.id, 'reward', Number(e.target.value))}
                    />
                    <span className="text-sm text-stone-500">{item.unit}</span>
                  </div>
                </>
              )}
            />

            {/* Level Progression Table */}
            <div className="bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#2c241b] text-[#f5deb3] p-4 flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg">Level Progression</h3>
                <RPGButton onClick={addLevel} className="text-sm px-4 py-1.5">
                  + Add Level
                </RPGButton>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#e8e4d9] text-stone-700 uppercase text-xs">
                    <tr>
                      <th className="p-3 text-left">Level</th>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Exp Required</th>
                      <th className="p-3 text-left">Reward</th>
                      <th className="p-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.levels.map(level => (
                      <tr key={level.id} className="border-b border-stone-200 hover:bg-[#fdfbf7]">
                        <td className="p-3 font-bold">{level.level}</td>
                        <td className="p-3">
                          <input
                            className="w-full bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#8b4513] py-1"
                            value={level.title}
                            onChange={e => updateLevel(level.id, 'title', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            className="w-24 border border-[#d4c5a9] rounded px-2 py-1 text-right"
                            value={level.exp}
                            onChange={e => updateLevel(level.id, 'exp', Number(e.target.value))}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            className="w-full bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#8b4513] py-1"
                            value={level.reward}
                            onChange={e => updateLevel(level.id, 'reward', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteLevel(level.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Universal Level Rewards */}
            <div className="bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-xl overflow-hidden shadow-md">
              <div className="bg-[#2c241b] text-[#f5deb3] p-4 flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg">Universal Level-Up Rewards</h3>
              </div>
              <div className="p-5 space-y-3">
                {rules.universalLevelRewards.map(reward => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#d4c5a9]"
                  >
                    <span className="text-[#2c241b] font-medium">{reward.reward}</span>
                    <button
                      onClick={() => deleteUniversalReward(reward.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-3 mt-4">
                  <input
                    className="flex-1 border border-[#d4c5a9] rounded-lg px-4 py-2 focus:outline-none focus:border-[#8b4513]"
                    placeholder="New universal reward (e.g. +10 Relationship Cap)"
                    value={newRewardText}
                    onChange={e => setNewRewardText(e.target.value)}
                  />
                  <RPGButton
                    onClick={() => {
                      if (newRewardText.trim()) {
                        addUniversalReward(newRewardText.trim());
                        setNewRewardText('');
                      }
                    }}
                    disabled={!newRewardText.trim()}
                  >
                    Add Reward
                  </RPGButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
//  Reusable Rule Section Component
// ────────────────────────────────────────────────

interface RuleSectionProps<T extends RuleItem> {
  title: string;
  category: keyof Rules;
  items: T[];
  addItem: () => void;
  updateItem: (id: string, field: string, value: any) => void;
  deleteItem: (id: string) => void;
  renderItem: (item: T) => JSX.Element;
}

function RuleSection<T extends RuleItem>({
  title,
  category,
  items,
  addItem,
  updateItem,
  deleteItem,
  renderItem,
}: RuleSectionProps<T>) {
  return (
    <div className="bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-xl overflow-hidden shadow-md">
      <div className="bg-[#2c241b] text-[#f5deb3] p-4 flex justify-between items-center">
        <h3 className="font-serif font-bold text-lg">{title}</h3>
        <RPGButton onClick={addItem} className="text-sm px-4 py-1.5 flex items-center gap-2">
          <Plus size={16} />
          Add New
        </RPGButton>
      </div>

      <div className="p-5 space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-stone-500 italic py-8">
            No {title.toLowerCase()} defined yet
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-3 rounded-lg border border-[#d4c5a9] hover:border-[#8b4513] transition-colors group"
            >
              {renderItem(item)}

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}