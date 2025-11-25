
import React from 'react';
import { DebaterProfile } from '../types';
import { Trophy, Medal, Star, Shield, Award, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  topDebaters: DebaterProfile[];
}

// Generate more mock data for the list
const EXTENDED_DEBATERS: DebaterProfile[] = [
    { id: 'd4', name: 'LogicMaster 99', rank: 'Platinum', winRate: 68, debatesCount: 88, avatarUrl: 'https://ui-avatars.com/api/?name=LM', badges: ['Analyst'] },
    { id: 'd5', name: 'Aristotle_Reborn', rank: 'Gold', winRate: 65, debatesCount: 150, avatarUrl: 'https://ui-avatars.com/api/?name=AR', badges: [] },
    { id: 'd6', name: 'DebateQueen', rank: 'Gold', winRate: 62, debatesCount: 45, avatarUrl: 'https://ui-avatars.com/api/?name=DQ', badges: ['Rising Star'] },
    { id: 'd7', name: 'FactsOnly', rank: 'Silver', winRate: 59, debatesCount: 200, avatarUrl: 'https://ui-avatars.com/api/?name=FO', badges: [] },
    { id: 'd8', name: 'SocratesJr', rank: 'Silver', winRate: 55, debatesCount: 30, avatarUrl: 'https://ui-avatars.com/api/?name=SJ', badges: [] },
    { id: 'd9', name: 'HitchFlasher', rank: 'Silver', winRate: 51, debatesCount: 20, avatarUrl: 'https://ui-avatars.com/api/?name=HF', badges: [] },
    { id: 'd10', name: 'ProTagoras', rank: 'Bronze', winRate: 48, debatesCount: 12, avatarUrl: 'https://ui-avatars.com/api/?name=PT', badges: [] },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ topDebaters }) => {
  const allDebaters = [...topDebaters, ...EXTENDED_DEBATERS];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 animate-in fade-in duration-500 w-full">
      <div className="w-full">
        
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" /> Global Rankings
            </h1>
            <p className="text-slate-400">The world's most formidable minds, ranked by eloquence and logic.</p>
        </div>

        {/* Podium */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-slate-300 to-slate-500 mb-4 relative">
                     <img src={topDebaters[1].avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-slate-900" alt="" />
                     <div className="absolute -bottom-2 bg-slate-300 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-full border-2 border-slate-900">#2</div>
                </div>
                <div className="text-white font-bold text-lg">{topDebaters[1].name}</div>
                <div className="text-slate-400 text-sm mb-4">{topDebaters[1].winRate}% Win Rate</div>
                <div className="w-32 h-32 bg-slate-800 rounded-t-lg border-t border-l border-r border-slate-700 flex items-center justify-center relative">
                    <div className="text-6xl font-bold text-slate-700/50">2</div>
                </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 flex flex-col items-center -mt-8 relative z-10">
                <div className="absolute -top-12">
                    <Medal className="w-8 h-8 text-amber-500 drop-shadow-lg animate-bounce" />
                </div>
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-300 to-amber-600 mb-4 relative shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                     <img src={topDebaters[0].avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-slate-900" alt="" />
                     <div className="absolute -bottom-2 bg-amber-500 text-white font-bold text-xs px-3 py-0.5 rounded-full border-2 border-slate-900">#1</div>
                </div>
                <div className="text-white font-bold text-xl">{topDebaters[0].name}</div>
                <div className="text-amber-500 font-bold text-sm mb-4">Grandmaster</div>
                <div className="w-40 h-44 bg-gradient-to-b from-indigo-900 to-slate-900 rounded-t-lg border-t border-l border-r border-indigo-500/30 flex items-center justify-center relative shadow-2xl">
                    <div className="text-7xl font-bold text-indigo-500/20">1</div>
                    <div className="absolute bottom-4 flex items-center gap-1 text-xs text-indigo-300">
                        <Star className="w-3 h-3 fill-indigo-300" /> {topDebaters[0].debatesCount} Debates
                    </div>
                </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-orange-700 to-orange-900 mb-4 relative">
                     <img src={topDebaters[2].avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-slate-900" alt="" />
                     <div className="absolute -bottom-2 bg-orange-700 text-white font-bold text-xs px-2 py-0.5 rounded-full border-2 border-slate-900">#3</div>
                </div>
                <div className="text-white font-bold text-lg">{topDebaters[2].name}</div>
                <div className="text-slate-400 text-sm mb-4">{topDebaters[2].winRate}% Win Rate</div>
                <div className="w-32 h-24 bg-slate-800 rounded-t-lg border-t border-l border-r border-slate-700 flex items-center justify-center relative">
                    <div className="text-6xl font-bold text-slate-700/50">3</div>
                </div>
            </div>
        </div>

        {/* List */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Debater</th>
                        <th className="px-6 py-4">Tier</th>
                        <th className="px-6 py-4 text-center">Win Rate</th>
                        <th className="px-6 py-4 text-center">Total Debates</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                    {allDebaters.slice(3).map((debater, index) => (
                        <tr key={debater.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-mono">#{index + 4}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={debater.avatarUrl} className="w-8 h-8 rounded-full bg-slate-800" alt="" />
                                    <div>
                                        <div className="font-bold text-white">{debater.name}</div>
                                        <div className="flex gap-1">
                                            {debater.badges.map(b => (
                                                <span key={b} className="text-[10px] text-slate-500 bg-slate-800 px-1 rounded">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold w-fit ${
                                    debater.rank === 'Platinum' ? 'bg-cyan-900/20 text-cyan-400' :
                                    debater.rank === 'Gold' ? 'bg-amber-900/20 text-amber-400' :
                                    'bg-slate-700/20 text-slate-400'
                                }`}>
                                    <Shield className="w-3 h-3" /> {debater.rank}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-white">{debater.winRate}%</td>
                            <td className="px-6 py-4 text-center text-slate-400">{debater.debatesCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
