
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DebateRoom from './components/DebateRoom';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import RoleSelectionModal from './components/RoleSelectionModal';
import ProfileSetup from './components/ProfileSetup';
import Profile from './components/Profile';
import CreateDebate from './components/CreateDebate';
import Rules from './components/Rules';
import DebatesList from './components/DebatesList';
import Leaderboard from './components/Leaderboard';
import Toast from './components/Toast';
import { Debate, UserRole, DebaterProfile, ArgumentNode, Notification, User, Toast as ToastType, UserProfileDetails } from './types';

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

const INITIAL_TOP_DEBATERS: DebaterProfile[] = [
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

const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'Abdullah Al Rajjak', email: 'abdullah@example.com', role: UserRole.PRO_DEBATER, status: 'ACTIVE', joinedDate: '2023-01-15', country: 'Bangladesh', ip: '192.168.1.1', profileDetails: { bio: 'Expert in Islamic Theology', expertise: ['Theology', 'History'], credentials: 'PhD Islamic Studies', yearsExperience: 10, isVerified: true } },
    { id: 'u2', name: 'Jhon\'s Ahmed', email: 'jhon@example.com', role: UserRole.CON_DEBATER, status: 'ACTIVE', joinedDate: '2023-02-20', country: 'USA', ip: '192.168.1.2', profileDetails: { bio: 'Critical thinker and secular humanist', expertise: ['Philosophy', 'Science'], credentials: 'MA Philosophy', yearsExperience: 5, isVerified: true } },
    { id: 'u3', name: 'Sarah Connor', email: 'sarah@skynet.com', role: UserRole.JUDGE, status: 'ACTIVE', joinedDate: '2023-03-10', country: 'UK', ip: '192.168.1.3', profileDetails: { bio: 'Neutral adjudicator for tech ethics', expertise: ['AI Ethics', 'Law'], credentials: 'JD Law', yearsExperience: 15, isVerified: true } },
    { id: 'u4', name: 'Miles Dyson', email: 'miles@cyberdyne.com', role: UserRole.VIEWER, status: 'SUSPENDED', joinedDate: '2023-04-05', country: 'USA', ip: '192.168.1.4' },
    { id: 'u5', name: 'Viewer One', email: 'v1@test.com', role: UserRole.VIEWER, status: 'ACTIVE', joinedDate: '2023-05-12', country: 'India', ip: '192.168.1.5' },
    { id: 'u6', name: 'Judge Judy', email: 'jj@court.tv', role: UserRole.JUDGE, status: 'ACTIVE', joinedDate: '2023-06-01', country: 'Canada', ip: '192.168.1.6', profileDetails: { bio: 'TV Judge', expertise: ['Law'], credentials: 'JD', yearsExperience: 30, isVerified: true } },
];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [debates, setDebates] = useState<Debate[]>(INITIAL_DEBATES);
  const [activeDebate, setActiveDebate] = useState<Debate | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [topDebaters, setTopDebaters] = useState<DebaterProfile[]>(INITIAL_TOP_DEBATERS);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  
  // Profile State for current user
  const [userProfileDetails, setUserProfileDetails] = useState<UserProfileDetails | undefined>(undefined);
  const [userName, setUserName] = useState<string>('Guest');
  const [userEmail, setUserEmail] = useState<string>('');

  // Theme Management
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [primaryColor, setPrimaryColor] = useState('default');

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (currentView === 'home' && currentUserRole === UserRole.VIEWER) {
        const timer = setTimeout(() => {
            setShowRoleModal(true);
        }, 30000); 
        return () => clearTimeout(timer);
    }
  }, [currentView, currentUserRole]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('dark', 'light');
    body.classList.remove('theme-blue', 'theme-purple', 'theme-emerald', 'theme-orange', 'light-mode');

    root.classList.add(theme);
    if (theme === 'light') body.classList.add('light-mode');
    if (primaryColor !== 'default') body.classList.add(`theme-${primaryColor}`);

  }, [theme, primaryColor]);

  const addToast = (type: ToastType['type'], message: string) => {
    const newToast: ToastType = {
      id: Date.now().toString(),
      type,
      message
    };
    setToasts(prev => [newToast, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleRoleSelection = (role: UserRole, email?: string) => {
    // If Admin or Viewer, proceed normally
    if (role === UserRole.VIEWER || role === UserRole.ADMIN) {
        setCurrentUserRole(role);
        setShowRoleModal(false);
        if (role !== UserRole.VIEWER && email) {
             addToast('SUCCESS', `Logged in as ${role}`);
        } else {
             addToast('INFO', 'Continuing as Audience Member');
        }
        return;
    }

    // If Role requires profile (Judge, Pro, Con)
    if (email) {
        setUserEmail(email);
        // Check if user already exists in our mock DB to simulate login
        const existingUser = users.find(u => u.email === email && u.role === role);
        
        if (existingUser && existingUser.profileDetails) {
            // Login successful
            setCurrentUserRole(role);
            setUserProfileDetails(existingUser.profileDetails);
            setUserName(existingUser.name);
            setShowRoleModal(false);
            
            if (existingUser.status === 'PENDING_APPROVAL') {
                 addToast('WARNING', `Account Pending: Waiting for Admin Verification`);
            } else {
                 addToast('SUCCESS', `Welcome back, ${existingUser.name}`);
            }

        } else {
            // New user or incomplete profile -> Force Setup
            setCurrentUserRole(role); // Set role temporarily
            setShowRoleModal(false);
            setCurrentView('profile_setup'); // Redirect to setup
            addToast('INFO', 'Please complete your profile to continue.');
        }
    }
  };

  const handleProfileComplete = (details: UserProfileDetails, name: string) => {
      setUserProfileDetails(details);
      setUserName(name);
      
      const isJudge = currentUserRole === UserRole.JUDGE;
      const initialStatus = isJudge ? 'PENDING_APPROVAL' : 'ACTIVE';
      const initialVerified = !isJudge; // Debaters auto-verified, Judges need manual verification

      // Create new user record in mock DB
      const userId = Date.now().toString();
      const newUser: User = {
          id: userId,
          name: name,
          email: userEmail,
          role: currentUserRole,
          status: initialStatus,
          joinedDate: new Date().toISOString().split('T')[0],
          country: 'Unknown', // In real app, detect IP
          ip: '127.0.0.1',
          profileDetails: {
              ...details,
              isVerified: initialVerified
          }
      };
      setUsers(prev => [newUser, ...prev]);

      // Notify Admin
      const newNotif: Notification = {
            id: Date.now().toString(),
            type: 'REGISTRATION',
            message: `New ${currentUserRole.replace('_', ' ')}: ${name} (${initialStatus === 'PENDING_APPROVAL' ? 'Needs Approval' : 'Verified'})`,
            timestamp: Date.now(),
            read: false,
            actionRequired: isJudge,
            targetUserId: userId
      };
      setNotifications(prev => [newNotif, ...prev]);

      // Feedback to User
      if (isJudge) {
          addToast('WARNING', 'Profile Submitted. Waiting for Admin Approval.');
      } else {
          addToast('SUCCESS', 'Profile Verified! Access Granted.');
      }
      
      setCurrentView('profile'); // Go to profile after setup
  };

  const handleStartDebate = (debate: Debate) => {
    setActiveDebate(debate);
    setCurrentView('room');
    addToast('INFO', `Entered Arena: ${debate.topic}`);
  };

  const handleCreateDebate = (newDebate: Debate) => {
      setDebates([newDebate, ...debates]);
      setActiveDebate(newDebate);
      setCurrentView('room');
      addToast('SUCCESS', 'Debate Launched Successfully!');
  };

  const renderContent = () => {
    if (currentView === 'login') {
        return (
            <AdminLogin 
                onLoginSuccess={() => {
                    setCurrentUserRole(UserRole.ADMIN);
                    setCurrentView('admin');
                    addToast('SUCCESS', 'Welcome back, Administrator');
                }}
                onCancel={() => setCurrentView('home')}
            />
        );
    }

    if (currentView === 'profile_setup') {
        return (
            <ProfileSetup 
                role={currentUserRole} 
                email={userEmail} 
                onComplete={handleProfileComplete} 
            />
        );
    }

    if (currentView === 'admin') {
      if (currentUserRole !== UserRole.ADMIN) {
        setCurrentView('login');
        return null;
      }
      return (
        <AdminPanel 
            debates={debates} 
            setDebates={setDebates} 
            setCurrentView={setCurrentView} 
            notifications={notifications}
            theme={theme}
            setTheme={setTheme}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            users={users}
            setUsers={setUsers}
            topDebaters={topDebaters}
            setTopDebaters={setTopDebaters}
            addToast={addToast}
        />
      );
    }

    if (currentView === 'profile') {
        return (
            <Profile 
                currentUserRole={currentUserRole} 
                userProfileDetails={userProfileDetails}
                profileData={userProfileDetails ? { name: userName, role: currentUserRole } : undefined}
                debates={debates}
            />
        );
    }

    if (currentView === 'create') {
        return <CreateDebate onCreate={handleCreateDebate} onCancel={() => setCurrentView('home')} />;
    }

    if (currentView === 'rules') {
        return <Rules />;
    }

    if (currentView === 'debates') {
        return <DebatesList debates={debates} onSelectDebate={handleStartDebate} />;
    }

    if (currentView === 'leaderboard') {
        return <Leaderboard topDebaters={topDebaters} />;
    }

    if (currentView === 'room' && activeDebate) {
      const liveDebateData = debates.find(d => d.id === activeDebate.id) || activeDebate;
      return (
        <DebateRoom 
          debate={liveDebateData} 
          currentUserRole={currentUserRole}
          onLeave={() => {
            setActiveDebate(null);
            setCurrentView('home');
            addToast('INFO', 'Left Debate Arena');
          }}
          onEndDebate={(id) => {
              setDebates(prev => prev.map(d => d.id === id ? { ...d, status: 'COMPLETED' } : d));
              addToast('WARNING', 'Debate Ended by Admin');
          }}
          addToast={addToast}
        />
      );
    }

    return (
        <Home 
            debates={debates}
            topDebaters={topDebaters}
            onStartDebate={handleStartDebate}
            onViewAllDebates={() => setCurrentView('debates')}
            onViewLeaderboard={() => setCurrentView('leaderboard')}
            onLearnMore={() => setCurrentView('rules')}
        />
    );
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-primary-500/30 flex flex-col relative w-full overflow-x-hidden ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-200'}`}>
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onSelectRole={handleRoleSelection}
        onClose={() => setShowRoleModal(false)}
      />
      {currentView !== 'login' && currentView !== 'profile_setup' && (
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
