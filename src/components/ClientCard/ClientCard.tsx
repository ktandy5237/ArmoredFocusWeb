// src/components/ClientCard.tsx
import { useState, useEffect } from 'react';
import {
  RotateCcw, Edit2, X, CheckCircle, Merge, UserPlus, Briefcase,
  Scroll, Sword, ChevronRight, ChevronLeft, Ban
} from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import { RelationshipBar } from '@/src/components/ui/RelationshipBar';
import { formatPhoneNumber, getDaysOut, formatDisplayDate } from '@/src/lib/utils';

interface ClientCardProps {
  client: any;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updatedClient: any) => void;
  onMerge?: (client: any) => void; // optional callback to open merge modal
}

export default function ClientCard({
  client,
  isExpanded,
  onToggle,
  onUpdate,
  onMerge,
}: ClientCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [visibleFace, setVisibleFace] = useState(client.primarySide || 'Client');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(client);

  const activeFace = isExpanded ? visibleFace : (client.primarySide || 'Client');
  const isClientFace = activeFace === 'Client';
  const sideData = isClientFace ? editData.clientSide : editData.businessSide;

  const activeQuests = sideData?.quests?.filter((q: any) =>
    q.status !== 'Completed' && q.status !== 'Cancelled'
  ) || [];

  const trackedQuest = activeQuests.find((q: any) => q.tracked) || activeQuests[0];

  useEffect(() => {
    if (isExpanded) {
      setVisibleFace(client.primarySide || 'Client');
      setIsFlipped(false);
    }
  }, [isExpanded, client.primarySide]);

  useEffect(() => {
    if (!isEditing) setEditData(client);
  }, [client, isEditing]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setVisibleFace(isClientFace ? 'Business' : 'Client');
  };

  const handleSaveEdit = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleEditChange = (field: string, value: any, side?: 'Client' | 'Business') => {
    setEditData(prev => {
      if (side) {
        return {
          ...prev,
          [side === 'Client' ? 'clientSide' : 'businessSide']: {
            ...prev[side === 'Client' ? 'clientSide' : 'businessSide'],
            [field]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  // Quick urgency color for quest badge
  const getQuestBadgeClass = (quest?: any) => {
    if (!quest) return 'bg-gray-100 text-gray-600 border-gray-300';
    if (quest.status === 'Cooldown') return 'bg-blue-100 text-blue-800 border-blue-300';
    const days = getDaysOut(quest.dueDate);
    if (days < 0) return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    if (days <= 1) return 'bg-red-100 text-red-800 border-red-300';
    if (days <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  // ────────────────────────────────────────────────
  // Compact mode (shown in lists / grids)
  // ────────────────────────────────────────────────
  if (!isExpanded) {
    return (
      <div
        onClick={onToggle}
        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
          client.isStandalone
            ? 'border-purple-500 bg-purple-50'
            : client.isCOI
              ? 'border-4 border-slate-700 bg-slate-50'
              : client.isBNI
                ? 'border-4 border-yellow-500 bg-amber-50'
                : isClientFace
                  ? sideData?.lob?.length > 0
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-stone-400 bg-stone-50'
                  : sideData?.lob?.length > 0
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-orange-500 bg-orange-50'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Name & Type */}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">
              {isClientFace ? editData.name || 'Unnamed' : editData.businessSide?.businessName || 'Unnamed Business'}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {formatPhoneNumber(isClientFace ? editData.phone : editData.businessSide?.phone) || '—'}
            </div>
          </div>

          {/* Quest indicator */}
          {trackedQuest && (
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getQuestBadgeClass(trackedQuest)}`}>
              {trackedQuest.type?.length > 20
                ? trackedQuest.type.slice(0, 17) + '…'
                : trackedQuest.type || 'Quest'}
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-1.5 shrink-0">
            {client.isCOI && <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">COI</span>}
            {client.isBNI && <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">BNI</span>}
            {client.isStandalone && <span className="text-[10px] bg-purple-100 px-1.5 py-0.5 rounded">Standalone</span>}
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Expanded / detailed mode
  // ────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-xl border border-stone-300 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 text-white p-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`px-4 py-1.5 rounded-lg font-semibold text-sm ${
            client.isStandalone ? 'bg-purple-700' :
            isClientFace ? 'bg-emerald-700' : 'bg-blue-800'
          }`}>
            {client.isStandalone ? 'Standalone Quest' : isClientFace ? 'Client Card' : 'Business Card'}
          </div>

          {!client.isStandalone && (
            <button
              onClick={handleFlip}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm transition-colors"
            >
              <RotateCcw size={16} />
              Flip Card
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onMerge && !client.isStandalone && (
            <button
              onClick={() => onMerge(client)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition-colors"
            >
              <Merge size={16} />
              Merge
            </button>
          )}

          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
              <RPGButton onClick={handleSaveEdit} variant="action" className="px-5 py-1.5">
                Save Changes
              </RPGButton>
            </>
          ) : (
            <>
              {!client.isStandalone && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </button>
              )}
              <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Core Info + Relationship */}
          <div className="space-y-6">
            {/* Name & Tags */}
            <div>
              {isEditing ? (
                <input
                  className="text-2xl font-serif font-bold w-full border-b-2 border-stone-400 focus:outline-none focus:border-emerald-600"
                  value={isClientFace ? editData.name : editData.businessSide?.businessName || ''}
                  onChange={e =>
                    handleEditChange(
                      isClientFace ? 'name' : 'businessName',
                      e.target.value,
                      isClientFace ? undefined : 'Business'
                    )
                  }
                  placeholder={isClientFace ? 'Client Name' : 'Business Name'}
                />
              ) : (
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {isClientFace ? editData.name || 'Unnamed Client' : editData.businessSide?.businessName || 'Unnamed Business'}
                </h2>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {client.isCOI && <span className="px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-medium">COI</span>}
                {client.isBNI && <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">BNI</span>}
                {client.isStandalone && <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Standalone Task</span>}
              </div>
            </div>

            {/* Relationship Score */}
            {!client.isStandalone && (
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-stone-700">Relationship Score</span>
                  <span className="text-lg font-bold text-[#8b4513]">{editData.relationshipScore || 0}/100</span>
                </div>
                <RelationshipBar score={editData.relationshipScore || 0} />
              </div>
            )}

            {/* Basic Fields */}
            <div className="space-y-4">
              {isClientFace ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">Phone</label>
                      {isEditing ? (
                        <input
                          className="w-full px-3 py-2 border border-stone-300 rounded"
                          value={editData.phone || ''}
                          onChange={e => handleEditChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="font-mono">{formatPhoneNumber(editData.phone) || '—'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">DOB</label>
                      {isEditing ? (
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-stone-300 rounded"
                          value={editData.dob || ''}
                          onChange={e => handleEditChange('dob', e.target.value)}
                        />
                      ) : (
                        <div>{editData.dob || '—'}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-stone-300 rounded"
                        value={editData.email || ''}
                        onChange={e => handleEditChange('email', e.target.value)}
                      />
                    ) : (
                      <div className="break-all">{editData.email || '—'}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">Address</label>
                    {isEditing ? (
                      <input
                        className="w-full px-3 py-2 border border-stone-300 rounded"
                        value={editData.address || ''}
                        onChange={e => handleEditChange('address', e.target.value)}
                      />
                    ) : (
                      <div>{editData.address || '—'}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">Business Phone</label>
                    {isEditing ? (
                      <input
                        className="w-full px-3 py-2 border border-stone-300 rounded"
                        value={editData.businessSide?.phone || ''}
                        onChange={e => handleEditChange('phone', e.target.value, 'Business')}
                      />
                    ) : (
                      <div className="font-mono">{formatPhoneNumber(editData.businessSide?.phone) || '—'}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 uppercase tracking-wide">EIN</label>
                    {isEditing ? (
                      <input
                        className="w-full px-3 py-2 border border-stone-300 rounded"
                        value={editData.businessSide?.ein || ''}
                        onChange={e => handleEditChange('ein', e.target.value, 'Business')}
                      />
                    ) : (
                      <div>{editData.businessSide?.ein || '—'}</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Quests & Activity */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border border-amber-200">
              <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-amber-900">
                <Sword size={20} className="text-amber-700" />
                Active Quests ({activeQuests.length})
              </h3>

              {activeQuests.length === 0 ? (
                <div className="text-center py-6 text-stone-500 italic">
                  No active quests on this side
                </div>
              ) : (
                <div className="space-y-3">
                  {activeQuests.map((quest: any) => (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-lg border ${getQuestBadgeClass(quest)} flex justify-between items-center`}
                    >
                      <div>
                        <div className="font-medium">{quest.type}</div>
                        <div className="text-xs mt-0.5">
                          Due: {formatDisplayDate(quest.dueDate)}
                        </div>
                      </div>
                      {quest.tracked ? (
                        <CheckCircle size={18} className="text-emerald-600" />
                      ) : (
                        <button
                          onClick={() => {
                            // TODO: implement track logic
                            console.log('Track quest', quest.id);
                          }}
                          className="text-xs text-stone-500 hover:text-stone-800"
                        >
                          Track
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <RPGButton
                onClick={() => alert('Start quest modal – not wired yet')}
                className="justify-center"
              >
                Start New Quest
              </RPGButton>

              {activeQuests.length > 0 && (
                <RPGButton
                  variant="action"
                  onClick={() => alert('Complete/Continue quest – not wired yet')}
                  className="justify-center"
                >
                  Complete / Progress Quest
                </RPGButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}