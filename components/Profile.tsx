
import React from 'react';
import { UserRole, DebaterProfile } from '../types';
import { Trophy, TrendingUp, Target, Shield, Clock, Award, Star, Zap, MapPin, Grid } from 'lucide-react';

interface ProfileProps {
  currentUserRole: UserRole;
}

const Profile: React.FC<ProfileProps> = ({ currentUserRole }) => {
  // Mock data for the profile view
  const userStats = {
    name: "Abdullah Al Rajjak",
    role: currentUserRole,
    rank: "Grandmaster",
    elo: 2450,
    winRate: 84,
    accuracy: 92,
    debates: 142,
    location: "Dhaka, Bangladesh",
    joined: "March 2023",
    badges: [
      { name: "Logic Lord", icon: "👑", color: "bg-amber-500/20 text-amber-400 border-amber-500/50" },
      { name: "Fact Checker", icon: "✓", color: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
      { name: "Crowd Favorite", icon: "★", color: "bg-pink-500/20 text-pink-400 border-pink-500/50" },
      { name: "Sharpshooter", icon: "🎯", color: "bg-green-500/20 text-green-400 border-green-500/50" },
    ],
    history: [
      { id: 1, topic: "AI Safety Regulations", result: "VICTORY", score: 95, date: "2 days ago", opponent: "Sarah C." },
      { id: 2, topic: "Universal Basic Income", result: "DRAW", score: 88, date: "1 week ago", opponent: "Mark E." },
      { id: 3, topic: "Mars Colonization", result: "VICTORY", score: 92, date: "2 weeks ago", opponent: "Elon M." },
      { id: 4, topic: "Remote Work vs Office", result: "DEFEAT", score: 82, date: "3 weeks ago", opponent: "Jack D." },
    ]
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 animate-in fade-in duration-500 w-full">
      <div className="w-full space-y-8">
        
        {/* Header Section */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative">
                 <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300" 
                      className="w-full h-full rounded-full object-cover border-4 border-slate-900" 
                      alt="Profile" 
                    />
                 </div>
                 <div className="absolute bottom-0 right-0 bg-amber-500 text-slate-900 font-bold text-xs px-2 py-1 rounded-full border-2 border-slate-900 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> #4 Global
                 </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                 <h1 className="text-3xl font-bold text-white mb-2">{userStats.name}</h1>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm mb-4">
                    <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {userStats.role.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {userStats.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined {userStats.joined}</span>
                 </div>
                 <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {userStats.badges.map((badge, idx) => (
                       <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${badge.color}`}>
                          {badge.icon} {badge.name}
                       </span>
                    ))}
                 </div>
              </div>

              <div className="flex gap-6 text-center">
                 <div>
                    <div className="text-3xl font-bold text-white">{userStats.elo}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Elo Rating</div>
                 </div>
                 <div className="w-px bg-slate-700 h-12"></div>
                 <div>
                    <div className="text-3xl font-bold text-indigo-400">#{userStats.rank}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Rank</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white">Win Rate</h3>
                 <div className="p-2 bg-green-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-green-400" /></div>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{userStats.winRate}%</div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div className="bg-green-500 h-full rounded-full" style={{ width: `${userStats.winRate}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Top 5% of debaters</p>
           </div>

           <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white">Argument Accuracy</h3>
                 <div className="p-2 bg-indigo-500/10 rounded-lg"><Target className="w-5 h-5 text-indigo-400" /></div>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{userStats.accuracy}%</div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${userStats.accuracy}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Based on AI Analysis</p>
           </div>

           <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-white">Total Debates</h3>
                 <div className="p-2 bg-purple-500/10 rounded-lg"><Zap className="w-5 h-5 text-purple-400" /></div>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{userStats.debates}</div>
              <div className="flex gap-1 mt-2">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
                 ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">Active since 2023</p>
           </div>
        </div>

        {/* History List */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Grid className="w-5 h-5 text-slate-400" /> Recent Match History
           </h3>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="text-xs text-slate-500 uppercase border-b border-slate-800">
                       <th className="py-3 font-semibold">Topic</th>
                       <th className="py-3 font-semibold">Opponent</th>
                       <th className="py-3 font-semibold">Date</th>
                       <th className="py-3 font-semibold">AI Score</th>
                       <th className="py-3 font-semibold text-right">Result</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {userStats.history.map((match) => (
                       <tr key={match.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                          <td className="py-4 text-white font-medium">{match.topic}</td>
                          <td className="py-4 text-slate-400">{match.opponent}</td>
                          <td className="py-4 text-slate-500">{match.date}</td>
                          <td className="py-4">
                             <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                   <div className={`h-full ${match.score >= 90 ? 'bg-green-500' : match.score >= 80 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${match.score}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-300">{match.score}</span>
                             </div>
                          </td>
                          <td className="py-4 text-right">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${
                                match.result === 'VICTORY' ? 'bg-green-500/10 text-green-500' :
                                match.result === 'DEFEAT' ? 'bg-red-500/10 text-red-500' :
                                'bg-slate-500/10 text-slate-500'
                             }`}>
                                {match.result}
                             </span>
                          </td>
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

export default Profile;
