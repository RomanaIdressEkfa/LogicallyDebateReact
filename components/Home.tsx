
import React, { useState } from 'react';
import Hero from './Hero';
import { Debate, DebaterProfile } from '../types';
import { 
  Activity, 
  ArrowRight, 
  Users, 
  Clock, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquare,
  BarChart2,
  Quote,
  Flame,
  Trophy,
  Zap,
  Globe,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';

interface HomeProps {
  debates: Debate[];
  topDebaters: DebaterProfile[];
  onStartDebate: (debate: Debate) => void;
  onViewAllDebates: () => void;
  onViewLeaderboard?: () => void;
  onLearnMore?: () => void;
}

const Home: React.FC<HomeProps> = ({ debates, topDebaters, onStartDebate, onViewAllDebates, onViewLeaderboard, onLearnMore }) => {
  const [pollVote, setPollVote] = useState<string | null>(null);

  const handleHeroStart = () => {
    const live = debates.find(d => d.status === 'LIVE');
    if (live) onStartDebate(live);
    else document.getElementById('debates-list')?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="animate-in fade-in duration-700 bg-slate-950">
      <Hero 
        onStart={handleHeroStart} 
        onLearnMore={onLearnMore || (() => {})} 
      />
      
      {/* Ticker - Full Width */}
      <div className="w-full bg-primary-900/20 border-y border-primary-500/10 backdrop-blur-md overflow-hidden py-3 relative z-20">
         <div className="w-full px-6 flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary-400 font-black whitespace-nowrap uppercase tracking-widest text-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span> Live Intel
            </div>
            <div className="flex gap-16 text-xs font-medium text-primary-200/70 animate-scroll whitespace-nowrap overflow-hidden w-full">
                <span className="flex items-center gap-2"><Flame className="w-3 h-3 text-orange-500"/> <strong>BREAKING:</strong> "AI Regulations" debate enters final round...</span>
                <span className="flex items-center gap-2"><Trophy className="w-3 h-3 text-yellow-500"/> <strong>New Grandmaster:</strong> Alex Cicero takes global #1 spot!</span>
                <span className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-green-500"/> <strong>Market Watch:</strong> Theology topics trending up 200% among Gen Z...</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-blue-500"/> <strong>System Update:</strong> Gemini 2.5 Logic Engine active for all judges...</span>
            </div>
         </div>
      </div>

      {/* Main Container - FLUID WIDTH */}
      <div className="w-full px-4 md:px-12 py-16 space-y-32">
        
        {/* SECTION 1: Featured Live Debate (Hero Card) */}
        <section id="debates-list" className="w-full">
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <h2 className="text-4xl font-black text-white flex items-center gap-4 mb-2">
                        <span className="p-2 bg-red-600 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)]"><Activity className="w-6 h-6 text-white animate-bounce" /></span>
                        LIVE BATTLE ARENA
                    </h2>
                    <p className="text-slate-400 font-medium text-lg max-w-2xl">Witness high-stakes intellectual combat happening right now.</p>
                </div>
                <button 
                    onClick={onViewAllDebates}
                    className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors group"
                >
                    View All Battles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {debates.slice(0, 3).map((debate, idx) => (
                    <div 
                    key={debate.id} 
                    onClick={() => onStartDebate(debate)}
                    className={`group relative rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-900 transition-all duration-500 hover:border-primary-500/50 hover:shadow-[0_0_40px_rgba(var(--primary-500),0.15)] cursor-pointer flex flex-col ${idx === 0 ? 'lg:col-span-2 lg:flex-row h-auto lg:h-[28rem]' : 'h-[28rem]'}`}
                    >
                        <div className={`relative overflow-hidden ${idx === 0 ? 'w-full lg:w-3/5 h-64 lg:h-full' : 'h-1/2 w-full'}`}>
                            <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay z-10"></div>
                            <img src={debate.imageUrl} alt={debate.topic} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-20"></div>
                            {idx === 0 && <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900 z-20 hidden lg:block"></div>}
                            
                            <div className="absolute top-6 left-6 z-30 flex gap-2">
                                {debate.status === 'LIVE' ? (
                                    <span className="flex items-center gap-2 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg border border-red-400/50 animate-pulse">
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg border border-blue-400/50">
                                        UPCOMING
                                    </span>
                                )}
                                <span className="bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-wider">
                                    {debate.category}
                                </span>
                            </div>
                        </div>
                        
                        <div className={`relative z-30 p-8 flex flex-col justify-between ${idx === 0 ? 'w-full lg:w-2/5 bg-slate-900' : 'h-1/2 bg-slate-900'}`}>
                            <div>
                                <h3 className={`font-black text-white text-left leading-tight group-hover:text-primary-400 transition-colors ${idx === 0 ? 'text-3xl mb-4' : 'text-xl mb-2'}`}>
                                    {debate.topic}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">
                                    {debate.description}
                                </p>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs text-blue-400 font-bold shadow-lg z-10">{debate.proUser.charAt(0)}</div>
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs text-red-400 font-bold shadow-lg z-0">{debate.conUser.charAt(0)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold text-lg">{debate.viewers.toLocaleString()}</div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Watching Now</div>
                                    </div>
                                </div>
                                <button className="w-full bg-slate-800 hover:bg-white hover:text-slate-900 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                                    Enter Arena <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* SECTION 2: Value Props (Why Join?) */}
        <section className="w-full bg-gradient-to-b from-primary-900/20 to-slate-950 rounded-[3rem] p-8 md:p-16 border border-slate-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
                <h2 className="text-sm font-black text-primary-500 tracking-[0.2em] uppercase mb-4">Platform Features</h2>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6">Debate in the 21st Century</h3>
                <p className="text-slate-400 text-lg">We've replaced shouting matches with structured, gamified, and AI-moderated discourse.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
                    <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BrainCircuit className="w-7 h-7 text-primary-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">AI Judgement</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Gemini AI analyzes logical fallacies in real-time, assigning score penalties for weak arguments.</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
                    <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <BarChart2 className="w-7 h-7 text-pink-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Crowd Sentiment</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Live audience voting creates a dynamic tug-of-war visual, showing exactly who is winning the room.</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Trophy className="w-7 h-7 text-amber-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Global Rankings</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Climb the Elo ladder from Novice to Grandmaster. Earn badges for logic, rhetoric, and facts.</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 group">
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Civil Discourse</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Structured turn-taking and strict moderation tools ensure conversations generate light, not heat.</p>
                </div>
            </div>
        </section>

        {/* SECTION 3: Hall of Fame (Horizontal Scroll) */}
        <section className="w-full">
            <div className="flex items-center justify-between mb-10 px-4">
                 <h2 className="text-3xl font-black text-white">Top Rhetoricians</h2>
                 <button onClick={onViewLeaderboard} className="text-primary-400 font-bold hover:text-white transition-colors">See Leaderboard</button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-8 px-4 no-scrollbar snap-x">
                {topDebaters.map((debater, i) => (
                    <div key={debater.id} className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-3xl p-6 relative group hover:border-primary-500/30 transition-all snap-start">
                        <div className="absolute top-4 right-4 text-4xl font-black text-slate-800 group-hover:text-slate-800/50 transition-colors">#{i + 1}</div>
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary-500 to-purple-600">
                                <img src={debater.avatarUrl} className="w-full h-full rounded-full object-cover border-2 border-slate-900" alt=""/>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-slate-950 text-white text-xs font-bold px-2 py-1 rounded-lg border border-slate-800">
                                {debater.winRate}% WR
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{debater.name}</h3>
                        <div className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">{debater.rank}</div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {debater.badges.slice(0, 2).map(b => (
                                <span key={b} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">{b}</span>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                            <span>{debater.debatesCount} Battles</span>
                            <button className="text-white font-bold hover:text-primary-400">View Profile</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* SECTION 4: Interactive Widgets Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Daily Quote */}
             <div className="bg-gradient-to-br from-amber-900/10 to-slate-900 border border-amber-900/20 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/20 transition-all">
                <Quote className="absolute top-6 right-6 w-16 h-16 text-amber-500/5 transform rotate-12 group-hover:scale-110 transition-transform" />
                <h3 className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-amber-500"></span> Daily Wisdom
                </h3>
                <p className="text-slate-200 font-serif text-xl leading-relaxed mb-6 italic">
                    "It is better to debate a question without settling it than to settle a question without debating it."
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-amber-500 font-bold font-serif">J</div>
                    <div>
                        <p className="text-white font-bold text-sm">Joseph Joubert</p>
                        <p className="text-slate-500 text-xs">French Moralist</p>
                    </div>
                </div>
            </div>

            {/* Community Poll */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary-400" /> Community Pulse
                    </h3>
                    <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full">12,402 Votes</span>
                </div>
                <h4 className="text-slate-200 text-lg font-medium mb-6">Should artificial general intelligence (AGI) development be paused for 6 months?</h4>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => setPollVote('yes')}
                        className={`w-full relative h-14 rounded-xl overflow-hidden border transition-all group ${pollVote === 'yes' ? 'border-green-500' : 'border-slate-800 hover:border-slate-600'}`}
                    >
                        <div className="absolute inset-0 bg-slate-950"></div>
                        <div className="absolute inset-y-0 left-0 bg-green-500/20 transition-all duration-1000" style={{width: pollVote ? '42%' : '0%'}}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                            <span className="font-bold text-white flex items-center gap-3">
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pollVote === 'yes' ? 'border-green-500 bg-green-500' : 'border-slate-600'}`}>
                                    {pollVote === 'yes' && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                                </span>
                                Yes, pause it immediately
                            </span>
                            {pollVote && <span className="font-black text-green-400 text-lg">42%</span>}
                        </div>
                    </button>
                    <button 
                        onClick={() => setPollVote('no')}
                        className={`w-full relative h-14 rounded-xl overflow-hidden border transition-all group ${pollVote === 'no' ? 'border-red-500' : 'border-slate-800 hover:border-slate-600'}`}
                    >
                        <div className="absolute inset-0 bg-slate-950"></div>
                        <div className="absolute inset-y-0 left-0 bg-red-500/20 transition-all duration-1000" style={{width: pollVote ? '58%' : '0%'}}></div>
                        <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                            <span className="font-bold text-white flex items-center gap-3">
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${pollVote === 'no' ? 'border-red-500 bg-red-500' : 'border-slate-600'}`}>
                                    {pollVote === 'no' && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                                </span>
                                No, accelerate development
                            </span>
                            {pollVote && <span className="font-black text-red-400 text-lg">58%</span>}
                        </div>
                    </button>
                </div>
            </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="w-full bg-black border-t border-slate-900 py-16 px-6 md:px-12">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
                <span className="text-2xl font-black text-white tracking-tight">LogicallyDebate.</span>
                <p className="mt-6 text-slate-500 max-w-sm text-sm leading-relaxed">
                    The world's first AI-arbitrated debate platform. We believe in the power of logic to solve conflicts and find truth.
                </p>
                <div className="flex gap-4 mt-8">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-colors cursor-pointer"><Globe className="w-5 h-5"/></div>
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-colors cursor-pointer"><Users className="w-5 h-5"/></div>
                </div>
            </div>
            
            <div>
                <h4 className="text-white font-bold mb-6">Explore</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Live Battles</li>
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Global Leaderboard</li>
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Create Tournament</li>
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Rules & Scoring</li>
                </ul>
            </div>

            <div>
                <h4 className="text-white font-bold mb-6">Legal</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Terms of Service</li>
                    <li className="hover:text-primary-400 cursor-pointer transition-colors">Code of Conduct</li>
                </ul>
            </div>
        </div>
        <div className="border-t border-slate-900 mt-16 pt-8 text-center text-slate-700 text-xs font-medium">
            &copy; 2024 LogicallyDebate Inc. | Designed for Intellectuals.
        </div>
      </footer>
    </div>
  );
};

export default Home;
