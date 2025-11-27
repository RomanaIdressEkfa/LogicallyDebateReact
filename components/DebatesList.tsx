
import React, { useState } from 'react';
import { Debate } from '../types';
import { Search, Filter, Play, Clock, CheckCircle2, MessageSquare, Users, ChevronRight } from 'lucide-react';

interface DebatesListProps {
  debates: Debate[];
  onSelectDebate: (debate: Debate) => void;
}

const DebatesList: React.FC<DebatesListProps> = ({ debates, onSelectDebate }) => {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredDebates = debates?.filter(d => {
    const matchesFilter = filter === 'ALL' || d.status === filter;
    const matchesSearch = d.topic.toLowerCase().includes(search.toLowerCase()) || 
                          d.proUser.toLowerCase().includes(search.toLowerCase()) || 
                          d.conUser.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 animate-in fade-in duration-500 w-full">
      <div className="w-full space-y-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Debate Archives</h1>
            <p className="text-slate-400">Browse {debates?.length || 0} active and historical discussions.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400" />
               <input 
                 type="text" 
                 placeholder="Search topics or users..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
               {['ALL', 'LIVE', 'UPCOMING', 'COMPLETED'].map((f) => (
                 <button
                   key={f}
                   onClick={() => setFilter(f as any)}
                   className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDebates.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">
               <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p>No debates found matching your criteria.</p>
            </div>
          ) : (
            filteredDebates.map(debate => (
              <div 
                key={debate.id}
                onClick={() => onSelectDebate(debate)}
                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                {/* Image Cover */}
                <div className="h-48 relative overflow-hidden shrink-0">
                   <img src={debate.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={debate.topic} />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                   <div className="absolute top-3 right-3">
                      {debate.status === 'LIVE' && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE</span>}
                      {debate.status === 'UPCOMING' && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg"><Clock className="w-3 h-3"/> UPCOMING</span>}
                      {debate.status === 'COMPLETED' && <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg"><CheckCircle2 className="w-3 h-3"/> ENDED</span>}
                   </div>
                   <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                          {debate.category}
                      </span>
                   </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                   <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                      {debate.topic}
                   </h3>
                   
                   <div className="mt-auto pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-blue-400 font-bold" title={debate.proUser}>P</div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-red-400 font-bold" title={debate.conUser}>C</div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-white font-bold flex items-center justify-end gap-1"><Users className="w-3 h-3 text-slate-500"/> {debate.viewers.toLocaleString()}</div>
                             <div className="text-[10px] text-slate-500 uppercase font-bold">Watching</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
                           <div className="bg-blue-500 h-full" style={{ width: `${(debate.votes.pro / (debate.votes.pro + debate.votes.con || 1)) * 100}%` }}></div>
                           <div className="bg-red-500 h-full" style={{ width: `${(debate.votes.con / (debate.votes.pro + debate.votes.con || 1)) * 100}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>PRO</span>
                          <span>CON</span>
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DebatesList;
