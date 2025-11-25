
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DebateRoom from './components/DebateRoom';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RoleSelectionModal from './components/RoleSelectionModal';
import { Debate, UserRole, DebaterProfile, ArgumentNode, Notification } from './types';
import { Users, Clock, ArrowRight, Trophy, Cpu, TrendingUp, ShieldCheck, Lock } from 'lucide-react';

// Enhanced Mock Data with Tree Structure
const MOCK_ARGUMENT_TREE: ArgumentNode[] = [
    {
        id: 'root-1',
        author: 'Abdullah Al Rajjak',
        role: 'PRO',
        type: 'ARGUMENT',
        content: '"The Quran was revealed after the Bible, serving as the final testament."',
        timestamp: Date.now() - 3600000,
        votes: { likes: 1247, support: 890 },
        children: [
            {
                id: 'child-1',
                author: 'Jhon\'s Ahmed',
                role: 'CON',
                type: 'REBUTTAL',
                content: 'This chronological succession doesn\'t inherently prove authenticity, only sequence. We need historical verification of the unchanged text.',
                timestamp: Date.now() - 3500000,
                votes: { likes: 450, support: 200 },
                children: [
                    {
                        id: 'sub-child-1',
                        author: 'Abdullah Al Rajjak',
                        role: 'PRO',
                        type: 'AGREEMENT',
                        content: 'Agreed on the need for verification. The Hafiz tradition (memorization) has preserved it perfectly since the 7th century.',
                        timestamp: Date.now() - 3400000,
                        votes: { likes: 800, support: 600 },
                        children: []
                    },
                    {
                        id: 'sub-child-2',
                        author: 'Jhon\'s Ahmed',
                        role: 'CON',
                        type: 'DISAGREEMENT',
                        content: 'Memorization allows for dialectal variations. We see this in the Qira\'at.',
                        timestamp: Date.now() - 3300000,
                        votes: { likes: 300, support: 150 },
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: 'root-2',
        author: 'Abdullah Al Rajjak',
        role: 'PRO',
        type: 'ARGUMENT',
        content: '"When the Quran was revealed it was memorized by the prophet and till now millions of people have memorized it."',
        timestamp: Date.now() - 3000000,
        votes: { likes: 923, support: 500 },
        children: [
            {
                 id: 'child-2-1',
                 author: 'Jhon\'s Ahmed',
                 role: 'CON',
                 type: 'REBUTTAL',
                 content: 'Memorization doesn\'t guarantee the original meaning is preserved against interpretation changes over centuries.',
                 timestamp: Date.now() - 2900000,
                 votes: { likes: 60, support: 42 },
                 children: []
            }
        ]
    }
];

const INITIAL_DEBATES: Debate[] = [
  {
    id: '1',
    topic: 'Is the Quran the latest, unchanged and true holy book from God?',
    category: 'Theology',
    description: 'A historical and theological debate on scriptural preservation.',
    status: 'LIVE',
    proUser: 'Abdullah Al Rajjak',
    conUser: 'Jhon\'s Ahmed',
    viewers: 5240,
    votes: { pro: 2450, con: 1320 },
    imageUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=1000&auto=format&fit=crop',
    messages: [],
    argumentTree: MOCK_ARGUMENT_TREE
  },
  {
    id: '2',
    topic: 'Artificial Intelligence poses an existential threat to humanity',
    category: 'Technology',
    description: 'A deep dive into alignment problems, singularity risks, and the future of human labor.',
    status: 'UPCOMING',
    proUser: 'Dr. Sarah Connor',
    conUser: 'Miles Dyson',
    viewers: 1240,
    votes: { pro: 450, con: 320 },
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    messages: [],
    argumentTree: []
  },
  {
    id: '3',
    topic: 'Space Exploration is a waste of resources',
    category: 'Science',
    description: 'Should we fix Earth first or look to the stars?',
    status: 'LIVE',
    proUser: 'EarthFirst',
    conUser: 'StarGazer',
    viewers: 890,
    votes: { pro: 120, con: 600 },
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    messages: [],
    argumentTree: []
  }
];

const TOP_DEBATERS: DebaterProfile[] = [
  {
    id: 'd1',
    name: 'Alex Cicero',
    rank: 'Grandmaster',
    winRate: 84,
    debatesCount: 142,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
    badges: ['Logician', 'Crowd Favorite']
  },
  {
    id: 'd2',
    name: 'Sofia Truth',
    rank: 'Master',
    winRate: 78,
    debatesCount: 98,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150',
    badges: ['Fact Checker']
  },
  {
    id: 'd3',
    name: 'Marcus Aurelius II',
    rank: 'Diamond',
    winRate: 72,
    debatesCount: 210,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150',
    badges: ['Veteran', 'Philosopher']
  }
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [debates, setDebates] = useState<Debate[]>(INITIAL_DEBATES);
  const [activeDebate, setActiveDebate] = useState<Debate | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Role Selection Modal Logic
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // Only show if user hasn't selected a role yet (default is VIEWER, but this simulates 'guest')
    // and we are on the homepage.
    if (currentView === 'home' && currentUserRole === UserRole.VIEWER) {
        const timer = setTimeout(() => {
            setShowRoleModal(true);
        }, 30000); // 30 seconds
        return () => clearTimeout(timer);
    }
  }, [currentView, currentUserRole]);

  const handleRoleSelection = (role: UserRole, email?: string) => {
    setCurrentUserRole(role);
    setShowRoleModal(false);

    if (role !== UserRole.VIEWER && email) {
        const newNotif: Notification = {
            id: Date.now().toString(),
            type: 'LOGIN',
            message: `User ${email} identified as ${role}.`,
            timestamp: Date.now(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
    }
  };


  const handleStartDebate = (debate: Debate) => {
    setActiveDebate(debate);
    setCurrentView('room');
  };

  const renderContent = () => {
    // ADMIN LOGIN VIEW
    if (currentView === 'login') {
        return (
            <AdminLogin 
                onLoginSuccess={() => {
                    setCurrentUserRole(UserRole.ADMIN);
                    setCurrentView('admin');
                }}
                onCancel={() => setCurrentView('home')}
            />
        );
    }

    // ADMIN PANEL VIEW
    if (currentView === 'admin') {
      if (currentUserRole !== UserRole.ADMIN) {
        // Redirect to login if trying to access admin without role
        setCurrentView('login');
        return null;
      }
      return <AdminPanel debates={debates} setDebates={setDebates} setCurrentView={setCurrentView} notifications={notifications} />;
    }

    // LIVE DEBATE ROOM VIEW
    if (currentView === 'room' && activeDebate) {
      const liveDebateData = debates.find(d => d.id === activeDebate.id) || activeDebate;
      return (
        <DebateRoom 
          debate={liveDebateData} 
          currentUserRole={currentUserRole}
          onLeave={() => {
            setActiveDebate(null);
            setCurrentView('home');
          }}
          onEndDebate={(id) => {
              setDebates(prev => prev.map(d => d.id === id ? { ...d, status: 'COMPLETED' } : d));
          }}
        />
      );
    }

    // HOME PAGE View
    return (
      <div className="animate-in fade-in duration-500">
        <Hero onStart={() => {
            const live = debates.find(d => d.status === 'LIVE');
            if (live) handleStartDebate(live);
            else document.getElementById('debates-list')?.scrollIntoView({behavior: 'smooth'});
        }} />
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          
          {/* Live & Upcoming Section */}
          <section id="debates-list">
            <div className="flex items-center justify-between mb-10">
              <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-8 bg-indigo-500 rounded-sm"></span>
                    Live Debate Arena
                  </h2>
                  <p className="text-slate-400 mt-2 ml-5">Watch real-time intellectual combat in our structured tree-debate format.</p>
              </div>
              <button 
                onClick={() => setCurrentView('debates')}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group"
              >
                View All Debates <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {debates.map((debate) => (
                <div 
                  key={debate.id} 
                  onClick={() => handleStartDebate(debate)}
                  className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-indigo-900/20 transform hover:-translate-y-2 duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={debate.imageUrl} alt={debate.topic} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                    
                    <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg text-white border border-slate-700 shadow-lg">
                      {debate.status === 'LIVE' && <span className="flex items-center gap-2 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE NOW</span>}
                      {debate.status === 'UPCOMING' && <span className="text-blue-300 flex items-center gap-2"><Clock className="w-3 h-3" /> UPCOMING</span>}
                      {debate.status === 'COMPLETED' && <span className="text-slate-300">COMPLETED</span>}
                    </div>

                    <div className="absolute bottom-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white px-2 py-1 rounded mb-2 inline-block">
                            {debate.category}
                        </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight">
                      {debate.topic}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                      {debate.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-700 pt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium text-slate-300">{debate.viewers.toLocaleString()}</span>
                      </div>
                      <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800 ring-2 ring-slate-800" title={debate.proUser}>PRO</div>
                          <div className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-[10px] text-white font-bold border-2 border-slate-800 ring-2 ring-slate-800" title={debate.conUser}>CON</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leaderboard Section */}
          <section className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                <div className="md:w-1/3">
                    <h2 className="text-3xl font-bold text-white mb-4">Global Leaderboard</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Rise through the ranks by winning debates and earning high logic scores from our AI judges. Prove your rhetorical dominance.
                    </p>
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700">
                        View Full Rankings
                    </button>
                </div>
                
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                    {TOP_DEBATERS.map((debater, index) => (
                        <div key={debater.id} className={`relative bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col items-center text-center ${index === 0 ? 'ring-2 ring-amber-500 transform scale-105 shadow-2xl shadow-amber-900/20' : ''}`}>
                            {index === 0 && <div className="absolute -top-4 bg-amber-500 text-black font-bold px-4 py-1 rounded-full text-xs shadow-lg uppercase tracking-wider flex items-center gap-1"><Trophy className="w-3 h-3" /> #1 Champion</div>}
                            <div className="relative mb-4">
                                <img src={debater.avatarUrl} className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-700" alt={debater.name} />
                                <div className="absolute bottom-0 right-0 bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded border border-slate-700">{debater.rank}</div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{debater.name}</h3>
                            <div className="flex items-center gap-2 mb-4 justify-center flex-wrap">
                                {debater.badges.map(badge => (
                                    <span key={badge} className="text-[10px] bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded">{badge}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full mt-auto pt-4 border-t border-slate-700">
                                <div>
                                    <div className="text-lg font-bold text-green-400">{debater.winRate}%</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Win Rate</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{debater.debatesCount}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Debates</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </section>

          {/* Features Grid */}
          <section className="py-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">Why LogicallyDebate?</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">We combine traditional debate structures with cutting-edge AI to create the most fair and engaging platform on the web.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                          <Cpu className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">AI Arbiters</h3>
                      <p className="text-slate-400 leading-relaxed">
                          Our Gemini-powered judges analyze arguments for logical fallacies, evidence quality, and rhetorical strength in real-time.
                      </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6">
                          <TrendingUp className="w-6 h-6 text-pink-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Live Sentiment</h3>
                      <p className="text-slate-400 leading-relaxed">
                          Audience members vote throughout the debate, creating a dynamic "tug-of-war" visual that represents the swaying of public opinion.
                      </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                      <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6">
                          <ShieldCheck className="w-6 h-6 text-teal-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Fair Play System</h3>
                      <p className="text-slate-400 leading-relaxed">
                          Strict moderation tools and structured speaking times ensure that debates remain civil, focused, and productive.
                      </p>
                  </div>
              </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                          LogicallyDebate
                        </span>
                        <p className="mt-4 text-slate-400 max-w-sm">
                            The internet's premier arena for structured, logical discourse. Join the conversation today.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-indigo-400">Live Debates</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Rankings</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Rules</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Mobile App</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Community</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-indigo-400">Discord Server</a></li>
                            <li><a href="#" className="hover:text-indigo-400">Twitter / X</a></li>
                            <li><button onClick={() => setCurrentView('login')} className="hover:text-indigo-400 text-left w-full flex items-center gap-1"><Lock className="w-3 h-3"/> Staff Access</button></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    &copy; 2024 LogicallyDebate Inc. All rights reserved.
                </div>
            </div>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col relative">
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onSelectRole={handleRoleSelection}
        onClose={() => setShowRoleModal(false)}
      />
      {currentView !== 'login' && (
        <Navbar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          currentUserRole={currentUserRole}
          setCurrentUserRole={setCurrentUserRole}
        />
      )}
      {renderContent()}
    </div>
  );
};
