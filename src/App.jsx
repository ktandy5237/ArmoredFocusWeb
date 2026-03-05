import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Shield, Scroll, Sword, Map, Users, Archive, 
  Plus, Search, Filter, ArrowRight, Settings, 
  CheckCircle, X, Save, RefreshCw, AlertCircle,
  Home, Link as LinkIcon, UserPlus, ArrowUpRight, ArrowDownLeft,
  Briefcase, Star, Upload, Trash2, Edit2, Calendar, ChevronRight,
  Database, FileText, FilePlus, RotateCcw, Pin, Ban,
  Link2, Coins, Book, Compass, Award, Target, Layers, List, HelpCircle,
  Clock, Percent, DollarSign, Activity, ChevronDown, ChevronUp, Merge
} from 'lucide-react';

// --- THEME CONSTANTS (Global / Parchment) ---
const THEME = {
  bg: 'bg-[#e8e4d9]', // Parchment base
  panel: 'bg-[#fdfbf7] border-2 border-[#d4c5a9]', 
  header: 'bg-[#2c241b] text-[#eebb4d]', // Dark leather & Gold text
  accent: 'text-[#8b4513]', // Saddle Brown
  goldBorder: 'border-[#daa520]',
  silverBorder: 'border-[#a9a9a9]',
  buttonPrimary: 'bg-gradient-to-b from-[#5c4033] via-[#2c241b] to-[#1a1008] text-[#f5deb3] border-4 border-[#1a1008]',
  buttonAction: 'bg-gradient-to-b from-[#4ade80] via-[#2e8b57] to-[#14532d] text-white border-4 border-[#14532d]',
  buttonDanger: 'bg-gradient-to-b from-[#ef4444] via-[#8b0000] to-[#450a0a] text-white border-4 border-[#450a0a]',
  buttonGold: 'bg-gradient-to-b from-[#faeebf] via-[#daa520] to-[#b8860b] text-[#2c241b] border-4 border-[#8b4513]',
  input: 'bg-[#fffef8] border border-[#d4c5a9] font-serif text-[#2c241b]',
};

const METALLIC_SHADOW = 'shadow-[0_4px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]';
const METALLIC_FONT = 'font-serif font-bold tracking-wide';

// --- HUB THEME (Retro Blue RPG - Lightened) ---
const HUB_THEME = {
    bg: 'bg-gradient-to-b from-blue-800 to-slate-900', 
    panel: 'bg-blue-900/80 border-2 border-blue-400/40 shadow-lg backdrop-blur-sm',
    textMain: 'text-blue-50 font-sans drop-shadow-md',
    textAccent: 'text-cyan-300',
    barBg: 'bg-blue-950 border border-blue-500',
    barFill: 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300',
};

// --- QUEST THEME (Fantasy Map) ---
const QUEST_THEME = {
    bg: 'bg-gradient-to-b from-emerald-900 via-[#5d534a] to-[#3e3730]', 
    tray: 'bg-emerald-900/80 border-2 border-emerald-700/50 shadow-2xl backdrop-blur-sm',
};

// --- BINDER THEME (Pink to Deep Purple) ---
const BINDER_THEME = {
    bg: 'bg-gradient-to-b from-pink-900 to-purple-950', 
    page: 'bg-[#fdf4f8]', 
    spine: 'bg-[#4c1d95]', 
    ring: 'bg-gradient-to-b from-stone-300 via-white to-stone-400', 
    accent: 'text-[#e9d5ff]', 
};

// --- HELPER FUNCTIONS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const getDaysOut = (dateStr) => {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0,0,0,0);
  const due = new Date(dateStr);
  due.setHours(0,0,0,0);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const days = getDaysOut(dateStr);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 1 && days < 7) return `Due in ${days} Days`;
    const d = new Date(dateStr);
    return `${String(d.getMonth()+1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

const formatDateStandard = (dateStr) => {
   if (!dateStr) return '';
   const d = new Date(dateStr);
   return `${String(d.getMonth()+1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
};

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// --- INITIAL RULES & DATA ---
const initialRules = {
    general: [
        { id: 'g1', name: 'New Card Drawn', value: 25, unit: 'Exp' },
        { id: 'g2', name: 'Exp per Commission Dollar', value: 1, unit: 'Exp/$' }
    ],
    cardQuestTypes: [
        { id: 'qt1', name: 'Quote New - Initiated by Me', exp: 50 },
        { id: 'qt2', name: 'Quote New - Initiated by Them', exp: 25 },
        { id: 'qt3', name: 'Quote Existing', exp: 20 },
        { id: 'qt4', name: 'General Meeting', exp: 15 },
        { id: 'qt5', name: 'Productive Meeting', exp: 30 },
        { id: 'qt6', name: 'Follow-Up', exp: 10 },
        { id: 'qt7', name: 'Review', exp: 25 },
        { id: 'qt8', name: 'Letter', exp: 25 },
        { id: 'qt9', name: 'Service - Payment', exp: 20 },
        { id: 'qt10', name: 'Service - Change', exp: 20 },
        { id: 'qt11', name: 'Service - Claim', exp: 20 },
        { id: 'qt12', name: 'Service - Other', exp: 20 },
    ],
    standaloneQuestTypes: [
        { id: 'sq1', name: 'Plan Day', exp: 15 },
        { id: 'sq2', name: 'Attend Network', exp: 15 },
        { id: 'sq3', name: 'BNI', exp: 15 },
        { id: 'sq4', name: 'Intentional Prospecting', exp: 25 },
        { id: 'sq5', name: 'Service Agency Client', exp: 15 },
    ],
    completionTypes: [
        { id: 'ct1', name: 'Completed', bonusPercent: 0 },
        { id: 'ct2', name: 'Won Farmers', bonusPercent: 25 },
        { id: 'ct3', name: 'Won Farmers Life', bonusPercent: 50 },
        { id: 'ct4', name: 'Won Farmers Commercial', bonusPercent: 40 },
        { id: 'ct5', name: 'Won Non-Farmers New Business', bonusPercent: 15 },
    ],
    multipliers: [
        { id: 'm1', name: 'Early', value: 15, unit: '%' },
        { id: 'm2', name: 'On-Time', value: 0, unit: '%' },
        { id: 'm3', name: 'Late', value: -15, unit: '%' },
        { id: 'm4', name: 'COI Card', value: 20, unit: '%' },
        { id: 'm5', name: 'BNI Card', value: 25, unit: '%' },
        { id: 'm6', name: 'Carrier: Farmers', value: 20, unit: '%' },
        { id: 'm7', name: 'Carrier: Foremost/Bristol West', value: 15, unit: '%' },
    ],
    bonuses: [
        { id: 'b1', name: 'Plan Day 5 Days Straight', reward: 100, unit: 'Exp', target: 5 },
    ],
    levels: [
        { id: 'l1', level: 1, exp: 0, reward: 'Starter Pack', title: 'Novice' },
        { id: 'l2', level: 2, exp: 500, reward: 'New Sword', title: 'Apprentice' },
        { id: 'l3', level: 3, exp: 1500, reward: 'Horse', title: 'Journeyman' },
    ],
    universalLevelRewards: [
        { id: 'ulr1', reward: 'Full Health Restore' },
        { id: 'ulr2', reward: '+5 to Relationship Cap' },
    ]
};

// --- CONSTANTS FOR DROPDOWNS ---
const CLIENT_LOB_OPTIONS = ['Home', 'Auto', 'Toys', 'Umbrella', 'Life', 'Commercial', 'Health', 'Supplemental', 'Warranty', 'Electronics', 'Jewelry', 'Pet', 'Other'];
const CLIENT_CARRIER_OPTIONS = ['Farmers', 'Bristol West', 'Foremost', 'Progressive', 'National General', 'Kraft Lake', 'Other'];
const BUSINESS_LOB_OPTIONS = ['GL', 'BoP', 'Farm', 'Comm Auto', 'Workers Comp', 'E&O', 'Inland Marine', 'Umbrella', 'Cyber', 'Other'];
const BUSINESS_CARRIER_OPTIONS = ['Farmers', 'Foremost', 'Progressive', 'Tapco', 'Hiscox', 'Next', 'Liberty Mutual', 'Berkshire Hathaway', 'Kraft Lake Compare', 'Other'];

// --- COMPONENTS ---

const RPGButton = ({ children, onClick, variant = 'primary', className = '', disabled=false }) => {
  let styles = THEME.buttonPrimary;
  if (variant === 'action') styles = THEME.buttonAction;
  if (variant === 'danger') styles = THEME.buttonDanger;
  if (variant === 'gold') styles = THEME.buttonGold;
   
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${styles} ${METALLIC_SHADOW} ${METALLIC_FONT} px-4 py-2 rounded shadow-md transition-all active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const RelationshipBar = ({ score }) => {
  const safeScore = Math.max(1, Math.min(100, score || 0)); 
  const gradientWidth = (100 / safeScore) * 100;

  return (
    <div className="w-full h-3 bg-gray-300 rounded-full border border-gray-400 relative overflow-hidden">
        <div 
            className="h-full absolute left-0 top-0 transition-all duration-500 overflow-hidden"
            style={{ width: `${safeScore}%` }}
        >
             <div 
                className="h-full"
                style={{ 
                    width: `${gradientWidth}%`,
                    background: 'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)',
                }}
             ></div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(9)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute h-full w-[1px] bg-black/40 top-0" 
                    style={{ left: `${(i+1)*10}%` }}
                ></div>
            ))}
        </div>
    </div>
  );
};

