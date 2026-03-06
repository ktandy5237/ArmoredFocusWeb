// src/hooks/useClientOperations.ts
import { useCallback } from 'react';
import { generateId } from '@/lib/utils';
import type { Client, LogEntry, Rules } from '@/lib/types';

interface UseClientOperationsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  dailyLog: LogEntry[];
  setDailyLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  rules: Rules;
  // optional: userStats / setUserStats if you want to award XP here
}

export function useClientOperations({
  clients,
  setClients,
  dailyLog,
  setDailyLog,
  rules,
}: UseClientOperationsProps) {
  // ────────────────────────────────────────────────
  //  Helper: Check for household connections by address
  // ────────────────────────────────────────────────
  const checkHouseholds = useCallback((clientList: Client[]): Client[] => {
    const addressMap: Record<string, { id: string; name: string }[]> = {};

    clientList.forEach(c => {
      if (c.address && c.address.trim().length > 5) {
        const key = c.address.trim().toLowerCase();
        if (!addressMap[key]) addressMap[key] = [];
        addressMap[key].push({
          id: c.id,
          name: c.name || c.businessSide?.businessName || 'Unnamed',
        });
      }
    });

    return clientList.map(c => {
      if (!c.address || c.address.trim().length <= 5) return c;

      const key = c.address.trim().toLowerCase();
      const housemates = addressMap[key]?.filter(h => h.id !== c.id) || [];

      if (housemates.length > 0) {
        return {
          ...c,
          connections: {
            ...c.connections,
            household: housemates,
          },
        };
      }

      return c;
    });
  }, []);

  // ────────────────────────────────────────────────
  //  Add new client card (from Draw Card modal)
  // ────────────────────────────────────────────────
  const addNewCard = useCallback((newCard: Partial<Client>) => {
    const cardExp = rules.general.find(r => r.name === 'New Card Drawn')?.value || 25;

    const finalCard: Client = {
      id: generateId(),
      primarySide: newCard.primarySide || 'Client',
      name: '',
      phone: '',
      email: '',
      address: '',
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
      ...newCard,
    };

    // Log creation
    const logEntry: LogEntry = {
      id: generateId(),
      clientName: finalCard.name || finalCard.businessSide?.businessName || 'New Card',
      questType: 'New Card Drawn',
      exp: cardExp,
      date: new Date().toISOString(),
    };

    // Add system log to card itself
    finalCard.clientSide.logs.unshift(logEntry);

    setClients(prev => {
      const updated = [...prev, finalCard];
      return checkHouseholds(updated);
    });

    setDailyLog(prev => [logEntry, ...prev]);

    // You could also award XP here if you pass setUserStats
    // setUserStats(p => ({ ...p, exp: p.exp + cardExp }));

    return finalCard;
  }, [rules, setClients, setDailyLog, checkHouseholds]);

  // ────────────────────────────────────────────────
  //  Update existing client
  // ────────────────────────────────────────────────
  const updateClient = useCallback((updatedClient: Client) => {
    setClients(prev =>
      checkHouseholds(
        prev.map(c => (c.id === updatedClient.id ? updatedClient : c))
      )
    );
  }, [setClients, checkHouseholds]);

  // ────────────────────────────────────────────────
  //  Merge two cards (target absorbed into source → target deleted)
  // ────────────────────────────────────────────────
  const mergeClients = useCallback((
    sourceId: string,     // card that survives
    targetId: string      // card that gets deleted
  ) => {
    setClients(prev => {
      const source = prev.find(c => c.id === sourceId);
      const target = prev.find(c => c.id === targetId);

      if (!source || !target) return prev;

      // Merge logic: prioritize source, concatenate arrays, take non-empty values
      const merged: Client = {
        ...source,
        name: source.name || target.name,
        phone: source.phone || target.phone,
        email: source.email || target.email,
        address: source.address || target.address,
        mailingAddress: source.mailingAddress || target.mailingAddress,
        dob: source.dob || target.dob,
        license: source.license || target.license,
        isCOI: source.isCOI || target.isCOI,
        isBNI: source.isBNI || target.isBNI,
        relationshipScore: Math.max(source.relationshipScore, target.relationshipScore),
        clientSide: {
          ...source.clientSide,
          notes: [...source.clientSide.notes, ...target.clientSide.notes],
          logs: [...source.clientSide.logs, ...target.clientSide.logs],
          quests: [...source.clientSide.quests, ...target.clientSide.quests],
          lob: [...new Set([...source.clientSide.lob, ...target.clientSide.lob])],
          carriers: [...new Set([...source.clientSide.carriers, ...target.clientSide.carriers])],
        },
        businessSide: {
          ...source.businessSide,
          businessName: source.businessSide.businessName || target.businessSide.businessName,
          phone: source.businessSide.phone || target.businessSide.phone,
          ein: source.businessSide.ein || target.businessSide.ein,
          established: source.businessSide.established || target.businessSide.established,
          occupancy: source.businessSide.occupancy || target.businessSide.occupancy,
          notes: [...source.businessSide.notes, ...target.businessSide.notes],
          logs: [...source.businessSide.logs, ...target.businessSide.logs],
          quests: [...source.businessSide.quests, ...target.businessSide.quests],
          lob: [...new Set([...source.businessSide.lob, ...target.businessSide.lob])],
          carriers: [...new Set([...source.businessSide.carriers, ...target.businessSide.carriers])],
        },
        connections: {
          referredBy: [...new Set([...source.connections.referredBy, ...target.connections.referredBy])],
          referrals: [...new Set([...source.connections.referrals, ...target.connections.referrals])],
          household: [...new Set([...source.connections.household, ...target.connections.household])],
        },
      };

      // Log the merge on the surviving card
      const mergeLog: LogEntry = {
        id: generateId(),
        clientName: 'System',
        questType: `Merged with ${target.name || target.businessSide?.businessName || 'another card'}`,
        exp: 0,
        date: new Date().toISOString(),
      };

      merged.clientSide.logs.unshift(mergeLog);

      // Remove target, keep updated source
      const filtered = prev.filter(c => c.id !== targetId);
      return checkHouseholds(
        filtered.map(c => (c.id === sourceId ? merged : c))
      );
    });

    // Optional: global log
    setDailyLog(prev => [
      {
        id: generateId(),
        clientName: 'System',
        questType: 'Card Merge Performed',
        exp: 0,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [setClients, setDailyLog, checkHouseholds]);

  // ────────────────────────────────────────────────
  //  Delete a client card
  // ────────────────────────────────────────────────
  const deleteClient = useCallback((clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));

    setDailyLog(prev => [
      {
        id: generateId(),
        clientName: 'System',
        questType: 'Card Deleted',
        exp: 0,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [setClients, setDailyLog]);

  return {
    addNewCard,
    updateClient,
    mergeClients,
    deleteClient,
    checkHouseholds,
  };
}