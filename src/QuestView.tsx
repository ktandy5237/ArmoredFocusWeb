// type ModalsState = {
//   drawCard: boolean;
//   startQuest: boolean;
//   levelTable: boolean;
//   boosterPack: boolean;
//   modifyQuest: boolean;
//   questResult: boolean;
//   mergeCard: boolean;
// };

// type QuestViewProps = {
//   setModals: React.Dispatch<React.SetStateAction<ModalsState>>;
// };
// export default function QuestView({ setModals }: QuestViewProps) {
//   return (
//     <div className="relative h-full w-full">
//       <div className="absolute left-0 top-0 w-1/4 h-full z-10 p-4 flex flex-col gap-4">
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900"
//             size={18}
//           />
//           <input
//             className="w-full pl-10 pr-4 py-3 border-2 border-emerald-800 rounded-xl bg-emerald-50/90 shadow-lg focus:outline-none focus:border-emerald-600 font-bold text-emerald-900"
//             placeholder="Search Quests..."
//           />
//         </div>

//         {/* BUTTONS */}
//         <button
//           onClick={() => {
//             setIsStandaloneCreation(false);
//             setModals({ ...modals, startQuest: true });
//           }}
//           className={`w-full py-4 rounded-xl bg-gradient-to-b from-emerald-400 via-emerald-700 to-emerald-900 text-emerald-100 border-4 border-emerald-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}
//         >
//           <div className="p-1 bg-emerald-950 rounded-full border border-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
//             <Coins size={18} />
//           </div>
//           Start Card Quest
//         </button>
//         <button
//           onClick={() => {
//             setIsStandaloneCreation(true);
//             setSelectedClient(null);
//             setModals({ ...modals, startQuest: true });
//           }}
//           className={`w-full py-4 rounded-xl bg-gradient-to-b from-[#e879f9] via-[#d946ef] to-[#9333ea] text-white border-4 border-purple-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}
//         >
//           <div className="w-8 h-8 bg-purple-900 rounded-full border border-purple-400 flex items-center justify-center font-serif italic text-xl group-hover:scale-110 transition-transform shadow-inner shrink-0">
//             S
//           </div>
//           Start Standalone Quest
//         </button>
//         <button
//           className={`w-full py-4 rounded-xl bg-gradient-to-b from-blue-400 via-blue-800 to-[#172554] text-blue-100 border-4 border-blue-950 text-base px-2 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group ${METALLIC_SHADOW} ${METALLIC_FONT}`}
//         >
//           <div className="p-1 bg-blue-900 rounded-full border border-blue-400 group-hover:scale-110 transition-transform shadow-inner shrink-0">
//             <Map size={18} />
//           </div>{" "}
//           Explore for Quests
//         </button>

//         {/* NEW: Scroll Activity Log (Replaces Bonus Board) */}
//         <ScrollLog dailyLog={dailyLog} />
//       </div>
//       <div className="absolute right-4 top-4 bottom-0 w-3/4">
//         <div
//           className={`w-full h-full rounded-t-2xl border-b-0 ${QUEST_THEME.tray} p-6 overflow-y-auto`}
//         >
//           <div className="grid grid-cols-1 gap-4">
//             {sortedClients
//               .filter(
//                 (c) =>
//                   c.clientSide.quests.some(
//                     (q) => q.status === "Active" || q.status === "Cooldown"
//                   ) ||
//                   c.businessSide.quests.some(
//                     (q) => q.status === "Active" || q.status === "Cooldown"
//                   )
//               )
//               .map((client) => (
//                 <ClientCard
//                   key={client.id}
//                   client={client}
//                   isExpanded={expandedCardId === client.id}
//                   onToggle={() =>
//                     setExpandedCardId(
//                       expandedCardId === client.id ? null : client.id
//                     )
//                   }
//                   onUpdate={handleUpdateClient}
//                 />
//               ))}
//           </div>
//           {clients.length === 0 && (
//             <div className="h-full flex flex-col items-center justify-center text-emerald-100/50">
//               <Map size={64} className="mb-4 opacity-50" />
//               <h3 className="text-2xl font-bold font-serif">
//                 No Active Quests
//               </h3>
//               <p>The realm is quiet... for now.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