const CooldownBar = ({ daysRemaining }) => {
    const totalDays = 7;
    const current = Math.max(0, Math.min(totalDays, daysRemaining));
    const width = (current / totalDays) * 100;
    const isToday = daysRemaining <= 0;
    const isTomorrow = daysRemaining === 1;

    return (
        <div className="w-full mt-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-stone-500 mb-1">
                <span>Cooldown Timer</span>
                <span>{isToday ? 'CONVERTS TOMORROW' : `${daysRemaining} Days Left`}</span>
            </div>
            <div className="h-4 w-full bg-[#e0f2fe] rounded border border-blue-300 relative overflow-hidden">
                <div 
                    className="h-full absolute right-0 top-0 transition-all duration-500"
                    style={{ 
                        width: `${width}%`,
                        background: 'linear-gradient(to left, #ec4899, #3b82f6)' 
                    }}
                ></div>
                {isTomorrow && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 animate-pulse">
                        <span className="text-[9px] font-bold text-red-900 uppercase">Converts Tomorrow</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ScrollLog = ({ dailyLog }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filterText, setFilterText] = useState('');
    
    // Ensure date is valid for comparison
    const isToday = (dateStr) => {
        if(!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() && 
               d.getMonth() === today.getMonth() && 
               d.getFullYear() === today.getFullYear();
    };

    const filteredLogs = dailyLog.filter(log => {
        if (!isExpanded && !isToday(log.date)) return false; // Show only today if collapsed
        
        const matchesText = log.clientName.toLowerCase().includes(filterText.toLowerCase()) || 
                            log.questType.toLowerCase().includes(filterText.toLowerCase()) ||
                            (log.note && log.note.toLowerCase().includes(filterText.toLowerCase()));
        
        return matchesText;
    });

    return (
        <div className={`mt-4 relative transition-all duration-500 ${isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'flex-1 flex flex-col min-h-0'}`}>
            {/* Backdrop for Expanded Mode */}
            {isExpanded && <div className="absolute inset-0 bg-black/60 -z-10 rounded-xl" onClick={() => setIsExpanded(false)}></div>}

            <div className={`flex flex-col bg-[#f5e6d3] border-[6px] border-[#8b4513] rounded-lg shadow-2xl relative overflow-hidden ${isExpanded ? 'w-full max-w-4xl mx-auto h-full' : 'h-full'}`}>
                {/* Scroll Top Roll Effect */}
                <div className="h-4 bg-gradient-to-b from-[#5d4037] to-[#8d6e63] border-b border-[#3e2723] shadow-md relative z-10 shrink-0"></div>
                
                {/* Header Area */}
                <div className="bg-[#e6d5c1] p-3 border-b border-[#d4c5a9] flex justify-between items-center shrink-0 shadow-sm">
                    <h3 className="font-serif font-bold text-[#3e2723] text-lg flex items-center gap-2">
                        <Scroll size={20} className="text-[#8b4513]"/> 
                        {isExpanded ? 'Grand Archive of Deeds' : "Today's Scroll"}
                    </h3>
                    <div className="flex gap-2">
                        {isExpanded && (
                            <input 
                                className="px-2 py-1 text-sm bg-white border border-[#d4c5a9] rounded focus:outline-none focus:border-[#8b4513] font-serif" 
                                placeholder="Search archives..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        )}
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#8b4513] hover:bg-[#d7ccc8] p-1 rounded transition-colors">
                            {isExpanded ? <X size={20}/> : <div className="flex items-center gap-1 text-xs font-bold uppercase"><ChevronUp size={16}/> Expand</div>}
                        </button>
                    </div>
                </div>

                {/* Log Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5e6d3] relative">
                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%238b4513\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
                    
                    {filteredLogs.length === 0 ? (
                        <div className="text-center text-[#a1887f] italic py-4 relative z-10">The scroll is blank...</div>
                    ) : (
                        filteredLogs.map(log => (
                            <div key={log.id} className="border-b border-[#d7ccc8] pb-2 last:border-0 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-[#3e2723] font-serif">{log.clientName}</div>
                                    <div className="text-xs text-[#8d6e63] font-mono">{formatDisplayDate(log.date)}</div>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-[#5d4037] italic">{log.questType}</span>
                                    {log.exp > 0 && <span className="font-bold text-[#2e7d32] bg-[#c8e6c9] px-1 rounded text-xs border border-[#81c784]">+{log.exp} XP</span>}
                                </div>
                                {log.note && <div className="text-xs text-[#5d4037] mt-1 bg-[#d7ccc8]/30 p-1 rounded italic">"{log.note}"</div>}
                            </div>
                        ))
                    )}
                </div>

                {/* Scroll Bottom Roll Effect */}
                <div className="h-6 bg-gradient-to-t from-[#5d4037] to-[#8d6e63] border-t border-[#3e2723] shadow-[0_-4px_10px_rgba(0,0,0,0.3)] relative z-10 shrink-0"></div>
            </div>
        </div>
    );
};

// Helper for Rule Sections
const RuleSection = ({ title, dataKey, rules, handleAddRule, handleUpdateRule, handleDeleteRule, columns = ['Name', 'Value'], unit = '' }) => (
    <div className="mb-8 bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-xl overflow-hidden shadow-md">
        <div className="bg-[#2c241b] text-[#f5deb3] p-3 flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg">{title}</h3>
            <button onClick={() => handleAddRule(dataKey)} className="text-xs bg-[#eebb4d] text-[#2c241b] px-2 py-1 rounded font-bold hover:brightness-110 flex items-center gap-1"><Plus size={12}/> Add</button>
        </div>
        <div className="p-4">
            {rules[dataKey] && rules[dataKey].map(item => (
                <div key={item.id} className="flex items-center gap-4 mb-2 last:mb-0">
                    <input 
                        className="flex-1 border-b border-[#d4c5a9] bg-transparent py-1 px-2 focus:outline-none focus:border-[#8b4513]"
                        value={item.name}
                        onChange={(e) => handleUpdateRule(dataKey, item.id, 'name', e.target.value)}
                    />
                    {columns.includes('Value') && (
                        <div className="flex items-center w-32">
                            <input 
                                type="number"
                                className="w-full border border-[#d4c5a9] rounded py-1 px-2 text-right"
                                value={item.value !== undefined ? item.value : (item.exp !== undefined ? item.exp : (item.bonusPercent !== undefined ? item.bonusPercent : (item.reward !== undefined ? item.reward : 0)))}
                                onChange={(e) => handleUpdateRule(dataKey, item.id, item.exp !== undefined ? 'exp' : (item.bonusPercent !== undefined ? 'bonusPercent' : (item.reward !== undefined ? 'reward' : 'value')), parseFloat(e.target.value))}
                            />
                            <span className="ml-2 text-xs font-bold text-stone-500 w-8">{item.unit || unit || (item.exp !== undefined ? 'Exp' : '%')}</span>
                        </div>
                    )}
                    <button onClick={() => handleDeleteRule(dataKey, item.id)} className="text-stone-400 hover:text-red-700"><Trash2 size={16}/></button>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [view, setView] = useState('hub'); 
  const [clients, setClients] = useState([]);
  const [rules, setRules] = useState(initialRules);
  const [userStats, setUserStats] = useState({ name: 'Drew Leui', exp: 0, level: 1 });
  const [dailyLog, setDailyLog] = useState([]);
  
  // Bonus Progress State (Mocked start for 'Plan Day')
  const [bonusProgress, setBonusProgress] = useState({ 'b1': 2 }); 
   
  // UI State
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false); 
  const [modals, setModals] = useState({ 
      drawCard: false, 
      startQuest: false, 
      levelTable: false, 
      boosterPack: false,
      modifyQuest: false,
      questResult: false,
      mergeCard: false // Added Merge Modal
  });
   
  // New State for Quest Logic
  const [questActionType, setQuestActionType] = useState('Complete'); 
  const [questResultData, setQuestResultData] = useState({
      completionTypeId: '',
      commission: 0,
      nextQuestTypeId: '',
      nextDueDate: '',
      isCooldown: false
  });
  
  // New State for Standalone Creation
  const [isStandaloneCreation, setIsStandaloneCreation] = useState(false);
  const [standaloneNote, setStandaloneNote] = useState('');
  
  // NOTES STATE (NEW)
  const [startQuestNote, setStartQuestNote] = useState('');
  const [resultQuestNote, setResultQuestNote] = useState('');

  // Booster Pack State
  const [boosterSchema, setBoosterSchema] = useState({
      colCount: 6, 
      columns: ['Name', 'Phone', 'Email', 'Address', 'Notes', 'Line of Business'],
      rawText: ''
  });
  const fileInputRef = useRef(null);
  const cardRefs = useRef({}); 

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Alphabetical');
   
  // Selection State
  const [selectedClient, setSelectedClient] = useState(null); // Used for both Questing and Merging
  const [activeSide, setActiveSide] = useState('Client'); 
  const [activeQuestId, setActiveQuestId] = useState(null); 
  const [newCardData, setNewCardData] = useState({});

  // Merge State
  const [cardToMergeIntoId, setCardToMergeIntoId] = useState(null);


  // --- LOGIC: XP/Exp Calculation ---
  const getExpData = () => {
      const nextLvl = rules.levels.find(l => l.level === userStats.level + 1);
      const maxExp = nextLvl ? nextLvl.exp : 2000;
      const currentExp = userStats.exp;
      const percent = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));
      const remaining = Math.max(0, maxExp - currentExp);
      return { currentExp, maxExp, percent, remaining };
  };
  const expData = getExpData();

  // --- LOGIC: Household Matching ---
  const checkHouseholds = (clientList) => {
      const addressMap = {};
      clientList.forEach(c => {
          if (c.address && c.address.length > 5) {
              if (!addressMap[c.address]) addressMap[c.address] = [];
              addressMap[c.address].push({ id: c.id, name: c.name });
          }
      });
      return clientList.map(c => {
          if (c.address && addressMap[c.address] && addressMap[c.address].length > 1) {
              const housemates = addressMap[c.address].filter(h => h.id !== c.id);
              return { ...c, connections: { ...c.connections, household: housemates } };
          }
          return c;
      });
  };

  // Scroll to expanded card
  useEffect(() => {
      if (expandedCardId && cardRefs.current[expandedCardId]) {
          setTimeout(() => {
            cardRefs.current[expandedCardId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
      }
  }, [expandedCardId]);

  // --- ACTIONS ---

  const handleAddRule = (key) => {
    // Basic implementation to prevent error
    const newId = generateId();
    const newRule = { id: newId, name: 'New Rule', value: 0 };
    setRules(prev => ({
        ...prev,
        [key]: [...(prev[key] || []), newRule]
    }));
  };

  const handleUpdateRule = (key, id, field, val) => {
      setRules(prev => ({
          ...prev,
          [key]: prev[key].map(item => item.id === id ? { ...item, [field]: val } : item)
      }));
  };

  const handleDeleteRule = (key, id) => {
      setRules(prev => ({
          ...prev,
          [key]: prev[key].filter(item => item.id !== id)
      }));
  };

  const handleAddLevel = () => {
      const lastLevel = rules.levels[rules.levels.length - 1];
      const newLevel = { 
          id: generateId(), 
          level: lastLevel.level + 1, 
          exp: lastLevel.exp + 1000, 
          reward: 'New Title', 
          title: 'Master' 
      };
      setRules(prev => ({ ...prev, levels: [...prev.levels, newLevel] }));
  };

  const handleDeleteLevel = (id) => {
      setRules(prev => ({ ...prev, levels: prev.levels.filter(l => l.id !== id) }));
  };

  const handleDrawCard = (type) => {
      setNewCardData({
          id: generateId(),
          primarySide: type, 
          name: '', address: '', mailingAddress: '', phone: '', email: '', dob: '', license: '',
          residenceType: 'Homeowner',
          userRating: 0, relationshipScore: 0, isCOI: false, isBNI: false,
          clientSide: { notes: [], logs: [], quests: [], lob: [], carriers: [] },
          businessSide: { businessName: '', phone: '', ein: '', established: '', occupancy: 'Own', notes: [], logs: [], quests: [], lob: [], carriers: [] },
          connections: { referredBy: [], referrals: [], household: [] }
      });
      setModals(prev => ({ ...prev, drawCard: true }));
  };
  
  const toggleNewCardItem = (side, field, item) => {
      setNewCardData(prev => {
          const target = side === 'Client' ? prev.clientSide : prev.businessSide;
          const list = target[field] || [];
          const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
          
          if (side === 'Client') return { ...prev, clientSide: { ...prev.clientSide, [field]: newList } };
          return { ...prev, businessSide: { ...prev.businessSide, [field]: newList } };
      });
  };

  const saveNewCard = () => {
      if (newCardData.primarySide === 'Client' && !newCardData.name) return;
      if (newCardData.primarySide === 'Business' && !newCardData.businessSide.businessName) return;

      // Award XP for New Card
      const newCardExp = rules.general.find(r => r.name === 'New Card Drawn')?.value || 0;
      setUserStats(prev => ({ ...prev, exp: prev.exp + newCardExp }));
      
      // Log it
      setDailyLog(prev => [{
          id: generateId(), 
          clientName: newCardData.primarySide === 'Client' ? newCardData.name : newCardData.businessSide.businessName, 
          questType: 'New Card Drawn', 
          exp: newCardExp,
          date: new Date().toISOString()
      }, ...prev]);

      // Add log to specific card too
      const cardLogs = [{ id: generateId(), clientName: 'System', questType: 'Card Created', exp: newCardExp, date: new Date().toISOString() }];
      const finalCardData = {
          ...newCardData,
          clientSide: { ...newCardData.clientSide, logs: [...newCardData.clientSide.logs, ...cardLogs] }
      };

      setClients(prevClients => {
          let updatedList = [...prevClients, finalCardData];
          return checkHouseholds(updatedList);
      });
      setModals(prev => ({ ...prev, drawCard: false }));
  };

  const handleUpdateClient = (updated) => {
      setClients(prevClients => {
          let updatedList = prevClients.map(c => c.id === updated.id ? updated : c);
          return checkHouseholds(updatedList);
      });
  };

  const handleSetPrimary = (client, side) => {
      handleUpdateClient({ ...client, primarySide: side });
  };

  // --- MERGE LOGIC ---
  const handleMergeCards = (targetCardId) => {
      if (!selectedClient || !targetCardId) return;
      
      const targetCard = clients.find(c => c.id === targetCardId);
      if (!targetCard) return;

      // Logic: Merge Target INTO Selected (Selected is kept, Target is deleted)
      // We prioritize data from the Target if Selected is empty, otherwise keep Selected.
      // Arrays are concatenated.

      const mergedCard = {
          ...selectedClient,
          name: selectedClient.name || targetCard.name,
          phone: selectedClient.phone || targetCard.phone,
          email: selectedClient.email || targetCard.email,
          address: selectedClient.address || targetCard.address,
          mailingAddress: selectedClient.mailingAddress || targetCard.mailingAddress,
          dob: selectedClient.dob || targetCard.dob,
          license: selectedClient.license || targetCard.license,
          isCOI: selectedClient.isCOI || targetCard.isCOI,
          isBNI: selectedClient.isBNI || targetCard.isBNI,
          clientSide: {
              ...selectedClient.clientSide,
              notes: [...selectedClient.clientSide.notes, ...targetCard.clientSide.notes],
              logs: [...selectedClient.clientSide.logs, ...targetCard.clientSide.logs],
              quests: [...selectedClient.clientSide.quests, ...targetCard.clientSide.quests],
              lob: [...new Set([...selectedClient.clientSide.lob, ...targetCard.clientSide.lob])],
              carriers: [...new Set([...selectedClient.clientSide.carriers, ...targetCard.clientSide.carriers])],
          },
          businessSide: {
              ...selectedClient.businessSide,
              businessName: selectedClient.businessSide.businessName || targetCard.businessSide.businessName,
              phone: selectedClient.businessSide.phone || targetCard.businessSide.phone,
              ein: selectedClient.businessSide.ein || targetCard.businessSide.ein,
              established: selectedClient.businessSide.established || targetCard.businessSide.established,
              notes: [...selectedClient.businessSide.notes, ...targetCard.businessSide.notes],
              logs: [...selectedClient.businessSide.logs, ...targetCard.businessSide.logs],
              quests: [...selectedClient.businessSide.quests, ...targetCard.businessSide.quests],
              lob: [...new Set([...selectedClient.businessSide.lob, ...targetCard.businessSide.lob])],
              carriers: [...new Set([...selectedClient.businessSide.carriers, ...targetCard.businessSide.carriers])],
          }
      };
      
      // Log the merge
      const logEntry = { id: generateId(), clientName: 'System', questType: `Merged with ${targetCard.name || 'Card'}`, exp: 0, date: new Date().toISOString() };
      mergedCard.clientSide.logs.unshift(logEntry);
      
      // Update State: Remove target, Update selected
      setClients(prev => {
          const filtered = prev.filter(c => c.id !== targetCard.id); // Remove target
          return filtered.map(c => c.id === selectedClient.id ? mergedCard : c); // Update source
      });
      
      setModals(prev => ({ ...prev, mergeCard: false }));
      setSelectedClient(null); // Clear selection
  };


  // --- QUEST LOGIC ---
  
  // Helper to rebalance tracking
  const rebalanceQuestTracking = (quests) => {
     // If no quest is tracked, track the earliest active one.
     const active = quests.filter(q => q.status === 'Active' || q.status === 'Cooldown');
     const tracked = active.find(q => q.tracked);
     
     if (!tracked && active.length > 0) {
         // Sort by due date
         active.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
         const newTrackedId = active[0].id;
         return quests.map(q => q.id === newTrackedId ? {...q, tracked: true} : q);
     }
     return quests;
  };

  // Creates a Standalone Quest Card
  const handleCreateStandaloneQuest = (questType, dueDate, note) => {
      const newStandalone = {
          id: `standalone-${generateId()}`,
          isStandalone: true,
          primarySide: 'Standalone',
          name: 'Standalone Task',
          relationshipScore: 0, 
          clientSide: { 
              quests: [{
                  id: generateId(),
                  type: questType.name,
                  baseExp: questType.exp,
                  dueDate: dueDate,
                  status: 'Active',
                  tracked: true,
                  notes: [{id: generateId(), text: note, date: new Date().toISOString()}]
              }],
              logs: [],
              notes: [],
              lob: [], carriers: []
          },
          businessSide: { quests: [], logs: [], notes: [], lob: [], carriers: [] }
      };
      
      setClients(prev => [...prev, newStandalone]);
      setDailyLog(prev => [{ id: generateId(), clientName: 'System', questType: 'Standalone Quest Started', exp: 0, date: new Date().toISOString(), note: note }, ...prev]);
  };
  
  const handleStartQuest = (client, side, questType, dueDate, note) => {
      const updatedClient = JSON.parse(JSON.stringify(client));
      const targetSide = side === 'Client' ? updatedClient.clientSide : updatedClient.businessSide;

      const newQuest = {
          id: generateId(),
          type: questType.name,
          baseExp: questType.exp,
          dueDate: dueDate,
          status: 'Active',
          tracked: true, // Will be rebalanced below
          notes: note ? [{id: generateId(), text: note, date: new Date().toISOString()}] : []
      };
      
      targetSide.quests.push(newQuest);
      
      // Auto-track the earliest quest
      targetSide.quests = rebalanceQuestTracking(targetSide.quests);
      
      const logEntry = { 
          id: generateId(), 
          clientName: 'System', 
          questType: `Quest Started: ${questType.name}`, 
          exp: 0, 
          date: new Date().toISOString(),
          note: note 
      };
      targetSide.logs = targetSide.logs || [];
      targetSide.logs.unshift(logEntry);
      setDailyLog(prev => [{ ...logEntry, clientName: updatedClient.name }, ...prev]);

      handleUpdateClient(updatedClient);
  };

  const handleTrackQuest = (client, side, questId) => {
      const updatedClient = JSON.parse(JSON.stringify(client));
      const targetSide = side === 'Client' ? updatedClient.clientSide : updatedClient.businessSide;
      // Manual override of tracking
      targetSide.quests = targetSide.quests.map(q => ({ ...q, tracked: q.id === questId }));
      handleUpdateClient(updatedClient);
  };

  const handleOpenQuestResult = (action, client, side, questId) => {
      setSelectedClient(client);
      setActiveSide(side);
      setActiveQuestId(questId);
      setQuestActionType(action); // 'Complete' or 'Continue'
      setResultQuestNote(''); // Reset note field
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const isStandalone = client.isStandalone;
      const defaultNextType = isStandalone 
          ? (rules.standaloneQuestTypes[0]?.id || '') 
          : (rules.cardQuestTypes[0]?.id || '');
      
      setQuestResultData({
          completionTypeId: rules.completionTypes[0]?.id,
          commission: 0,
          nextQuestTypeId: defaultNextType, 
          nextDueDate: tomorrow.toISOString().split('T')[0],
          isCooldown: false
      });
      setModals(prev => ({...prev, questResult: true}));
  };

  const calculateFinalExp = (quest, client, sideData) => {
      let totalExp = quest.baseExp || 0;
      let multiplierPercent = 0;

      const daysOut = getDaysOut(quest.dueDate);
      if (daysOut > 0) multiplierPercent += rules.multipliers.find(m => m.name === 'Early')?.value || 0;
      else if (daysOut < 0) multiplierPercent += rules.multipliers.find(m => m.name === 'Late')?.value || 0;

      if (client.isCOI) multiplierPercent += rules.multipliers.find(m => m.name === 'COI Card')?.value || 0;
      if (client.isBNI) multiplierPercent += rules.multipliers.find(m => m.name === 'BNI Card')?.value || 0;

      if (sideData.carriers.includes('Farmers')) multiplierPercent += rules.multipliers.find(m => m.name === 'Carrier: Farmers')?.value || 0;
      else if (sideData.carriers.some(c => c.includes('Foremost') || c.includes('Bristol'))) multiplierPercent += rules.multipliers.find(m => m.name === 'Carrier: Foremost/Bristol West')?.value || 0;

      const completionType = rules.completionTypes.find(ct => ct.id === questResultData.completionTypeId);
      if (completionType) multiplierPercent += completionType.bonusPercent;

      totalExp = totalExp * (1 + (multiplierPercent / 100));

      const commissionRate = rules.general.find(g => g.name === 'Exp per Commission Dollar')?.value || 1;
      totalExp += (parseFloat(questResultData.commission) || 0) * commissionRate;

      return Math.round(totalExp);
  };

  const processQuestResult = () => {
      if (!selectedClient || !activeQuestId) return;

      const updatedClient = JSON.parse(JSON.stringify(selectedClient)); 
      const targetSide = activeSide === 'Client' ? updatedClient.clientSide : updatedClient.businessSide;
      const questIndex = targetSide.quests.findIndex(q => q.id === activeQuestId);
      if (questIndex === -1) return;

      const quest = targetSide.quests[questIndex];
      const finalExp = calculateFinalExp(quest, updatedClient, targetSide);
      const completionName = rules.completionTypes.find(ct => ct.id === questResultData.completionTypeId)?.name || 'Completed';

      // Add Result Note to Quest
      if (resultQuestNote) {
          quest.notes = quest.notes || [];
          quest.notes.push({id: generateId(), text: resultQuestNote, date: new Date().toISOString()});
      }

      setUserStats(prev => ({ ...prev, exp: prev.exp + finalExp }));

      const logEntry = {
          id: generateId(),
          clientName: selectedClient.isStandalone ? selectedClient.name : (activeSide === 'Client' ? updatedClient.name : updatedClient.businessSide.businessName),
          questType: `${quest.type} (${questActionType})`,
          exp: finalExp,
          date: new Date().toISOString(),
          note: resultQuestNote
      };
      
      setDailyLog(prev => [logEntry, ...prev]);
      targetSide.logs = targetSide.logs || [];
      targetSide.logs.unshift(logEntry);

      if (questActionType === 'Complete') {
          if (selectedClient.isStandalone) {
             // Remove standalone card entirely
             setClients(prev => prev.filter(c => c.id !== selectedClient.id));
             setModals(prev => ({...prev, questResult: false}));
             return;
          } else {
             quest.status = 'Completed';
             quest.completedDate = new Date().toISOString();
             quest.completionType = completionName;
             // Rebalance tracking
             const activeOnly = targetSide.quests.filter(q => q.status !== 'Completed' && q.status !== 'Cancelled');
             if (activeOnly.length > 0) {
                 const newTrackedId = rebalanceQuestTracking(activeOnly).find(q => q.tracked)?.id;
                 targetSide.quests.forEach(q => q.tracked = q.id === newTrackedId);
             }
          }
      } else {
          // CONTINUE QUEST LOGIC
          if (questResultData.isCooldown) {
              quest.status = 'Cooldown';
              quest.dueDate = questResultData.nextDueDate;
              quest.type = `${quest.type} (Cooldown)`;
          } else {
              const nextQuestType = rules.cardQuestTypes.find(qt => qt.id === questResultData.nextQuestTypeId) || 
                                    rules.standaloneQuestTypes.find(sq => sq.id === questResultData.nextQuestTypeId);
              
              if (nextQuestType) {
                  quest.type = nextQuestType.name;
                  quest.baseExp = nextQuestType.exp;
                  quest.dueDate = questResultData.nextDueDate;
                  quest.status = 'Active';
                  targetSide.notes = targetSide.notes || [];
                  targetSide.notes.push({id: generateId(), text: `Quest progressed to ${nextQuestType.name}`, date: new Date().toISOString()});
              }
          }
          // Rebalance after update
          targetSide.quests = rebalanceQuestTracking(targetSide.quests);
      }

      handleUpdateClient(updatedClient);
      setModals(prev => ({...prev, questResult: false}));
  };

  const performCooldownAction = (client, side, quest, action, newDate = null, newTypeId = null) => {
      const updatedClient = JSON.parse(JSON.stringify(client));
      const targetSide = side === 'Client' ? updatedClient.clientSide : updatedClient.businessSide;
      const targetQuest = targetSide.quests.find(q => q.id === quest.id);
      
      if (!targetQuest) return;

      if (action === 'Give Up') {
          if (client.isStandalone) {
             setClients(prev => prev.filter(c => c.id !== client.id));
             setDailyLog(prev => [{id: generateId(), clientName: client.name, questType: 'Standalone Cancelled', exp: 0, date: new Date().toISOString()}, ...prev]);
             return;
          }
          targetQuest.status = 'Cancelled';
          const logEntry = {id: generateId(), clientName: 'System', questType: 'Quest Cancelled', exp: 0, date: new Date().toISOString()};
          targetSide.logs = targetSide.logs || [];
          targetSide.logs.unshift(logEntry);
          setDailyLog(prev => [logEntry, ...prev]);

      } else if (action === 'Extend') {
          const d = new Date(); d.setDate(d.getDate() + 1);
          targetQuest.dueDate = newDate || d.toISOString().split('T')[0];
      } else if (action === 'Continue') {
          const nextType = rules.cardQuestTypes.find(t => t.id === newTypeId) || rules.cardQuestTypes.find(t => t.name === 'Follow-Up');
          targetQuest.status = 'Active';
          targetQuest.type = nextType ? nextType.name : 'Follow-Up';
          targetQuest.baseExp = nextType ? nextType.exp : 10;
          targetQuest.dueDate = newDate || new Date().toISOString().split('T')[0];
          
          const logEntry = {id: generateId(), clientName: 'System', questType: 'Quest Progressed (From Cooldown)', exp: 0, date: new Date().toISOString()};
          targetSide.logs = targetSide.logs || [];
          targetSide.logs.unshift(logEntry);
          setDailyLog(prev => [logEntry, ...prev]);
      }

      // Rebalance after cooldown changes
      targetSide.quests = rebalanceQuestTracking(targetSide.quests);

      handleUpdateClient(updatedClient);
  };


  // --- BOOSTER PACK ---
  const initBooster = () => {
    setBoosterSchema({
        colCount: 6,
        columns: ['Name', 'Phone', 'Email', 'Address', 'Notes', 'Line of Business'],
        rawText: ''
    });
    setModals(prev => ({...prev, boosterPack: true})); // Fixed: ensure this triggers
  };

  const updateBoosterColCount = (count) => {
    const newCount = Math.max(1, parseInt(count) || 1);
    const newCols = [...boosterSchema.columns];
    if (newCount > newCols.length) {
        for (let i = newCols.length; i < newCount; i++) newCols.push('Ignore');
    } else {
        newCols.length = newCount;
    }
    setBoosterSchema({ ...boosterSchema, colCount: newCount, columns: newCols });
  };

  const updateBoosterColumnType = (index, type) => {
      const newCols = [...boosterSchema.columns];
      newCols[index] = type;
      setBoosterSchema({ ...boosterSchema, columns: newCols });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => setBoosterSchema(prev => ({ ...prev, rawText: event.target.result }));
    reader.readAsText(file);
  };

  const processBoosterImport = () => {
     const rows = boosterSchema.rawText.split('\n').filter(r => r.trim() !== '');
     const newClients = rows.map((row, idx) => {
        const cols = row.split(',').map(c => c.trim());
        const clientData = {
            id: `imported-${idx}-${generateId()}`,
            name: 'Unknown', phone: '', address: '', mailingAddress: '', email: '', dob: '', license: '',
            primarySide: 'Client', 
            userRating: 0, relationshipScore: 0, isCOI: false, isBNI: false,
            connections: { referredBy: [], referrals: [], household: [] },
            clientSide: { notes: [], logs: [], quests: [], lob: [], carriers: [] },
            businessSide: { businessName: '', phone: '', notes: [], logs: [], quests: [], lob: [], carriers: [] }
        };

        cols.forEach((val, i) => {
            if (i >= boosterSchema.columns.length) return;
            const type = boosterSchema.columns[i];
            if (!type || type === 'Ignore') return;
            
            if (type === 'Name') clientData.name = val;
            if (type === 'Phone') clientData.phone = val;
            if (type === 'Address') clientData.address = val;
            if (type === 'Mailing Address') clientData.mailingAddress = val;
            if (type === 'Email') clientData.email = val;
            if (type === 'Date of Birth') clientData.dob = val;
            if (type === 'Drivers License #') clientData.license = val;
            
            if (type === 'Business Name' && val) {
                clientData.businessSide.businessName = val;
                clientData.primarySide = 'Business'; 
            }
            if (type === 'Business Phone' && val) {
                clientData.businessSide.phone = val;
            }
            if (type === 'Business Address' && val) {
                // Not standard field but we can put it in address if primary or note
            }
            if (type === 'Business Email' && val) {
                // Not standard field
            }
            if (type === 'Website' && val) {
                 // Not standard field
            }
            if (type === 'EIN' && val) {
                 clientData.businessSide.ein = val;
            }
            if (type === 'Notes' && val) clientData.clientSide.notes.push({ id: generateId(), text: val, date: new Date().toISOString() });
            if (type === 'Line of Business' && val) clientData.clientSide.lob.push(val);
        });

        if (clientData.name === 'Unknown' && clientData.businessSide.businessName === '') return null;
        return clientData;
     }).filter(Boolean);

     setClients(prev => {
         let updated = [...prev, ...newClients];
         return checkHouseholds(updated);
     });
     setModals(prev => ({ ...prev, boosterPack: false }));
  };

  const sortedClients = useMemo(() => {
      let list = [...clients];
      // Filter out Standalone quests if view is Binder
      if (view === 'binder') {
          list = list.filter(c => !c.isStandalone);
      }
      
      const getName = (c) => c.primarySide === 'Client' ? c.name : (c.businessSide.businessName || 'Unnamed Business');
      
      const getExpEarned = (c) => {
          const cLogs = c.clientSide.logs || [];
          const bLogs = c.businessSide.logs || [];
          const sum = [...cLogs, ...bLogs].reduce((acc, log) => acc + (log.exp || 0), 0);
          return sum;
      };

      switch(sort) {
          case 'Alphabetical':
              list.sort((a,b) => getName(a).localeCompare(getName(b)));
              break;
          case 'Due Date':
              list.sort((a,b) => {
                 const getDue = (c) => {
                     const s = c.primarySide === 'Client' ? c.clientSide : c.businessSide;
                     const q = s.quests.find(x => x.tracked);
                     return q ? new Date(q.dueDate) : new Date('2099-12-31');
                 };
                 return getDue(a) - getDue(b);
              });
              break;
          case 'Client Side':
              list.sort((a,b) => (b.primarySide === 'Client' ? 1 : 0) - (a.primarySide === 'Client' ? 1 : 0));
              break;
          case 'Business Side':
              list.sort((a,b) => (b.primarySide === 'Business' ? 1 : 0) - (a.primarySide === 'Business' ? 1 : 0));
              break;
          case 'CoI':
              list.sort((a,b) => (b.isCOI ? 1 : 0) - (a.isCOI ? 1 : 0));
              break;
          case 'BNI':
              list.sort((a,b) => (b.isBNI ? 1 : 0) - (a.isBNI ? 1 : 0));
              break;
          case 'Relationship Score':
              list.sort((a,b) => b.relationshipScore - a.relationshipScore);
              break;
          case 'Farmers First':
              const hasFarmers = (c) => (c.clientSide.carriers.includes('Farmers') || c.businessSide.carriers.includes('Farmers'));
              list.sort((a,b) => (hasFarmers(b) ? 1 : 0) - (hasFarmers(a) ? 1 : 0));
              break;
          case 'Life First':
              const hasLife = (c) => (c.clientSide.lob.includes('Life') || c.businessSide.lob.includes('Life'));
              list.sort((a,b) => (hasLife(b) ? 1 : 0) - (hasLife(a) ? 1 : 0));
              break;
          case 'Exp Earned':
              list.sort((a,b) => getExpEarned(b) - getExpEarned(a));
              break;
          case 'Commission Earned':
              list.sort((a,b) => getExpEarned(b) - getExpEarned(a));
              break;
          default:
              break;
      }
      return list;
  }, [clients, sort, view]); 


  // --- SUB-COMPONENTS ---

  const ClientCard = ({ client, isExpanded, onToggle, onUpdate }) => {
      const [isFlipped, setIsFlipped] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [editData, setEditData] = useState(client);
      
      const [visibleFace, setVisibleFace] = useState(client.primarySide);
      const activeFace = isExpanded ? visibleFace : client.primarySide;
      const isClientFace = activeFace === 'Client';
      const sideData = isClientFace ? client.clientSide : client.businessSide;
      const activeQuests = sideData.quests.filter(q => q.status !== 'Completed' && q.status !== 'Cancelled');
      const trackedQuest = activeQuests.find(q => q.tracked) || activeQuests[0];
      const questCount = activeQuests.length;
      const displayCardName = isClientFace ? client.name : (client.businessSide.businessName || 'Unnamed Business');
      const displayCardPhone = isClientFace ? client.phone : (client.businessSide.phone || '');
      const [questTab, setQuestTab] = useState(0);
      const activeData = isEditing ? editData : client;
      const activeSideData = isClientFace ? activeData.clientSide : activeData.businessSide;
      const headerName = isClientFace ? activeData.name : (activeData.businessSide.businessName || 'New Business');
      const isPrimarySide = client.primarySide === visibleFace;

      useEffect(() => {
          if (isExpanded) {
              setVisibleFace(client.primarySide);
              setIsFlipped(false);
          }
      }, [isExpanded, client.primarySide]);

      useEffect(() => {
          if (!isEditing) setEditData(client);
      }, [client, isEditing]);

      // --- COLOR LOGIC (ENHANCED) ---
      const hasPolicies = sideData.lob && sideData.lob.length > 0;
      let cardBg = '';
      let baseBorder = '';

      if (client.isStandalone) {
          // Purple Standalone
          cardBg = 'bg-gradient-to-br from-purple-100 to-purple-200 shadow-purple-100';
          baseBorder = 'border-purple-600';
      } else if (isClientFace) {
          if (hasPolicies) {
             // Client: Green Pop (Emerald Gradient)
             cardBg = 'bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-100'; 
             baseBorder = 'border-emerald-600';
          } else {
             // Prospect: Gray Pop (Stone Gradient)
             cardBg = 'bg-gradient-to-br from-stone-200 to-stone-300 shadow-stone-200';
             baseBorder = 'border-stone-500';
          }
      } else {
          if (hasPolicies) {
             // Business Client: Blue Pop (Blue Gradient)
             cardBg = 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-100';
             baseBorder = 'border-blue-600';
          } else {
             // Business Prospect: Brown/Amber Pop (Orange/Amber Gradient)
             cardBg = 'bg-gradient-to-br from-orange-100 to-orange-200 shadow-orange-100'; 
             baseBorder = 'border-orange-700';
          }
      }

      let borderColor = baseBorder;
      if (client.isCOI) borderColor = 'border-4 border-slate-700'; // High contrast
      if (client.isBNI) borderColor = 'border-4 border-yellow-500'; // Gold/Yellow

      const handleSave = () => {
          onUpdate(editData);
          setIsEditing(false);
      };

      const handleEditChange = (field, value, side = null) => {
          const newData = { ...editData };
          if (side === 'Client') newData.clientSide = { ...newData.clientSide, [field]: value };
          else if (side === 'Business') newData.businessSide = { ...newData.businessSide, [field]: value };
          else newData[field] = value;
          setEditData(newData);
      };

      const handleUserRatingChange = (newRating) => {
          const rating = parseInt(newRating, 10);
          const oldRatingScore = (editData.userRating || 0) * 10;
          const newRatingScore = rating * 10;
          let currentBaseScore = editData.relationshipScore - oldRatingScore;
          if (currentBaseScore < 0) currentBaseScore = 0; 
          const newData = { ...editData, userRating: rating, relationshipScore: Math.min(100, currentBaseScore + newRatingScore) };
          setEditData(newData);
      };

      const toggleArrayItem = (side, field, item) => {
          const newData = { ...editData };
          const target = side === 'Client' ? newData.clientSide : newData.businessSide;
          const list = target[field] || [];
          if (list.includes(item)) target[field] = list.filter(i => i !== item);
          else target[field] = [...list, item];
          setEditData(newData);
      };

      const handleManualFlip = () => {
          setIsFlipped(!isFlipped);
          setVisibleFace(visibleFace === 'Client' ? 'Business' : 'Client');
      };

      const handleSetPrimaryClick = () => {
          onUpdate({ ...client, primarySide: visibleFace });
      };

      if (!isExpanded) {
          // Helper for urgency color
          const getQuestColorClass = (q) => {
              if (q.status === 'Cooldown') return 'bg-blue-500 border-blue-200';
              const days = getDaysOut(q.dueDate);
              if (days < 0) return 'bg-purple-600 border-purple-200'; // Overdue
              if (days <= 1) return 'bg-red-600 border-red-200'; // Today/Tomorrow
              if (days < 4) return 'bg-yellow-500 border-yellow-200'; // Soon
              return 'bg-green-600 border-green-200'; // Later
          };

          return (
              <div 
                ref={el => (cardRefs.current[client.id] = el)}
                onClick={onToggle}
                className={`relative p-3 mb-2 rounded shadow-sm border-2 ${borderColor} ${cardBg} cursor-pointer hover:shadow-md transition-all`}
              >
                  {/* Active Quest Indicators */}
                  {activeQuests.length > 0 && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-row items-center">
                          {activeQuests.map((q, i) => (
                              <div 
                                  key={q.id} 
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-white font-bold text-xs shadow-sm ${getQuestColorClass(q)} ${i > 0 ? '-ml-2' : ''}`}
                                  style={{ zIndex: 10 - i }}
                                  title={`${q.type} - Due ${formatDisplayDate(q.dueDate)}`}
                              >
                                  !
                              </div>
                          ))}
                      </div>
                  )}

                  <div className="grid grid-cols-12 gap-2 items-center">
                      {/* 1. Name */}
                      <div className="col-span-3 overflow-hidden flex flex-col justify-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Name</span>
                          <div className="font-serif font-bold text-[#2c241b] truncate" title={displayCardName}>{displayCardName || '-'}</div>
                      </div>
                      
                      {/* 2. Phone */}
                      <div className="col-span-2 overflow-hidden flex flex-col justify-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Phone</span>
                          <div className="text-xs text-stone-600 font-mono truncate">{displayCardPhone ? formatPhoneNumber(displayCardPhone) : '-'}</div>
                      </div>
                      
                      {/* 3. Notes */}
                      <div className="col-span-3 overflow-hidden flex flex-col justify-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Latest Note</span>
                          <div className="text-xs text-stone-600 truncate italic">{trackedQuest && trackedQuest.notes && trackedQuest.notes.length > 0 ? `"${trackedQuest.notes[trackedQuest.notes.length-1].text}"` : '-'}</div>
                      </div>
                      
                      {/* 4. Quest Type */}
                      <div className="col-span-2 overflow-hidden flex flex-col justify-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Current Quest</span>
                          <div className="text-xs font-bold text-[#8b4513] truncate">{trackedQuest ? trackedQuest.type : '-'}</div>
                      </div>
                      
                      {/* 5. Relationship Score (Numeric now) */}
                      <div className="col-span-1 flex flex-col justify-center text-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Score</span>
                          <div className="font-bold text-[#8b4513] text-sm">
                              {!client.isStandalone ? `${client.relationshipScore}` : '-'}
                          </div>
                      </div>

                      {/* 6. Due Date (Badge) - MOVED TO END */}
                      <div className="col-span-1 flex flex-col justify-center text-center">
                          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider mb-0.5">Due</span>
                          <div className="flex justify-center">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${!trackedQuest ? 'border-transparent text-stone-400' : trackedQuest.status === 'Cooldown' ? 'bg-blue-100 text-blue-800 border-blue-300' : getDaysOut(trackedQuest.dueDate) < 1 ? 'bg-red-100 text-red-800 border-red-300' : getDaysOut(trackedQuest.dueDate) < 4 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'}`}>
                                  {trackedQuest ? (trackedQuest.status === 'Cooldown' ? 'Cool' : getDaysOut(trackedQuest.dueDate) <= 1 ? 'Now' : `${getDaysOut(trackedQuest.dueDate)}d`) : '-'}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div ref={el => (cardRefs.current[client.id] = el)} className="mb-6 perspective-1000 scroll-mt-24">
              <div className={`relative rounded-lg shadow-xl border-4 ${borderColor} ${cardBg} transition-all duration-500 transform-style-3d`}>
                  <div className="bg-[#e8e4d9] border-b border-[#d4c5a9] p-2 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <span className={`font-serif font-bold text-lg px-3 py-1 rounded ${client.isStandalone ? 'bg-purple-800 text-white' : isClientFace ? 'bg-emerald-800 text-white' : 'bg-blue-900 text-white'}`}>{client.isStandalone ? 'Standalone Quest' : isClientFace ? 'Client Card' : 'Business Card'}</span>
                          {!isEditing && !client.isStandalone && <button onClick={handleManualFlip} className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:brightness-110 transition-all border-2 border-[#1a1008] bg-gradient-to-b from-[#5c4033] to-[#2c241b] text-[#f5deb3] ${METALLIC_SHADOW} ${METALLIC_FONT}`}><RotateCcw size={14}/> Flip Card</button>}
                          {!isEditing && !client.isStandalone && <div className="flex items-center">{isPrimarySide ? <span className="text-xs font-bold text-[#8b4513] border-b-2 border-[#8b4513] px-2 ml-2">Primary</span> : <button onClick={handleSetPrimaryClick} className={`ml-2 text-xs font-bold px-2 py-1 rounded border-2 border-[#b91c1c] bg-gradient-to-b from-[#fca5a5] to-[#ef4444] text-[#7f1d1d] hover:brightness-110 transition-all ${METALLIC_SHADOW} ${METALLIC_FONT}`}>Set as Primary?</button>}</div>}
                      </div>
                      <div className="flex gap-2">
                          {!client.isStandalone && (
                              <button 
                                onClick={() => { setSelectedClient(client); setModals(m => ({...m, mergeCard: true})); }}
                                className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 bg-stone-200 border-2 border-stone-400 hover:bg-stone-300 text-stone-700"
                              >
                                  <Merge size={14}/> Merge
                              </button>
                          )}
                          {!isEditing ? <><button onClick={() => setIsEditing(true)} className="p-1 hover:bg-white rounded"><Edit2 size={18}/></button><button onClick={onToggle} className="p-1 hover:bg-white rounded"><X size={18}/></button></> : <><button onClick={() => setIsEditing(false)} className="text-xs font-bold text-red-700 hover:bg-red-100 px-3 py-1 rounded">Cancel Changes</button><RPGButton variant="primary" onClick={handleSave} className="text-xs px-3 py-1">Save</RPGButton></>}
                      </div>
                  </div>

                  <div className="p-6 grid grid-cols-12 gap-6 relative">
                      <div className="col-span-5 border-r border-[#d4c5a9] pr-6 space-y-4 max-h-[500px] overflow-y-auto">
                          <div>
                              {isEditing ? (isClientFace ? <input className="text-2xl font-serif font-bold text-[#2c241b] w-full bg-white border p-1" value={activeData.name} onChange={e => handleEditChange('name', e.target.value)} /> : <input className="text-2xl font-serif font-bold text-blue-800 w-full bg-white border p-1" value={activeData.businessSide.businessName} onChange={e => handleEditChange('businessName', e.target.value, 'Business')} />) : <h2 className={`text-2xl font-serif font-bold ${isClientFace ? 'text-[#2c241b]' : 'text-blue-900'}`}>{headerName}</h2>}
                              <div className="flex gap-2 mt-2">
                                  {isEditing && !client.isStandalone ? <><label className="flex items-center gap-1 text-[10px] font-bold"><input type="checkbox" checked={activeData.isCOI} onChange={e => handleEditChange('isCOI', e.target.checked)}/> COI</label><label className="flex items-center gap-1 text-[10px] font-bold"><input type="checkbox" checked={activeData.isBNI} onChange={e => handleEditChange('isBNI', e.target.checked)}/> BNI</label></> : <>{client.isCOI && <span className="text-[10px] bg-slate-200 border border-slate-400 px-2 rounded font-bold text-slate-700">COI</span>}{client.isBNI && <span className="text-[10px] bg-amber-100 border border-amber-400 px-2 rounded font-bold text-amber-700">BNI</span>}</>}
                              </div>
                          </div>
                          
                          {/* Conditionally Render Fields based on Card Type */}
                          {!client.isStandalone ? (
                            <div className="space-y-3 text-sm">
                                {isClientFace ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><label className="text-[10px] font-bold text-stone-500 uppercase">Phone</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.phone} onChange={e => handleEditChange('phone', e.target.value)}/> : <div className="font-mono">{formatPhoneNumber(activeData.phone)}</div>}</div>
                                            <div><label className="text-[10px] font-bold text-stone-500 uppercase">DOB</label>{isEditing ? <input className="w-full text-xs border p-1" type="date" value={activeData.dob} onChange={e => handleEditChange('dob', e.target.value)}/> : <div>{activeData.dob || '-'}</div>}</div>
                                        </div>
                                        <div><label className="text-[10px] font-bold text-stone-500 uppercase">Email</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.email} onChange={e => handleEditChange('email', e.target.value)}/> : <div className="truncate">{activeData.email}</div>}</div>
                                        <div><label className="text-[10px] font-bold text-stone-500 uppercase">Address</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.address} onChange={e => handleEditChange('address', e.target.value)}/> : <div className="truncate">{activeData.address}</div>}</div>
                                        <div><label className="text-[10px] font-bold text-stone-500 uppercase">Residence</label>{isEditing ? <select className="w-full text-xs border p-1" value={activeData.residenceType} onChange={e => handleEditChange('residenceType', e.target.value)}><option>Homeowner</option><option>Rent</option><option>Other</option></select> : <div>{activeData.residenceType}</div>}</div>
                                        
                                        <div className="bg-white p-2 rounded border border-[#d4c5a9]"><label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Line of Business</label>{isEditing ? <div className="grid grid-cols-2 gap-x-2 gap-y-1 border p-1">{CLIENT_LOB_OPTIONS.map(lob => (<label key={lob} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={activeSideData.lob.includes(lob)} onChange={() => toggleArrayItem('Client', 'lob', lob)}/> {lob}</label>))}</div> : <div className="flex flex-wrap gap-1">{activeSideData.lob.length > 0 ? activeSideData.lob.map(l => <span key={l} className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">{l}</span>) : <span className="text-xs text-stone-400">None</span>}</div>}</div>
                                        <div className="bg-white p-2 rounded border border-[#d4c5a9]"><label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Carriers</label>{isEditing ? <div className="grid grid-cols-2 gap-x-2 gap-y-1 border p-1">{CLIENT_CARRIER_OPTIONS.map(c => (<label key={c} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={activeSideData.carriers.includes(c)} onChange={() => toggleArrayItem('Client', 'carriers', c)}/> {c}</label>))}</div> : <div className="flex flex-wrap gap-1">{activeSideData.carriers.length > 0 ? activeSideData.carriers.map(c => <span key={c} className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">{c}</span>) : <span className="text-xs text-stone-400">None</span>}</div>}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><label className="text-[10px] font-bold text-stone-500 uppercase">Phone</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.businessSide.phone} onChange={e => handleEditChange('phone', e.target.value, 'Business')}/> : <div className="font-mono">{formatPhoneNumber(activeData.businessSide.phone)}</div>}</div>
                                            <div><label className="text-[10px] font-bold text-stone-500 uppercase">EIN</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.businessSide.ein} onChange={e => handleEditChange('ein', e.target.value, 'Business')}/> : <div>{activeData.businessSide.ein || '-'}</div>}</div>
                                        </div>
                                        <div><label className="text-[10px] font-bold text-stone-500 uppercase">Est.</label>{isEditing ? <input className="w-full text-xs border p-1" value={activeData.businessSide.established} onChange={e => handleEditChange('established', e.target.value, 'Business')}/> : <div>{activeData.businessSide.established || '-'}</div>}</div>
                                        <div><label className="text-[10px] font-bold text-stone-500 uppercase">Occupancy</label>{isEditing ? <select className="w-full text-xs border p-1" value={activeData.businessSide.occupancy} onChange={e => handleEditChange('occupancy', e.target.value, 'Business')}><option>Own</option><option>Lease</option><option>Other</option></select> : <div>{activeData.businessSide.occupancy}</div>}</div>
                                        <div className="bg-white p-2 rounded border border-[#d4c5a9]"><label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Business Lines</label>{isEditing ? <div className="grid grid-cols-2 gap-x-2 gap-y-1 border p-1">{BUSINESS_LOB_OPTIONS.map(lob => (<label key={lob} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={activeSideData.lob.includes(lob)} onChange={() => toggleArrayItem('Business', 'lob', lob)}/> {lob}</label>))}</div> : <div className="flex flex-wrap gap-1">{activeSideData.lob.length > 0 ? activeSideData.lob.map(l => <span key={l} className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">{l}</span>) : <span className="text-xs text-stone-400">None</span>}</div>}</div>
                                        <div className="bg-white p-2 rounded border border-[#d4c5a9]"><label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Business Carriers</label>{isEditing ? <div className="grid grid-cols-2 gap-x-2 gap-y-1 border p-1">{BUSINESS_CARRIER_OPTIONS.map(c => (<label key={c} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={activeSideData.carriers.includes(c)} onChange={() => toggleArrayItem('Business', 'carriers', c)}/> {c}</label>))}</div> : <div className="flex flex-wrap gap-1">{activeSideData.carriers.length > 0 ? activeSideData.carriers.map(c => <span key={c} className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">{c}</span>) : <span className="text-xs text-stone-400">None</span>}</div>}</div>
                                    </>
                                )}
                            </div>
                          ) : (
                              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded text-center text-sm text-purple-900">
                                  <p className="font-bold mb-2">Standalone Quest</p>
                                  <p className="italic">This is a temporary card for a one-off task. It will be removed upon completion.</p>
                              </div>
                          )}

                          {!client.isStandalone && <div className="pt-4 border-t border-[#d4c5a9]">
                              <div className="flex justify-between text-xs font-bold mb-1"><span>Relationship Score</span><span>{activeData.relationshipScore}/100</span></div><RelationshipBar score={activeData.relationshipScore} />
                              {isEditing && <div className="mt-4 bg-stone-100 p-2 rounded border border-stone-200"><div className="flex justify-between text-xs font-bold mb-1"><span>User Rating</span><span>{activeData.userRating || 0} / 5</span></div><input type="range" min="0" max="5" step="1" className="w-full accent-[#8b4513]" value={activeData.userRating || 0} onChange={(e) => handleUserRatingChange(e.target.value)}/><div className="text-[9px] text-stone-500 text-right mt-1">+{(activeData.userRating || 0) * 10} Score Points</div></div>}
                          </div>}

                          {/* Client Activity Log (Added below Quest Actions) */}
                          <div className="mt-8 border-t-2 border-[#d4c5a9] pt-4">
                              <h3 className="font-serif font-bold text-lg text-[#5d4037] flex items-center gap-2 mb-2">
                                  <Scroll size={18}/> {activeFace} Activity Log
                              </h3>
                              <div className="bg-white border border-[#d4c5a9] rounded-lg p-2 max-h-48 overflow-y-auto">
                                  {activeSideData.logs && activeSideData.logs.length > 0 ? (
                                      activeSideData.logs.map((log, i) => (
                                          <div key={log.id || i} className="text-xs py-1 border-b border-stone-100 last:border-0">
                                              <span className="font-bold text-[#8b4513]">{formatDisplayDate(log.date)}</span> - {log.questType}
                                              {log.exp > 0 && <span className="text-green-600 font-bold ml-1">+{log.exp} XP</span>}
                                          </div>
                                      ))
                                  ) : (
                                      <div className="text-xs text-stone-400 italic text-center py-2">No activity recorded yet.</div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="col-span-7">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-serif font-bold text-xl text-[#8b4513] flex items-center gap-2"><Sword size={20}/> Quest Actions</h3>
                              {activeQuests.length > 0 && activeQuests.length < 3 && !isEditing && (<RPGButton onClick={() => { setSelectedClient(client); setActiveSide(activeFace); setModals(m => ({...m, startQuest: true})); }} className="text-xs px-3 py-2 flex items-center gap-1"><Plus size={14}/> {activeQuests.length === 1 ? 'Start Second Quest' : 'Start Third Quest'}</RPGButton>)}
                          </div>

                          {activeQuests.length > 0 ? (
                              <div className="border-2 border-[#d4c5a9] rounded bg-white overflow-hidden shadow-inner">
                                          <div className="flex bg-[#e8e4d9] border-b border-[#d4c5a9]">
                                              {activeQuests.map((q, idx) => (
                                                  <button key={q.id} onClick={() => setQuestTab(idx)} className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${questTab === idx ? 'bg-white text-[#8b4513] border-t-4 border-[#8b4513]' : 'text-stone-500 hover:bg-[#f0ece3]'}`}>{idx === 0 ? '1st Quest' : idx === 1 ? '2nd Quest' : '3rd Quest'}</button>
                                              ))}
                                          </div>
                                          <div className="p-6">
                                              {(() => {
                                                  const q = activeQuests[questTab] || activeQuests[0];
                                                  if (!q) return null;
                                                  return (
                                                      <div key={q.id} className="animate-in fade-in duration-300">
                                                          <div className="flex justify-between items-start mb-6">
                                                              <div>
                                                                  <div className="text-2xl font-bold text-[#2c241b] font-serif">{q.type}</div>
                                                                  <div className="text-sm font-bold text-stone-500 mt-1">{q.status === 'Cooldown' ? 'On Cooldown' : formatDisplayDate(q.dueDate)}</div>
                                                              </div>
                                                              <button onClick={() => handleTrackQuest(client, activeFace, q.id)} className={`text-xs px-3 py-1 rounded border-2 font-bold flex items-center gap-1 transition-all ${q.tracked ? 'bg-gradient-to-b from-[#a05a2c] to-[#8b4513] text-white border-[#5c3a1e]' : 'bg-gradient-to-b from-white to-stone-100 text-stone-400 border-stone-300 hover:border-[#8b4513] hover:text-[#8b4513]'} ${METALLIC_SHADOW} ${METALLIC_FONT}`}>{q.tracked ? <CheckCircle size={12}/> : <div className="w-3 h-3 rounded-full border border-current"></div>}{q.tracked ? 'Tracking' : 'Track'}</button>
                                                          </div>

                                                          {q.status === 'Cooldown' ? (
                                                              <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
                                                                  <CooldownBar daysRemaining={getDaysOut(q.dueDate)} />
                                                                  <div className="flex gap-2 mt-4">
                                                                          <RPGButton variant="action" className="flex-1" onClick={() => performCooldownAction(client, activeFace, q, 'Continue')}>Continue Quest</RPGButton>
                                                                          <RPGButton className="flex-1" onClick={() => performCooldownAction(client, activeFace, q, 'Extend')}>Extend</RPGButton>
                                                                          <RPGButton variant="danger" className="flex-1" onClick={() => performCooldownAction(client, activeFace, q, 'Give Up')}>Give Up</RPGButton>
                                                                  </div>
                                                              </div>
                                                          ) : (
                                                              <div className="flex gap-3 mt-6">
                                                                  <RPGButton variant="action" className="flex-1 py-3 text-sm" onClick={() => handleOpenQuestResult('Continue', client, activeFace, q.id)}>Continue Quest</RPGButton>
                                                                  <RPGButton className="flex-1 py-3 text-sm" onClick={() => handleOpenQuestResult('Complete', client, activeFace, q.id)}>Complete</RPGButton>
                                                                  <RPGButton variant="danger" className="py-3 text-sm">Cancel</RPGButton>
                                                              </div>
                                                          )}
                                                          <div className="mt-4 text-center"><button onClick={() => { setSelectedClient(client); setActiveSide(activeFace); setActiveQuestId(q.id); setModals(m => ({...m, modifyQuest: true})); }} className="text-xs text-stone-400 hover:text-[#8b4513] underline">Modify Quest Details</button></div>
                                                      </div>
                                                  )
                                              })()}
                                          </div>
                              </div>
                          ) : (
                              <div className="p-12 border-2 border-dashed border-[#d4c5a9] rounded text-center bg-[#fdfbf7]">
                                          {isEditing ? <div className="text-red-700 font-bold flex flex-col items-center"><Ban size={32} className="mb-2"/>Save Changes Before Starting New Quest</div> : <><p className="text-stone-400 italic mb-4">No active quests on {activeFace} card.</p><RPGButton onClick={() => { setSelectedClient(client); setActiveSide(activeFace); setModals(m => ({...m, startQuest: true})); }}>Start Quest</RPGButton></>}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- RULES VIEW COMPONENT ---
  const RulesView = () => {
      return (
          <div className="grid grid-cols-2 gap-8 pb-20">
              <div className="col-span-2">
                  <h2 className="text-3xl font-serif font-bold text-[#2c241b] mb-4 border-b-4 border-[#d4c5a9] pb-2">Game Rules & Configuration</h2>
              </div>
              
              <div className="col-span-1 space-y-6">
                  <RuleSection title="General Rules" dataKey="general" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit=" " />
                  <RuleSection title="Card Quest Types" dataKey="cardQuestTypes" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit="Exp" />
                  <RuleSection title="Standalone Quest Types" dataKey="standaloneQuestTypes" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit="Exp" />
              </div>

              <div className="col-span-1 space-y-6">
                  <RuleSection title="Completion Types" dataKey="completionTypes" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit="%" />
                  <RuleSection title="Multipliers" dataKey="multipliers" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit="%" />
                  <RuleSection title="Bonuses" dataKey="bonuses" rules={rules} handleAddRule={handleAddRule} handleUpdateRule={handleUpdateRule} handleDeleteRule={handleDeleteRule} unit="Exp" />
                  
                  {/* Level Table (Custom) */}
                  <div className="bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-xl overflow-hidden shadow-md">
                      <div className="bg-[#2c241b] text-[#f5deb3] p-3 flex justify-between items-center">
                          <h3 className="font-serif font-bold text-lg">Level Progression</h3>
                          <button onClick={() => setModals(m => ({...m, levelTable: true}))} className="text-xs bg-[#eebb4d] text-[#2c241b] px-2 py-1 rounded font-bold hover:brightness-110">Edit Table</button>
                      </div>
                      <div className="p-4">
                          <table className="w-full text-sm text-left">
                              <thead className="text-stone-500 uppercase text-xs border-b"><tr><th>Lvl</th><th>Title</th><th>Exp</th><th>Reward</th></tr></thead>
                              <tbody>
                                  {rules.levels.map(l => (
                                      <tr key={l.id} className="border-b border-stone-100 last:border-0">
                                          <td className="py-2 font-bold">{l.level}</td>
                                          <td className="py-2 italic">{l.title}</td>
                                          <td className="py-2 font-mono">{l.exp}</td>
                                          <td className="py-2 text-[#8b4513]">{l.reward}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className={`min-h-screen ${view === 'hub' ? 'bg-slate-950' : 'bg-[#e8e4d9]'} flex flex-col h-screen font-sans selection:bg-[#d4c5a9]`}>
      
      {/* HEADER TABS */}
      <div className={`${view === 'hub' ? 'bg-slate-950 border-blue-600' : view === 'quests' ? 'bg-[#1f1b17] border-emerald-700' : view === 'binder' ? `bg-[#2c241b] border-pink-800` : 'bg-[#2c241b] border-[#daa520]'} flex justify-center p-0 sticky top-0 z-50 shadow-lg border-b-4 transition-colors duration-500 shrink-0`}>
          {['Hub', 'Quests', 'Binder', 'Rules'].map(tab => {
              const isActive = view === tab.toLowerCase();
              let activeStyle = '';
              
              if (isActive) {
                  switch(tab) {
                      case 'Hub': activeStyle = 'text-blue-100 bg-blue-800 border-2 border-blue-500 border-b-0 -mb-[4px] pb-1 rounded-t-lg shadow-[0_-5px_15px_rgba(59,130,246,0.4)] z-20'; break;
                      case 'Quests': activeStyle = 'text-emerald-100 bg-emerald-800 border-2 border-emerald-500 border-b-0 -mb-[4px] pb-1 rounded-t-lg shadow-[0_-5px_15px_rgba(16,185,129,0.4)] z-20'; break;
                      case 'Binder': activeStyle = `text-pink-100 bg-pink-800 border-2 border-pink-600 border-b-0 -mb-[4px] pb-1 rounded-t-lg shadow-[0_-5px_15px_rgba(236,72,153,0.4)] z-20`; break;
                      case 'Rules': activeStyle = 'text-[#3e2723] bg-[#d7ccc8] border-[#5d4037] -mt-2 rounded-t-xl font-serif italic tracking-wider border-x-4 border-t-4 z-10'; break;
                      default: activeStyle = 'text-[#f5deb3] bg-[#3e3226] border-[#daa520] -mt-1 rounded-t-lg';
                  }
              } else {
                   switch(tab) {
                      case 'Hub': activeStyle = 'text-blue-400/60 bg-blue-950/60 border-blue-900/50 mt-1'; break;
                      case 'Quests': activeStyle = 'text-emerald-400/60 bg-emerald-950/60 border-emerald-900/50 mt-1'; break;
                      case 'Binder': activeStyle = `text-pink-400/60 ${BINDER_THEME.spine}/60 border-pink-900/50 mt-1`; break;
                      case 'Rules': activeStyle = 'text-[#a1887f] bg-[#3e2723]/80 border-[#281915] mt-1'; break;
                  }
              }

              return (
                  <button key={tab} onClick={() => setView(tab.toLowerCase())} className={`px-8 py-3 font-serif font-bold text-lg transition-all border-t-4 mx-1 rounded-t-lg border-x border-b-0 ${activeStyle}`}>
                      {tab}
                  </button>
              );
          })}
      </div>

      <div className={`flex-1 w-full relative overflow-hidden ${view === 'hub' ? HUB_THEME.bg : view === 'quests' ? QUEST_THEME.bg : view === 'binder' ? BINDER_THEME.bg : THEME.bg}`}>
        <div className={`h-full w-full ${view === 'quests' ? '' : 'p-6 max-w-7xl mx-auto overflow-y-auto'}`}>
        
        {view === 'hub' && (
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column (Stats & Actions & Log) */}
                <div className="col-span-4 space-y-6">
                    {/* Retro File Select Header */}
                    <div className={`${HUB_THEME.panel} p-1 rounded-xl overflow-hidden`}>
                        <div className="flex items-center bg-blue-950/50 p-3 border-b border-blue-500/30">
                             <div className="bg-blue-900 border-2 border-blue-400 rounded shadow-inner px-3 py-1 flex items-center justify-center min-w-[80px]">
                                     <div className="text-blue-200 font-serif font-bold flex items-baseline gap-2"><span className="text-sm uppercase tracking-widest text-blue-300">Level</span><span className="text-3xl text-blue-100">{userStats.level}</span></div>
                             </div>
                             <div className="flex-1 text-right pr-2">
                                {isEditingName ? (
                                    <input className="bg-transparent border-b border-cyan-500 text-cyan-100 font-bold text-right w-full focus:outline-none" value={userStats.name} onChange={(e) => setUserStats({...userStats, name: e.target.value})} onBlur={() => setIsEditingName(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)} autoFocus />
                                ) : (
                                    <h2 className={`text-blue-50 font-serif drop-shadow-md text-lg font-bold cursor-pointer hover:text-cyan-200 flex items-center justify-end gap-2 group`} onClick={() => setIsEditingName(true)}>
                                        <span className="border-b border-dashed border-blue-500/50 hover:border-cyan-400">{userStats.name}</span>
                                        <Edit2 size={14} className="text-cyan-500 opacity-70 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                                    </h2>
                                )}
                             </div>
                        </div>
                        <div className="p-4 bg-slate-900/40">
                            <div className="flex justify-between text-[10px] font-bold text-cyan-200/70 mb-1 font-mono uppercase"><span>{expData.currentExp} Exp</span><span>Next: {expData.maxExp}</span></div>
                            <div className="w-full h-5 bg-slate-950 rounded-full border border-blue-600/50 relative overflow-hidden shadow-inner">
                                <div className={`absolute top-0 left-0 h-full ${HUB_THEME.barFill} shadow-[0_0_15px_cyan] transition-all duration-700 ease-out`} style={{ width: `${expData.percent}%` }}></div>
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                            </div>
                            <div className="text-center text-[9px] text-blue-300 mt-2 font-mono">{expData.remaining} Exp UNTIL LEVEL UP</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className={`w-full py-4 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-700 to-emerald-900 text-emerald-100 border-4 border-emerald-950 text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1 bg-emerald-950 rounded-full border border-emerald-400 group-hover:scale-110 transition-transform shadow-inner"><Coins size={16}/></div>Start Card Quest</button>
                        <button onClick={() => { setIsStandaloneCreation(true); setSelectedClient(null); setModals({...modals, startQuest: true}); }} className={`w-full py-4 rounded-xl bg-gradient-to-b from-[#e879f9] via-[#d946ef] to-[#9333ea] text-white border-4 border-purple-950 text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="w-8 h-8 bg-purple-900 rounded-full border border-purple-400 flex items-center justify-center font-serif italic text-xl group-hover:scale-110 transition-transform shadow-inner shrink-0">S</div>Start Standalone Quest</button>
                        <button onClick={() => handleDrawCard('Client')} className={`w-full py-3 rounded-xl bg-gradient-to-b from-[#faeebf] via-[#eebb4d] to-[#aa7e22] text-[#3e2723] border-4 border-[#5c3a1e] text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1.5 bg-[#5c3a1e] rounded-full border border-[#faeebf] group-hover:scale-110 transition-transform shadow-inner text-[#faeebf]"><Layers size={18}/></div>Draw New Card</button>
                    </div>

                    <div className={`${HUB_THEME.panel} p-3 rounded-xl`}>
                        <h3 className="text-blue-200 font-bold border-b border-blue-500/30 pb-1 mb-2 text-xs uppercase tracking-wider flex items-center gap-2"><Target size={14} className="text-cyan-400"/> Per Hit Rate</h3>
                        <div className="flex justify-between items-end mb-1"><span className="text-sm text-blue-300/70 font-mono">Targeted</span><span className="text-xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">$0</span></div>
                        <div className="flex justify-between items-end"><span className="text-sm text-blue-300/70 font-mono">Idle</span><span className="text-xl font-mono font-bold text-blue-300">$0</span></div>
                    </div>

                    {/* MOVED BONUS BOARD HERE */}
                    <div className={`${HUB_THEME.panel} p-4 rounded-xl overflow-hidden`}>
                        <h3 className="text-blue-200 font-bold border-b border-blue-500/30 pb-1 mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            <Award size={14} className="text-yellow-400"/> Bonus Board
                        </h3>
                        <div className="space-y-3">
                            {rules.bonuses && rules.bonuses.map(bonus => {
                                const current = bonusProgress[bonus.id] || 0;
                                const required = bonus.target || 1;
                                const percent = Math.min(100, (current / required) * 100);
                                
                                return (
                                    <div key={bonus.id} className="bg-blue-950/50 p-2 rounded border border-blue-800">
                                        <div className="text-[10px] font-bold text-blue-200 mb-1 truncate">{bonus.name}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-3 bg-blue-950 rounded-full border border-blue-600 relative overflow-hidden">
                                                <div 
                                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" 
                                                  style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-[9px] font-mono text-cyan-300 font-bold">
                                                {current}/{required}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-span-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-2xl font-bold ${HUB_THEME.textMain} flex items-center gap-2`}><Scroll size={24} className="text-cyan-400"/> Active Quests</h2>
                        <div className="text-sm font-bold text-cyan-100 bg-blue-900/50 border border-blue-500/50 px-3 py-1 rounded backdrop-blur-md font-mono">{formatDateStandard(new Date())}</div>
                    </div>
                    <div className="space-y-2">
                        {sortedClients.filter(c => c.clientSide.quests.some(q=>q.status==='Active' || q.status==='Cooldown') || c.businessSide.quests.some(q=>q.status==='Active' || q.status==='Cooldown')).map(client => (
                            <ClientCard key={client.id} client={client} isExpanded={expandedCardId === client.id} onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)} onUpdate={handleUpdateClient} />
                        ))}
                        {clients.length === 0 && (
                            <div className="p-12 border-4 border-dashed border-blue-500/20 rounded-2xl bg-blue-950/40 text-center backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-cyan-200 mb-2">The Quest Board is Empty</h3>
                                <p className="text-blue-300/60 mb-6">Your adventure awaits! Start a new quest or draw a new card to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* RULES VIEW */}
        {view === 'rules' && <RulesView />}

        {/* BINDER VIEW */}
        {view === 'binder' && (
            <div>
                <div className="flex justify-between items-end mb-6 border-b-4 border-purple-900/30 pb-4">
                    <div className="flex items-center gap-4">
                        <div className={`flex flex-col gap-2 border-r-4 border-stone-400 pr-4 ${BINDER_THEME.spine} p-2 rounded-l-lg`}>{[...Array(3)].map((_,i) => (<div key={i} className={`w-4 h-4 rounded-full ${BINDER_THEME.ring} shadow-sm border border-stone-500`}></div>))}</div>
                        <div><h2 className="text-4xl font-serif font-bold text-purple-100 drop-shadow-md">The Binder</h2><p className={`text-purple-200/80 italic`}>Repository of Known Associates</p></div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => initBooster()} className={`group flex items-center px-4 py-2 rounded-xl bg-gradient-to-b from-pink-400 via-pink-600 to-pink-800 text-white border-4 border-pink-900 hover:brightness-110 active:scale-95 transition-all ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1 bg-pink-950 rounded-full border border-pink-400 group-hover:scale-110 transition-transform mr-2 shadow-inner"><Upload size={14}/></div> Add Booster Pack</button>
                        <button onClick={() => handleDrawCard('Client')} className={`group flex items-center px-4 py-2 rounded-xl bg-gradient-to-b from-[#faeebf] via-[#eebb4d] to-[#aa7e22] text-[#3e2723] border-4 border-[#5c3a1e] hover:brightness-110 active:scale-95 transition-all ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1 bg-[#5c3a1e] rounded-full border border-[#faeebf] group-hover:scale-110 transition-transform mr-2 text-[#faeebf] shadow-inner"><Layers size={14}/></div> Draw New Card</button>
                    </div>
                </div>

                <div className="mb-6 flex gap-4 bg-purple-900/30 p-4 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18}/>
                        <input className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded focus:outline-none focus:border-purple-500 text-stone-900 placeholder-stone-400" placeholder="Search by Name, Phone, Address..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} className={`flex items-center gap-2 bg-gradient-to-b from-orange-400 via-orange-600 to-red-700 text-white border-4 border-red-900 px-3 py-2 rounded-xl hover:brightness-110 transition-all shadow-sm ${METALLIC_SHADOW} ${METALLIC_FONT}`}><List size={14}/> Organize By: {sort}</button>
                        {isSortMenuOpen && (<div className="absolute right-0 top-full mt-2 w-64 bg-[#fdfbf7] border-2 border-[#d4c5a9] rounded-lg shadow-xl z-50 overflow-hidden">{['Alphabetical', 'Due Date', 'Client Side', 'Business Side', 'CoI', 'BNI', 'Relationship Score', 'Farmers First', 'Life First', 'Exp Earned', 'Commission Earned'].map(opt => (<button key={opt} onClick={() => { setSort(opt); setIsSortMenuOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-[#e8e4d9] text-[#2c241b] text-sm font-serif font-bold border-b border-stone-100 last:border-0 flex justify-between items-center ${sort === opt ? 'bg-[#e8e4d9] text-[#8b4513]' : ''}`}>{opt}{sort === opt && <CheckCircle size={12} className="text-emerald-600"/>}</button>))}</div>)}
                    </div>
                </div>

                <div className="space-y-2">
                    {sortedClients.map(client => (<ClientCard key={client.id} client={client} isExpanded={expandedCardId === client.id} onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)} onUpdate={handleUpdateClient} />))}
                    {clients.length === 0 && (<div className="text-center py-12 opacity-50 text-purple-200"><Book size={64} className="mx-auto mb-4 opacity-80"/><h3 className="text-xl font-bold">Binder Empty</h3><p>No cards collected yet.</p></div>)}
                </div>
            </div>
        )}

        {/* QUEST SCREEN */}
        {view === 'quests' && (
             <div className="relative h-full w-full">
                <div className="absolute left-0 top-0 w-1/4 h-full z-10 p-4 flex flex-col gap-4">
                    <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900" size={18}/>
                         <input className="w-full pl-10 pr-4 py-3 border-2 border-emerald-800 rounded-xl bg-emerald-50/90 shadow-lg focus:outline-none focus:border-emerald-600 font-bold text-emerald-900" placeholder="Search Quests..." />
                    </div>
                    
                    {/* BUTTONS */}
                    <button onClick={() => { setIsStandaloneCreation(false); setModals({...modals, startQuest: true}); }} className={`w-full py-4 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-700 to-emerald-900 text-emerald-100 border-4 border-emerald-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1 bg-emerald-950 rounded-full border border-emerald-400 group-hover:scale-110 transition-transform shadow-inner"><Coins size={18}/></div>Start Card Quest</button>
                    <button onClick={() => { setIsStandaloneCreation(true); setSelectedClient(null); setModals({...modals, startQuest: true}); }} className={`w-full py-4 rounded-xl bg-gradient-to-b from-[#e879f9] via-[#d946ef] to-[#9333ea] text-white border-4 border-purple-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="w-8 h-8 bg-purple-900 rounded-full border border-purple-400 flex items-center justify-center font-serif italic text-xl group-hover:scale-110 transition-transform shadow-inner shrink-0">S</div>Start Standalone Quest</button>
                    <button className={`w-full py-4 rounded-xl bg-gradient-to-b from-blue-400 via-blue-800 to-[#172554] text-blue-100 border-4 border-blue-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}><div className="p-1 bg-blue-900 rounded-full border border-blue-400 group-hover:scale-110 transition-transform shadow-inner shrink-0"><Map size={18}/></div> Explore for Quests</button>

                    {/* NEW: Scroll Activity Log (Replaces Bonus Board) */}
                    <ScrollLog dailyLog={dailyLog} />
                </div>
                <div className="absolute right-4 top-4 bottom-0 w-3/4">
                    <div className={`w-full h-full rounded-t-2xl border-b-0 ${QUEST_THEME.tray} p-6 overflow-y-auto`}>
                         <div className="grid grid-cols-1 gap-4">
                             {sortedClients.filter(c => c.clientSide.quests.some(q=>q.status==='Active' || q.status==='Cooldown') || c.businessSide.quests.some(q=>q.status==='Active' || q.status==='Cooldown')).map(client => (<ClientCard key={client.id} client={client} isExpanded={expandedCardId === client.id} onToggle={() => setExpandedCardId(expandedCardId === client.id ? null : client.id)} onUpdate={handleUpdateClient} />))}
                         </div>
                         {clients.length === 0 && (<div className="h-full flex flex-col items-center justify-center text-emerald-100/50"><Map size={64} className="mb-4 opacity-50"/><h3 className="text-2xl font-bold font-serif">No Active Quests</h3><p>The realm is quiet... for now.</p></div>)}
                    </div>
                </div>
            </div>
        )}
        </div>
      </div>
      
      {/* 5. Quest Result Modal (Complete / Continue) */}
      {modals.questResult && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
              <div className="bg-[#fdfbf7] w-full max-w-lg rounded-lg shadow-2xl border-4 border-[#d4c5a9] overflow-hidden">
                  <div className={`p-4 border-b border-[#d4c5a9] flex justify-between items-center ${questActionType === 'Complete' ? 'bg-[#14532d] text-white' : 'bg-[#1e3a8a] text-white'}`}>
                      <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                          {questActionType === 'Complete' ? <CheckCircle size={24}/> : <ArrowRight size={24}/>}
                          {questActionType === 'Complete' ? 'Quest Completion' : 'Quest Progression'}
                      </h3>
                      <button onClick={() => setModals({...modals, questResult: false})}><X/></button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      {/* 1. Completion Type */}
                      <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Result / Completion Type</label>
                          <select 
                              className="w-full p-2 border-2 border-[#d4c5a9] rounded bg-white font-bold text-[#2c241b]"
                              value={questResultData.completionTypeId}
                              onChange={(e) => setQuestResultData({...questResultData, completionTypeId: e.target.value})}
                          >
                              {rules.completionTypes.map(ct => (
                                  <option key={ct.id} value={ct.id}>{ct.name} (+{ct.bonusPercent}%)</option>
                              ))}
                          </select>
                      </div>

                      {/* 2. Commission */}
                      <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Commission Earned</label>
                          <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" size={16}/>
                              <input 
                                  type="number" 
                                  className="w-full pl-9 p-2 border-2 border-[#d4c5a9] rounded bg-white font-mono"
                                  value={questResultData.commission}
                                  onChange={(e) => setQuestResultData({...questResultData, commission: e.target.value})}
                              />
                          </div>
                      </div>

                      {/* 3. Continue Logic (Only if Continuing) */}
                      {questActionType === 'Continue' && (
                          <div className="bg-blue-50 p-4 rounded border-2 border-blue-200 space-y-4">
                              <h4 className="font-bold text-blue-900 text-sm border-b border-blue-200 pb-1">Next Step</h4>
                              
                              <label className="flex items-center gap-2 font-bold text-blue-800">
                                  <input 
                                      type="checkbox" 
                                      checked={questResultData.isCooldown}
                                      onChange={(e) => setQuestResultData({...questResultData, isCooldown: e.target.checked})}
                                  />
                                  Put into Cooldown?
                              </label>

                              {!questResultData.isCooldown && (
                                  <div>
                                      <label className="block text-xs font-bold text-blue-500 uppercase mb-1">Next Quest Type</label>
                                      <select 
                                          className="w-full p-2 border border-blue-300 rounded bg-white"
                                          value={questResultData.nextQuestTypeId}
                                          onChange={(e) => setQuestResultData({...questResultData, nextQuestTypeId: e.target.value})}
                                      >
                                          {selectedClient?.isStandalone ? (
                                              <optgroup label="Standalone Quests">
                                                  {rules.standaloneQuestTypes.map(qt => <option key={qt.id} value={qt.id}>{qt.name}</option>)}
                                              </optgroup>
                                          ) : (
                                              <optgroup label="Card Quests">
                                                  {rules.cardQuestTypes.map(qt => <option key={qt.id} value={qt.id}>{qt.name}</option>)}
                                              </optgroup>
                                          )}
                                      </select>
                                  </div>
                              )}

                              <div>
                                  <label className="block text-xs font-bold text-blue-500 uppercase mb-1">New Due Date</label>
                                  <input 
                                      type="date" 
                                      className="w-full p-2 border border-blue-300 rounded bg-white" 
                                      value={questResultData.nextDueDate}
                                      onChange={(e) => setQuestResultData({...questResultData, nextDueDate: e.target.value})}
                                  />
                              </div>
                          </div>
                      )}
                      
                      {/* Notes Field (NEW) */}
                      <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Quest Note</label>
                          <textarea 
                              className="w-full p-2 border border-[#d4c5a9] rounded bg-white h-20 text-sm" 
                              placeholder="Describe the outcome..."
                              value={resultQuestNote}
                              onChange={(e) => setResultQuestNote(e.target.value)}
                          />
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[#d4c5a9]">
                          <button onClick={() => setModals({...modals, questResult: false})} className="px-4 py-2 text-stone-500 font-bold hover:text-stone-800">Cancel</button>
                          <RPGButton variant={questActionType === 'Complete' ? 'action' : 'primary'} onClick={processQuestResult}>
                              {questActionType === 'Complete' ? 'Complete Quest' : 'Log Progress'}
                          </RPGButton>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 1. Draw Card Modal */}
      {modals.drawCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
              <div className="bg-[#fdfbf7] w-full max-w-4xl rounded-lg shadow-2xl border-4 border-[#d4c5a9] max-h-[90vh] overflow-y-auto">
                  <div className="bg-[#2c241b] text-[#f5deb3] p-4 border-b border-[#d4c5a9] flex justify-between items-center">
                      <h3 className="font-serif font-bold text-xl">Draw New Card</h3>
                      <button onClick={() => setModals({...modals, drawCard: false})}><X/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Side Selection */}
                      <div className="flex gap-4 mb-4">
                           <button onClick={() => setNewCardData({...newCardData, primarySide: 'Client'})} className={`flex-1 py-3 font-bold border-2 rounded ${newCardData.primarySide === 'Client' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-stone-200 text-stone-400'}`}>Client Side (Front)</button>
                           <button onClick={() => setNewCardData({...newCardData, primarySide: 'Business'})} className={`flex-1 py-3 font-bold border-2 rounded ${newCardData.primarySide === 'Business' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-stone-200 text-stone-400'}`}>Business Side (Back)</button>
                      </div>
                      <p className="text-xs text-center font-bold text-stone-500 italic mb-2">The selected tab above determines which side will be the PRIMARY side when added to the binder.</p>
                      
                      <div className="grid grid-cols-2 gap-8">
                          {/* Client Side Column */}
                          <div className={`space-y-4 p-4 rounded border-2 ${newCardData.primarySide === 'Client' ? 'border-emerald-500 bg-emerald-50/50' : 'border-stone-200 bg-stone-50/50 grayscale opacity-70'}`}>
                              <h4 className="font-bold text-lg text-emerald-800 border-b border-emerald-200 pb-2 mb-2 flex items-center gap-2">
                                  <UserPlus size={18}/> Client Details
                              </h4>
                              
                              <div><label className="text-xs font-bold uppercase text-stone-500">Name</label><input className="w-full border p-2 rounded bg-white" value={newCardData.name} onChange={e => setNewCardData({...newCardData, name: e.target.value})} placeholder="Primary Client Name"/></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Phone</label><input className="w-full border p-2 rounded bg-white" value={newCardData.phone} onChange={e => setNewCardData({...newCardData, phone: e.target.value})} placeholder="Personal Phone"/></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Email</label><input className="w-full border p-2 rounded bg-white" value={newCardData.email} onChange={e => setNewCardData({...newCardData, email: e.target.value})} /></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Address</label><input className="w-full border p-2 rounded bg-white" value={newCardData.address} onChange={e => setNewCardData({...newCardData, address: e.target.value})} /></div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                  <div><label className="text-xs font-bold uppercase text-stone-500">DOB</label><input className="w-full border p-2 rounded bg-white" type="date" value={newCardData.dob} onChange={e => setNewCardData({...newCardData, dob: e.target.value})} /></div>
                                  <div><label className="text-xs font-bold uppercase text-stone-500">License #</label><input className="w-full border p-2 rounded bg-white" value={newCardData.license} onChange={e => setNewCardData({...newCardData, license: e.target.value})} /></div>
                              </div>
                              
                              <div><label className="text-xs font-bold uppercase text-stone-500">Residence</label>
                                  <select className="w-full border p-2 rounded bg-white" value={newCardData.residenceType} onChange={e => setNewCardData({...newCardData, residenceType: e.target.value})}>
                                          <option>Homeowner</option><option>Rent</option><option>Other</option>
                                  </select>
                              </div>

                              {/* Client LoB Selection */}
                              <div className="mt-4">
                                  <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Client Lines of Business</label>
                                  <div className="grid grid-cols-2 gap-1 border p-2 bg-white rounded">
                                      {CLIENT_LOB_OPTIONS.map(lob => (
                                          <label key={lob} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={newCardData.clientSide.lob.includes(lob)} onChange={() => toggleNewCardItem('Client', 'lob', lob)}/> {lob}</label>
                                      ))}
                                  </div>
                              </div>
                              <div className="mt-2">
                                  <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Client Carriers</label>
                                  <div className="grid grid-cols-2 gap-1 border p-2 bg-white rounded">
                                      {CLIENT_CARRIER_OPTIONS.map(c => (
                                          <label key={c} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={newCardData.clientSide.carriers.includes(c)} onChange={() => toggleNewCardItem('Client', 'carriers', c)}/> {c}</label>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Business Side Column */}
                          <div className={`space-y-4 p-4 rounded border-2 ${newCardData.primarySide === 'Business' ? 'border-blue-500 bg-blue-50/50' : 'border-stone-200 bg-stone-50/50 grayscale opacity-70'}`}>
                              <h4 className="font-bold text-lg text-blue-800 border-b border-blue-200 pb-2 mb-2 flex items-center gap-2">
                                  <Briefcase size={18}/> Business Details
                              </h4>

                              <div><label className="text-xs font-bold uppercase text-stone-500">Business Name</label><input className="w-full border p-2 rounded bg-white" value={newCardData.businessSide.businessName} onChange={e => setNewCardData({...newCardData, businessSide: {...newCardData.businessSide, businessName: e.target.value}})} placeholder="Company Name"/></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Business Phone</label><input className="w-full border p-2 rounded bg-white" value={newCardData.businessSide.phone} onChange={e => setNewCardData({...newCardData, businessSide: {...newCardData.businessSide, phone: e.target.value}})} placeholder="Work Phone"/></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">EIN</label><input className="w-full border p-2 rounded bg-white" value={newCardData.businessSide.ein} onChange={e => setNewCardData({...newCardData, businessSide: {...newCardData.businessSide, ein: e.target.value}})} /></div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Occupancy</label>
                                    <select className="w-full border p-2 rounded bg-white" value={newCardData.businessSide.occupancy} onChange={e => setNewCardData({...newCardData, businessSide: {...newCardData.businessSide, occupancy: e.target.value}})}>
                                            <option>Own</option><option>Lease</option><option>Other</option>
                                    </select>
                              </div>
                              <div><label className="text-xs font-bold uppercase text-stone-500">Est.</label><input className="w-full border p-2 rounded bg-white" value={newCardData.businessSide.established} onChange={e => setNewCardData({...newCardData, businessSide: {...newCardData.businessSide, established: e.target.value}})} placeholder="Year"/></div>

                              {/* Business LoB Selection */}
                              <div className="mt-4">
                                  <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Business Lines</label>
                                  <div className="grid grid-cols-2 gap-1 border p-2 bg-white rounded">
                                      {BUSINESS_LOB_OPTIONS.map(lob => (
                                          <label key={lob} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={newCardData.businessSide.lob.includes(lob)} onChange={() => toggleNewCardItem('Business', 'lob', lob)}/> {lob}</label>
                                      ))}
                                  </div>
                              </div>
                              <div className="mt-2">
                                  <label className="text-xs font-bold uppercase text-stone-500 block mb-1">Business Carriers</label>
                                  <div className="grid grid-cols-2 gap-1 border p-2 bg-white rounded">
                                      {BUSINESS_CARRIER_OPTIONS.map(c => (
                                          <label key={c} className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={newCardData.businessSide.carriers.includes(c)} onChange={() => toggleNewCardItem('Business', 'carriers', c)}/> {c}</label>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-4 border-t pt-4">
                          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={newCardData.isCOI} onChange={e => setNewCardData({...newCardData, isCOI: e.target.checked})}/> COI (Center of Influence)</label>
                          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={newCardData.isBNI} onChange={e => setNewCardData({...newCardData, isBNI: e.target.checked})}/> BNI Member</label>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-stone-200">
                          <RPGButton variant="gold" onClick={saveNewCard}>Add to Binder</RPGButton>
                      </div>
                  </div>
              </div>
          </div>
      )}
      
      {/* 2. Booster Pack Modal */}
      {modals.boosterPack && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
              <div className="bg-[#fdfbf7] rounded-lg shadow-xl border-4 border-[#d4c5a9] w-[90%] max-w-6xl flex flex-col max-h-[90vh]">
                  <div className="bg-[#2c241b] text-[#f5deb3] p-4 border-b border-[#d4c5a9] flex justify-between items-center">
                      <h3 className="font-serif font-bold text-xl">Open Booster Pack (Import)</h3>
                      <button onClick={() => setModals({...modals, boosterPack: false})} className="hover:text-white"><X/></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1">
                      {/* Section 1: Define Structure */}
                      <div className="mb-6 border-b border-[#d4c5a9] pb-6">
                          <h4 className="font-bold text-[#8b4513] mb-4 flex items-center gap-2"><Database size={18}/> 1. Define CSV Structure</h4>
                          
                          <div className="flex items-center gap-4 mb-4">
                              <label className="text-sm font-bold text-stone-600">How many columns in your file?</label>
                              <input 
                                type="number" 
                                min="1" 
                                max="20"
                                className="w-16 p-2 border border-[#d4c5a9] rounded text-center font-bold"
                                value={boosterSchema.colCount}
                                onChange={(e) => updateBoosterColCount(e.target.value)}
                              />
                          </div>

                          <div className="grid grid-cols-6 gap-4">
                              {boosterSchema.columns.map((colType, idx) => (
                                  <div key={idx} className="bg-white p-2 rounded border border-[#d4c5a9]">
                                      <div className="text-[10px] font-bold text-stone-400 uppercase mb-1">Column {idx + 1}</div>
                                      <select 
                                        className="w-full p-1 text-sm border-none focus:ring-0 bg-transparent font-bold text-[#2c241b]"
                                        value={colType}
                                        onChange={(e) => updateBoosterColumnType(idx, e.target.value)}
                                      >
                                          <option value="Ignore">Ignore Column</option>
                                          <option value="Name">Name</option>
                                          <option value="Phone">Phone</option>
                                          <option value="Address">Address</option>
                                          <option value="Mailing Address">Mailing Address</option>
                                          <option value="Email">Email</option>
                                          <option value="Date of Birth">Date of Birth</option>
                                          <option value="Drivers License #">Drivers License #</option>
                                          <option value="Notes">Notes</option>
                                          <option value="Business Name">Business Name</option>
                                          <option value="Business Phone">Business Phone</option>
                                          <option value="Business Address">Business Address</option>
                                          <option value="Business Email">Business Email</option>
                                          <option value="Website">Website</option>
                                          <option value="EIN">EIN</option>
                                          <option value="Line of Business">Line of Business</option>
                                      </select>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Section 2: Paste Data */}
                      <div>
                          <h4 className="font-bold text-[#8b4513] mb-2 flex items-center gap-2"><FileText size={18}/> 2. Paste CSV Data</h4>
                          <p className="text-xs text-stone-500 mb-2">Drag & Drop file below.</p>
                          
                          {/* Drag & Drop Zone */}
                          <div 
                              className="border-2 border-dashed border-[#d4c5a9] bg-stone-50 rounded-lg p-6 mb-3 text-center cursor-pointer hover:bg-stone-100 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                          >
                              <input 
                                  type="file" 
                                  ref={fileInputRef}
                                  className="hidden" 
                                  accept=".csv,.txt"
                                  onChange={handleFileUpload}
                              />
                              <FilePlus size={32} className="mx-auto text-stone-400 mb-2" />
                              <p className="text-sm font-bold text-stone-600">Drag & Drop CSV file here</p>
                              <p className="text-xs text-stone-400">or click to browse computer</p>
                          </div>
                          
                          <textarea 
                            className="w-full h-32 border border-[#d4c5a9] p-3 text-xs font-mono bg-white rounded focus:border-[#8b4513] focus:outline-none resize-none shadow-inner" 
                            placeholder="Example Row: Andrew Leui, 555-0199, 123 Maple Dr"
                            value={boosterSchema.rawText}
                            onChange={(e) => setBoosterSchema({...boosterSchema, rawText: e.target.value})}
                          ></textarea>
                      </div>
                  </div>

                  <div className="p-4 bg-[#e8e4d9] border-t border-[#d4c5a9] flex justify-end gap-3">
                      <button 
                        onClick={() => setModals({...modals, boosterPack: false})}
                        className="px-4 py-2 text-stone-600 font-bold hover:text-stone-800"
                      >
                          Cancel
                      </button>
                      <RPGButton variant="action" onClick={processBoosterImport} disabled={!boosterSchema.rawText.trim()}>
                          <Upload size={16} className="inline mr-2"/> Import Data
                      </RPGButton>
                  </div>
              </div>
          </div>
      )}
      
      {/* 6. Merge Cards Modal */}
      {modals.mergeCard && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
              <div className="bg-[#fdfbf7] rounded-lg shadow-xl border-4 border-[#d4c5a9] w-[90%] max-w-lg p-6">
                  <h3 className="font-serif font-bold text-xl mb-4 text-[#2c241b]">Merge Cards</h3>
                  <p className="text-sm text-stone-600 mb-4">
                      Select a card to merge INTO <span className="font-bold text-[#8b4513]">{selectedClient?.name || 'Current Card'}</span>. 
                      The selected card below will be deleted, and its data (Logs, Notes, Quests) will be moved to the current card.
                  </p>
                  
                  <div className="mb-4">
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Select Card to Absorb</label>
                      <select 
                          className="w-full p-2 border border-[#d4c5a9] rounded bg-white"
                          onChange={(e) => setCardToMergeIntoId(e.target.value)}
                          value={cardToMergeIntoId || ''}
                      >
                          <option value="">-- Select Card --</option>
                          {clients.filter(c => c.id !== selectedClient?.id).map(c => (
                              <option key={c.id} value={c.id}>
                                  {c.name} {c.businessSide?.businessName ? `(${c.businessSide.businessName})` : ''}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#d4c5a9]">
                      <button 
                        onClick={() => setModals({...modals, mergeCard: false})}
                        className="px-4 py-2 text-stone-600 font-bold hover:text-stone-800"
                      >
                          Cancel
                      </button>
                      <RPGButton variant="danger" onClick={() => handleMergeCards(cardToMergeIntoId)} disabled={!cardToMergeIntoId}>
                          Merge & Delete Source
                      </RPGButton>
                  </div>
              </div>
          </div>
      )}

      {/* 3. Level Table Modal */}
      {modals.levelTable && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] z-50">
              <div className="bg-[#fdfbf7] p-8 rounded-lg shadow-2xl border-4 border-[#d4c5a9] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-[#d4c5a9] pb-4">
                      <h3 className="font-serif font-bold text-2xl text-[#2c241b]">Level Progression</h3>
                      <button onClick={() => setModals({...modals, levelTable: false})}><X/></button>
                  </div>
                  
                  {/* Universal Rewards */}
                  <div className="mb-8 bg-[#e8e4d9] p-4 rounded border border-[#d4c5a9]">
                      <div className="flex justify-between items-center mb-2">
                           <h4 className="font-bold text-[#8b4513] uppercase text-sm">Universal Level Up Rewards</h4>
                           <button onClick={() => handleAddRule('universalLevelRewards')} className="text-xs bg-[#2c241b] text-[#f5deb3] px-2 py-1 rounded">+ Add</button>
                      </div>
                      <div className="space-y-2">
                          {rules.universalLevelRewards.map(r => (
                              <div key={r.id} className="flex justify-between items-center bg-white p-2 rounded border border-[#d4c5a9]">
                                  <span className="text-sm font-bold text-[#2c241b]">{r.reward}</span>
                                  <button onClick={() => handleDeleteRule('universalLevelRewards', r.id)} className="text-red-800"><Trash2 size={14}/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  <table className="w-full text-sm text-left mb-4">
                      <thead className="bg-[#e8e4d9] font-bold">
                          <tr>
                              <th className="p-2">Level</th>
                              <th className="p-2">Title</th>
                              <th className="p-2">Exp Required</th>
                              <th className="p-2">Reward</th>
                              <th className="p-2"></th>
                          </tr>
                      </thead>
                      <tbody>
                          {rules.levels.map(l => (
                              <tr key={l.id} className="border-b border-stone-200">
                                  <td className="p-2 font-bold">{l.level}</td>
                                  <td className="p-2">
                                      <input 
                                          className="w-full bg-transparent border-b border-stone-300 focus:outline-none italic text-[#5d4037]" 
                                          value={l.title} 
                                          onChange={(e) => setRules(prev => ({ ...prev, levels: prev.levels.map(lvl => lvl.id === l.id ? { ...lvl, title: e.target.value } : lvl) }))}
                                      />
                                  </td>
                                  <td className="p-2">
                                      <input 
                                          className="w-16 bg-transparent border-b border-stone-300 focus:outline-none" 
                                          value={l.exp} 
                                          onChange={(e) => setRules(prev => ({ ...prev, levels: prev.levels.map(lvl => lvl.id === l.id ? { ...lvl, exp: e.target.value } : lvl) }))}
                                      />
                                  </td>
                                  <td className="p-2">
                                      <input 
                                          className="w-full bg-transparent border-b border-stone-300 focus:outline-none font-bold text-[#8b4513]" 
                                          value={l.reward} 
                                          onChange={(e) => setRules(prev => ({ ...prev, levels: prev.levels.map(lvl => lvl.id === l.id ? { ...lvl, reward: e.target.value } : lvl) }))}
                                      />
                                  </td>
                                  <td className="p-2 text-right"><button onClick={() => handleDeleteLevel(l.id)} className="text-stone-400 hover:text-red-800"><Trash2 size={14}/></button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  
                  <button onClick={handleAddLevel} className="w-full py-2 bg-[#2c241b] text-[#f5deb3] rounded font-bold hover:bg-[#3e3226]">+ Add Level</button>
              </div>
          </div>
      )}
      
      {/* 4. Start Quest Modal */}
      {modals.startQuest && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
              <div className="bg-[#fdfbf7] w-full max-w-lg rounded-lg shadow-2xl border-4 border-[#d4c5a9] max-h-[90vh] overflow-y-auto">
                  <div className="bg-[#2c241b] text-[#f5deb3] p-4 border-b border-[#d4c5a9] flex justify-between items-center">
                      <h3 className="font-serif font-bold text-xl">{isStandaloneCreation ? 'Start Standalone Quest' : 'Start New Quest'}</h3>
                      <button onClick={() => setModals({...modals, startQuest: false})}><X/></button>
                  </div>
                  <div className="p-6">
                      <p className="text-sm text-stone-600 mb-4 font-bold">
                        {isStandaloneCreation ? 
                          'Create a temporary task separate from the binder.' : 
                          <>Client: <span className="text-[#8b4513]">{selectedClient?.name}</span> ({activeSide})</>
                        }
                      </p>
                      
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Quest Type</label>
                          <select className="w-full p-2 border border-[#d4c5a9] rounded bg-white" id="questTypeSelect">
                              {isStandaloneCreation ? 
                                rules.standaloneQuestTypes.map(qt => <option key={qt.id} value={JSON.stringify(qt)}>{qt.name}</option>) :
                                rules.cardQuestTypes.filter(q => q.category !== 'Standalone').map(qt => <option key={qt.id} value={JSON.stringify(qt)}>{qt.name}</option>)
                              }
                          </select>
                      </div>

                      {isStandaloneCreation && (
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Note (Required)</label>
                            <textarea 
                              className="w-full p-2 border border-[#d4c5a9] rounded bg-white h-24 text-sm" 
                              placeholder="Describe this task..."
                              value={standaloneNote}
                              onChange={(e) => setStandaloneNote(e.target.value)}
                            />
                        </div>
                      )}
                      
                      <div className="mb-6">
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Due Date</label>
                          <input type="date" id="questDueDate" className="w-full p-2 border border-[#d4c5a9] rounded bg-white" />
                      </div>

                      {/* Notes Field (NEW) */}
                      {!isStandaloneCreation && (
                          <div className="mb-4">
                              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Quest Note</label>
                              <textarea 
                                  className="w-full p-2 border border-[#d4c5a9] rounded bg-white h-20 text-sm" 
                                  placeholder="Initial notes..."
                                  value={startQuestNote}
                                  onChange={(e) => setStartQuestNote(e.target.value)}
                              />
                          </div>
                      )}

                      <div className="flex justify-end gap-2">
                          <button onClick={() => setModals({...modals, startQuest: false})} className="px-4 py-2 text-stone-500 font-bold">Cancel</button>
                          <RPGButton variant="action" onClick={() => {
                              const selectEl = document.getElementById('questTypeSelect');
                              const dateEl = document.getElementById('questDueDate');
                              const selectedQuest = JSON.parse(selectEl.value);
                              
                              if (isStandaloneCreation) {
                                if (!standaloneNote.trim()) return alert("Please enter a note for this standalone quest.");
                                handleCreateStandaloneQuest(selectedQuest, dateEl.value || new Date().toISOString(), standaloneNote);
                              } else {
                                handleStartQuest(selectedClient, activeSide, selectedQuest, dateEl.value || new Date().toISOString(), startQuestNote);
                              }
                              setModals({...modals, startQuest: false});
                          }}>Begin Quest</RPGButton>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}