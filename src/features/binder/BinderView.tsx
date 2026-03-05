// src/features/binder/BinderView.tsx
import { useState, useMemo } from 'react';
import {
  Search, List, ChevronDown, ChevronUp, Plus, Upload, RotateCcw, Merge, X,
  Book, Layers
} from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import { BINDER_THEME } from '@/src/lib/theme';
import { formatPhoneNumber } from '@/src/lib/utils';
import ClientCard from '@/src/components/ClientCard/ClientCard';

// ────────────────────────────────────────────────
//   MAIN BINDER VIEW
// ────────────────────────────────────────────────

interface BinderViewProps {
  clients: any[];
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  // You will likely add more props later: setClients, setModals, etc.
}

export default function BinderView({
  clients,
  expandedCardId,
  setExpandedCardId,
}: BinderViewProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Alphabetical');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Filter & sort logic
  const sortedAndFilteredClients = useMemo(() => {
    let list = [...clients].filter(c => !c.isStandalone); // hide standalone quests in binder

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(c => {
        const name = (c.name || c.businessSide?.businessName || '').toLowerCase();
        const phone = (c.phone || c.businessSide?.phone || '').toLowerCase();
        const address = (c.address || '').toLowerCase();
        return name.includes(term) || phone.includes(term) || address.includes(term);
      });
    }

    // Sorting
    const getName = (c: any) => c.name || c.businessSide?.businessName || 'zzz';
    const getDue = (c: any) => {
      const side = c.primarySide === 'Client' ? c.clientSide : c.businessSide;
      const q = side?.quests?.find((q: any) => q.tracked);
      return q ? new Date(q.dueDate) : new Date('2099-12-31');
    };

    switch (sort) {
      case 'Alphabetical':
        list.sort((a, b) => getName(a).localeCompare(getName(b)));
        break;
      case 'Due Date':
        list.sort((a, b) => getDue(a).getTime() - getDue(b).getTime());
        break;
      case 'Relationship Score':
        list.sort((a, b) => (b.relationshipScore || 0) - (a.relationshipScore || 0));
        break;
      // ... you can add more sort options later
      default:
        break;
    }

    return list;
  }, [clients, search, sort]);

    function handleUpdateClient(updatedClient: any): void {
        throw new Error('Function not implemented.');
    }

    function setSelectedClient(c: any) {
        throw new Error('Function not implemented.');
    }

    function setModals(arg0: (m: any) => any) {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b-4 border-purple-900/30 pb-6">
        <div className="flex items-center gap-5">
          <div className={`flex flex-col gap-2 border-r-4 border-stone-400 pr-5 ${BINDER_THEME.spine} p-3 rounded-l-lg`}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${BINDER_THEME.ring} shadow-sm border border-stone-500`} />
            ))}
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-purple-100 drop-shadow-md">The Binder</h1>
            <p className="text-purple-200/80 italic mt-1">Repository of Known Associates</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <RPGButton
            onClick={() => alert("Draw New Card – modal not wired yet")}
            className="flex items-center gap-2"
          >
            <Layers size={16} /> Draw New Card
          </RPGButton>

          <RPGButton
            variant="gold"
            onClick={() => alert("Booster Pack import – modal not wired yet")}
            className="flex items-center gap-2"
          >
            <Upload size={16} /> Add Booster Pack
          </RPGButton>
        </div>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-purple-900/30 p-4 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
          <input
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-purple-400 rounded-xl focus:outline-none focus:border-purple-600 text-purple-950 placeholder-purple-400/70"
            placeholder="Search by name, phone, address, business..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-b from-purple-600 to-purple-800 text-white rounded-xl border-2 border-purple-900 hover:brightness-110 transition-all whitespace-nowrap"
          >
            <List size={16} />
            Sort: {sort}
            {isSortMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isSortMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-lg shadow-2xl z-50 overflow-hidden">
              {[
                'Alphabetical',
                'Due Date',
                'Relationship Score',
                'Client Side',
                'Business Side',
                'CoI',
                'BNI',
                'Farmers First',
                'Exp Earned'
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setSort(opt);
                    setIsSortMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 hover:bg-[#f5e6d3] text-[#2c241b] border-b border-stone-200 last:border-0 flex justify-between items-center ${
                    sort === opt ? 'bg-[#e8e4d9] font-bold' : ''
                  }`}
                >
                  {opt}
                  {sort === opt && <span className="text-emerald-600">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card list */}
      {sortedAndFilteredClients.length === 0 ? (
        <div className="text-center py-20 opacity-70 text-purple-200">
          <Book size={72} className="mx-auto mb-6 opacity-60" strokeWidth={1.2} />
          <h2 className="text-2xl font-serif font-bold mb-3">Binder is Empty</h2>
          <p className="text-lg">No contacts or businesses added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedAndFilteredClients.map(client => (
            <ClientCard
                key={client.id}
                client={client}
                isExpanded={expandedCardId === client.id}
                onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)}
                onUpdate={handleUpdateClient}           // from App or parent
                onMerge={(c) => {
                    setSelectedClient(c);
                    setModals(m => ({ ...m, mergeCard: true }));
                }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Quick helper (you can move to utils later)
function getDaysOut(dateStr?: string): number {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dateStr);
  due.setHours(0,0,0,0);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}