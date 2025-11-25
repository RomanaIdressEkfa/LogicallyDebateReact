
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DebateRoom from './components/DebateRoom';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RoleSelectionModal from './components/RoleSelectionModal';
import Profile from './components/Profile';
import CreateDebate from './components/CreateDebate';
import Rules from './components/Rules';
import DebatesList from './components/DebatesList';
import Leaderboard from './components/Leaderboard';
import { Debate, UserRole, DebaterProfile, ArgumentNode, Notification } from './types';

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

  const handleCreateDebate = (newDebate: Debate) => {
      setDebates([newDebate, ...debates]);
      setActiveDebate(newDebate);
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

    // PROFILE VIEW
    if (currentView === 'profile') {
        return <Profile currentUserRole={currentUserRole} />;
    }

    // CREATE DEBATE VIEW
    if (currentView === 'create') {
        return <CreateDebate onCreate={handleCreateDebate} onCancel={() => setCurrentView('home')} />;
    }

    // RULES VIEW
    if (currentView === 'rules') {
        return <Rules />;
    }

    // ALL DEBATES VIEW
    if (currentView === 'debates') {
        return <DebatesList debates={debates} onSelectDebate={handleStartDebate} />;
    }

    // LEADERBOARD VIEW
    if (currentView === 'leaderboard') {
        return <Leaderboard topDebaters={TOP_DEBATERS} />;
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

    // HOME PAGE View (Extracted to Component)
    return (
        <Home 
            debates={debates}
            topDebaters={TOP_DEBATERS}
            onStartDebate={handleStartDebate}
            onViewAllDebates={() => setCurrentView('debates')}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
            onLearnMore={() => setCurrentView('rules')}
        />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col relative w-full overflow-x-hidden">
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
