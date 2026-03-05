// src/modals/DrawCardModal.tsx
import { useState } from 'react';
import {
  X, UserPlus, Briefcase, Layers, CheckCircle
} from 'lucide-react';

import { RPGButton } from '@/src/components/ui/RPGButton';
import { THEME } from '@/src/lib/theme';
import { generateId } from '@/src/lib/utils';

import type { Client } from '@/src/lib/types'; // ← create this file if you want strong typing

interface DrawCardModalProps {
  onClose: () => void;
  onSave: (newClient: Client) => void;
  rules: any; // ← your rules object (for new card XP)
}

export default function DrawCardModal({ onClose, onSave, rules }: DrawCardModalProps) {
  const [primarySide, setPrimarySide] = useState<'Client' | 'Business'>('Client');

  const [newCardData, setNewCardData] = useState<any>({
    id: generateId(),
    primarySide,
    name: '',
    phone: '',
    email: '',
    address: '',
    mailingAddress: '',
    dob: '',
    license: '',
    residenceType: 'Homeowner',
    isCOI: false,
    isBNI: false,
    userRating: 0,
    relationshipScore: 0,
    clientSide: {
      notes: [],
      logs: [],
      quests: [],
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
  });

  // Helper to toggle array items (LOB, carriers, etc.)
  const toggleNewCardItem = (side: 'Client' | 'Business', field: string, item: string) => {
    setNewCardData((prev: any) => {
      const target = side === 'Client' ? prev.clientSide : prev.businessSide;
      const list = target[field] || [];
      const newList = list.includes(item)
        ? list.filter((i: string) => i !== item)
        : [...list, item];

      return {
        ...prev,
        [side === 'Client' ? 'clientSide' : 'businessSide']: {
          ...target,
          [field]: newList,
        },
      };
    });
  };

  const handleSave = () => {
    // Basic validation
    if (primarySide === 'Client' && !newCardData.name.trim()) {
      alert('Client name is required');
      return;
    }
    if (primarySide === 'Business' && !newCardData.businessSide.businessName.trim()) {
      alert('Business name is required');
      return;
    }

    // Award XP for drawing new card
    const newCardExp = rules?.general?.find((r: any) => r.name === 'New Card Drawn')?.value || 25;

    // Prepare final client object
    const finalClient = {
      ...newCardData,
      primarySide,
      // You can add more defaults / cleanups here
    };

    // In real app you would:
    // - add to clients array
    // - add log entry
    // - add XP to userStats
    // Here we just pass it up to parent
    onSave(finalClient);

    // Optional: show success toast / message
    console.log(`New card created (+${newCardExp} XP)`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-[#fdfbf7] w-full max-w-5xl rounded-xl shadow-2xl border-4 border-[#d4c5a9] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className={`${THEME.header} p-5 border-b border-[#d4c5a9] flex justify-between items-center`}>
          <h2 className="font-serif font-bold text-2xl flex items-center gap-3">
            <Layers size={28} className="text-[#eebb4d]" />
            Draw New Card
          </h2>
          <button
            onClick={onClose}
            className="text-[#f5deb3] hover:text-white transition-colors p-1 rounded hover:bg-black/20"
          >
            <X size={28} />
          </button>
        </div>

        {/* Side selector */}
        <div className="p-6 border-b border-[#d4c5a9] bg-[#fdfbf7]">
          <p className="text-center text-sm text-stone-600 mb-4 font-medium">
            Choose which side will be the **primary** (front) side of this card
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => setPrimarySide('Client')}
              className={`p-5 rounded-xl border-2 transition-all font-medium text-lg flex flex-col items-center gap-2 ${
                primarySide === 'Client'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-inner'
                  : 'border-stone-300 text-stone-500 hover:border-stone-400'
              }`}
            >
              <UserPlus size={32} />
              Client Side (Person)
            </button>

            <button
              onClick={() => setPrimarySide('Business')}
              className={`p-5 rounded-xl border-2 transition-all font-medium text-lg flex flex-col items-center gap-2 ${
                primarySide === 'Business'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-inner'
                  : 'border-stone-300 text-stone-500 hover:border-stone-400'
              }`}
            >
              <Briefcase size={32} />
              Business Side (Company)
            </button>
          </div>
        </div>

        {/* Main content - two columns */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Client Side */}
          <div className={`space-y-6 p-5 rounded-xl border-2 ${
            primarySide === 'Client'
              ? 'border-emerald-500 bg-emerald-50/40'
              : 'border-stone-200 bg-stone-50/50 opacity-75 grayscale'
          }`}>
            <h3 className="font-serif font-bold text-xl text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-2">
              <UserPlus size={24} />
              Client Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
                <input
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newCardData.name}
                  onChange={e => setNewCardData({ ...newCardData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                  <input
                    className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                    value={newCardData.phone}
                    onChange={e => setNewCardData({ ...newCardData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                    value={newCardData.dob}
                    onChange={e => setNewCardData({ ...newCardData, dob: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                  value={newCardData.email}
                  onChange={e => setNewCardData({ ...newCardData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
                <input
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                  value={newCardData.address}
                  onChange={e => setNewCardData({ ...newCardData, address: e.target.value })}
                  placeholder="123 Main St, Rapid City, SD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Residence Type</label>
                <select
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg bg-white"
                  value={newCardData.residenceType}
                  onChange={e => setNewCardData({ ...newCardData, residenceType: e.target.value })}
                >
                  <option>Homeowner</option>
                  <option>Renter</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Client LOB */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Lines of Business</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Home', 'Auto', 'Life', 'Commercial', 'Umbrella', 'Health', 'Toys', 'Pet', 'Other'].map(lob => (
                    <label key={lob} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newCardData.clientSide.lob.includes(lob)}
                        onChange={() => toggleNewCardItem('Client', 'lob', lob)}
                        className="rounded border-stone-400 text-emerald-600 focus:ring-emerald-500"
                      />
                      {lob}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Business Side */}
          <div className={`space-y-6 p-5 rounded-xl border-2 ${
            primarySide === 'Business'
              ? 'border-blue-500 bg-blue-50/40'
              : 'border-stone-200 bg-stone-50/50 opacity-75 grayscale'
          }`}>
            <h3 className="font-serif font-bold text-xl text-blue-900 flex items-center gap-2 border-b border-blue-200 pb-2">
              <Briefcase size={24} />
              Business Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Business Name *</label>
                <input
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCardData.businessSide.businessName}
                  onChange={e =>
                    setNewCardData({
                      ...newCardData,
                      businessSide: { ...newCardData.businessSide, businessName: e.target.value },
                    })
                  }
                  placeholder="Acme Insurance LLC"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Business Phone</label>
                  <input
                    className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                    value={newCardData.businessSide.phone}
                    onChange={e =>
                      setNewCardData({
                        ...newCardData,
                        businessSide: { ...newCardData.businessSide, phone: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">EIN / Tax ID</label>
                  <input
                    className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                    value={newCardData.businessSide.ein}
                    onChange={e =>
                      setNewCardData({
                        ...newCardData,
                        businessSide: { ...newCardData.businessSide, ein: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Year Established</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-[#d4c5a9] rounded-lg"
                  value={newCardData.businessSide.established}
                  onChange={e =>
                    setNewCardData({
                      ...newCardData,
                      businessSide: { ...newCardData.businessSide, established: e.target.value },
                    })
                  }
                  placeholder="2015"
                />
              </div>

              {/* Business LOB */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Business Lines</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['GL', 'BoP', 'Workers Comp', 'Commercial Auto', 'E&O', 'Cyber', 'Umbrella', 'Other'].map(lob => (
                    <label key={lob} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newCardData.businessSide.lob.includes(lob)}
                        onChange={() => toggleNewCardItem('Business', 'lob', lob)}
                        className="rounded border-stone-400 text-blue-600 focus:ring-blue-500"
                      />
                      {lob}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 border-t border-[#d4c5a9] bg-[#fdfbf7] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newCardData.isCOI}
                onChange={e => setNewCardData({ ...newCardData, isCOI: e.target.checked })}
                className="rounded border-[#d4c5a9] text-[#8b4513] focus:ring-[#8b4513]"
              />
              <span className="font-medium">Center of Influence (COI)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newCardData.isBNI}
                onChange={e => setNewCardData({ ...newCardData, isBNI: e.target.checked })}
                className="rounded border-[#d4c5a9] text-[#8b4513] focus:ring-[#8b4513]"
              />
              <span className="font-medium">BNI Member</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-stone-600 font-medium hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <RPGButton onClick={handleSave} variant="gold" className="px-8 py-3 text-lg">
              Add to Binder
            </RPGButton>
          </div>
        </div>
      </div>
    </div>
  );
}