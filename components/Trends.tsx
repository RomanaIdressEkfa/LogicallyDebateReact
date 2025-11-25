
import React from 'react';
import { TrendingUp, Users, MessageCircle, Globe, Activity } from 'lucide-react';

const Trends: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Global Trends & Analytics</h1>
            <p className="text-slate-400">Real-time data from the LogicallyDebate ecosystem.</p>
          </div>
          <div className="flex items-center gap-2 text-green-400 bg-green-900/10 px-3 py-1 rounded-full border border-green-900/30 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Data Stream
          </div>
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Debates</div>
            <div className="text-3xl font-extrabold text-white">12,402</div>
            <div className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% this week
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Users</div>
            <div className="text-3xl font-extrabold text-white">85.2K</div>
            <div className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> +5% this week
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Arguments Logged</div>
            <div className="text-3xl font-extrabold text-white">1.2M</div>
            <div className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> +18% this week
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Avg. Viewer Time</div>
            <div className="text-3xl font-extrabold text-white">24m</div>
            <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Stable
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Popular Categories</h3>
            <div className="space-y-4">
              {[
                { name: 'Politics', val: 75, color: 'bg-indigo-500' },
                { name: 'Technology', val: 60, color: 'bg-blue-500' },
                { name: 'Philosophy', val: 45, color: 'bg-purple-500' },
                { name: 'Religion', val: 30, color: 'bg-pink-500' },
                { name: 'Science', val: 25, color: 'bg-teal-500' }
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{cat.name}</span>
                    <span>{cat.val}% Vol</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center">
             <div className="relative w-48 h-48 mb-6">
                <Globe className="w-full h-full text-slate-800 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                     <div className="text-3xl font-bold text-white">142</div>
                     <div className="text-xs text-slate-500 uppercase">Countries</div>
                  </div>
                </div>
             </div>
             <h3 className="text-lg font-bold text-white">Global Reach</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-xs">
                Our platform hosts debates in 14 languages across 6 continents. Top regions: North America, Europe, SE Asia.
             </p>
          </div>
        </div>

        {/* Hot Topics */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-8 rounded-3xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">Trending Topics This Month</h3>
            <div className="flex flex-wrap gap-4">
                {[
                    "AI Safety", "Universal Basic Income", "Mars Colonization", "Crypto Regulation", 
                    "Remote Work", "Nuclear Energy", "Genetic Engineering", "Social Media Bans", 
                    "Education Reform", "Climate Action", "Veganism", "Space Force"
                ].map((topic, i) => (
                    <span 
                        key={topic} 
                        className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                            i < 3 ? 'bg-white text-slate-900 border-white' : 
                            i < 6 ? 'bg-slate-800 text-white border-slate-700' :
                            'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                    >
                        {i < 3 && <span className="mr-1">🔥</span>}
                        {topic}
                    </span>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Trends;
