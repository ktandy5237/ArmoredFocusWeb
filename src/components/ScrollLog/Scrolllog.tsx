// src/components/ScrollLog.tsx
import { useState } from 'react';
import { Scroll, X, ChevronUp, ChevronDown, Search as SearchIcon } from 'lucide-react';
import { formatDisplayDate } from '@/lib/utils';

interface ScrollLogProps {
  dailyLog: Array<{
    id: string;
    clientName: string;
    questType: string;
    exp: number;
    date: string;
    note?: string;
  }>;
}

export default function ScrollLog({ dailyLog }: ScrollLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterText, setFilterText] = useState('');

  // Check if a date is today (for collapsed mode default)
  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Filter logs
  const filteredLogs = dailyLog.filter(log => {
    // In collapsed mode: show only today's entries unless expanded
    if (!isExpanded && !isToday(log.date)) return false;

    const matches = 
      log.clientName.toLowerCase().includes(filterText.toLowerCase()) ||
      log.questType.toLowerCase().includes(filterText.toLowerCase()) ||
      (log.note && log.note.toLowerCase().includes(filterText.toLowerCase()));

    return matches;
  });

  return (
    <div 
      className={`relative transition-all duration-500 ease-in-out ${
        isExpanded 
          ? 'fixed inset-4 z-50 flex flex-col' 
          : 'flex-1 flex flex-col min-h-0'
      }`}
    >
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="absolute inset-0 bg-black/60 -z-10 rounded-xl" 
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div 
        className={`flex flex-col bg-[#f5e6d3] border-[6px] border-[#8b4513] rounded-lg shadow-2xl relative overflow-hidden ${
          isExpanded ? 'w-full max-w-4xl mx-auto h-full' : 'h-full'
        }`}
      >
        {/* Top scroll roll */}
        <div className="h-4 bg-gradient-to-b from-[#5d4037] to-[#8d6e63] border-b border-[#3e2723] shadow-md relative z-10 shrink-0" />

        {/* Header */}
        <div className="bg-[#e6d5c1] p-4 border-b border-[#d4c5a9] flex justify-between items-center shrink-0 shadow-sm">
          <h3 className="font-serif font-bold text-[#3e2723] text-lg flex items-center gap-3">
            <Scroll size={22} className="text-[#8b4513]" />
            {isExpanded ? 'Grand Archive of Deeds' : "Today's Scroll"}
          </h3>

          <div className="flex items-center gap-3">
            {isExpanded && (
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                <input
                  className="pl-10 pr-4 py-2 text-sm bg-white border border-[#d4c5a9] rounded-lg focus:outline-none focus:border-[#8b4513] font-serif w-64"
                  placeholder="Search archives..."
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                />
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#8b4513] hover:bg-[#d7ccc8] p-2 rounded transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              {isExpanded ? (
                <>
                  <X size={20} />
                  Close Archive
                </>
              ) : (
                <>
                  <ChevronUp size={18} />
                  Expand Archive
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content area with parchment texture */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f5e6d3] relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238b4513' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            backgroundRepeat: 'repeat',
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center text-[#a1887f] italic py-10">
              The scroll is blank... no deeds recorded today.
            </div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id}
                className="border-b border-[#d7ccc8] pb-3 last:border-0 last:pb-0 relative z-10"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-[#3e2723] font-serif">
                    {log.clientName}
                  </div>
                  <div className="text-xs text-[#8d6e63] font-mono whitespace-nowrap">
                    {formatDisplayDate(log.date)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5d4037] italic">
                    {log.questType}
                  </span>
                  {log.exp > 0 && (
                    <span className="font-bold text-[#2e7d32] bg-[#c8e6c9] px-2 py-0.5 rounded text-xs border border-[#81c784]">
                      +{log.exp} XP
                    </span>
                  )}
                </div>

                {log.note && (
                  <div className="text-xs text-[#5d4037] mt-2 bg-[#d7ccc8]/30 p-2 rounded italic">
                    "{log.note}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom scroll roll */}
        <div className="h-6 bg-gradient-to-t from-[#5d4037] to-[#8d6e63] border-t border-[#3e2723] shadow-[0_-4px_10px_rgba(0,0,0,0.3)] relative z-10 shrink-0" />
      </div>
    </div>
  );
}