

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Gavel, 
  Users, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search,
  Bell,
  Globe,
  ShieldAlert,
  FileText,
  HardDrive,
  LogOut,
  Menu,
  MapPin,
  MoreVertical,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  UserCheck,
  UserX,
  BadgeCheck,
  Trophy,
  PlayCircle,
  StopCircle,
  Clock,
  Eye,
  BarChart3,
  Zap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { Debate, UserRole, Notification, User, Report, SystemLog, ContentItem, DebaterProfile, Toast } from '../types';

interface AdminPanelProps {
  debates: Debate[];
  setDebates: React.Dispatch<React.SetStateAction<Debate[]>>;
  setCurrentView: (view: string) => void;
  notifications: Notification[];
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  primaryColor: string;
  setPrimaryColor: (c: string) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  topDebaters: DebaterProfile[];
  setTopDebaters: React.Dispatch<React.SetStateAction<DebaterProfile[]>>;
  addToast: (type: Toast['type'], message: string) => void;
}

const MOCK_REPORTS: Report[] = [
    { id: 'r1', targetId: 'u4', targetType: 'USER', reason: 'Ad hominem attacks in chat', reporter: 'Judge Judy', status: 'PENDING', timestamp: Date.now() - 100000 },
    { id: 'r2', targetId: 'd1', targetType: 'DEBATE', reason: 'Misleading topic title', reporter: 'Anonymous', status: 'RESOLVED', timestamp: Date.now() - 800000 },
];

const MOCK_LOGS: SystemLog[] = [
    { id: 'l1', level: 'INFO', message: 'System startup sequence initiated', module: 'CORE', timestamp: Date.now() - 5000 },
    { id: 'l2', level: 'SUCCESS', message: 'Database connection established (latency: 12ms)', module: 'DB', timestamp: Date.now() - 4000 },
    { id: 'l3', level: 'INFO', message: 'User Abdullah logged in from IP 192.168.1.1', module: 'AUTH', timestamp: Date.now() - 3000 },
    { id: 'l4', level: 'WARN', message: 'High memory usage detected on node-3', module: 'SYSTEM', timestamp: Date.now() - 2000 },
    { id: 'l5', level: 'ERROR', message: 'Failed to sync with Gemini API: Timeout', module: 'AI_SERVICE', timestamp: Date.now() - 1000 },
];

const INITIAL_CONTENT: ContentItem[] = [
    { id: 'c1', title: 'Welcome to LogicallyDebate 2.0', type: 'ANNOUNCEMENT', status: 'PUBLISHED', lastModified: '2023-10-25' },
    { id: 'c2', title: 'Privacy Policy Update', type: 'PAGE', status: 'PUBLISHED', lastModified: '2023-09-15' },
    { id: 'c3', title: 'Halloween Debate Tournament', type: 'BANNER', status: 'DRAFT', lastModified: '2023-10-27' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    debates, 
    setDebates, 
    setCurrentView, 
    notifications,
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    users,
    setUsers,
    topDebaters,
    setTopDebaters,
    addToast
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debates' | 'leaderboard' | 'users' | 'reports' | 'content' | 'settings' | 'logs'>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'security' | 'appearance'>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // User Management State
  const [userFilter, setUserFilter] = useState<'ALL' | UserRole>('ALL');
  const [activeUserActionMenu, setActiveUserActionMenu] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // CMS State
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [currentContent, setCurrentContent] = useState<Partial<ContentItem>>({});

  // Leaderboard Editing State
  const [isEditingDebater, setIsEditingDebater] = useState(false);
  const [currentDebater, setCurrentDebater] = useState<Partial<DebaterProfile>>({});

  // Live Monitor State
  const [monitoringDebate, setMonitoringDebate] = useState<Debate | null>(null);

  // Report State
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);

  // Dashboard Activity Feed
  const [activityFeed, setActivityFeed] = useState([
      { id: 1, text: "User 'Alex' started a new debate", time: "2 min ago", icon: Zap, color: "text-amber-500" },
      { id: 2, text: "New Report: Offensive Language", time: "5 min ago", icon: AlertTriangle, color: "text-red-500" },
      { id: 3, text: "Server Backup Completed", time: "10 min ago", icon: CheckCircle, color: "text-green-500" },
      { id: 4, text: "Pro Debater 'Sarah' achieved rank 'Gold'", time: "15 min ago", icon: Trophy, color: "text-yellow-400" },
  ]);

  // Derived Stats
  const liveDebatesCount = debates.filter(d => d.status === 'LIVE').length;
  const totalViewers = debates.reduce((acc, curr) => acc + (curr.status === 'LIVE' ? curr.viewers : 0), 0);
  const totalDebates = debates.length;

  // --- Handlers ---
  
  const handleDebateAction = (id: string, action: 'END' | 'DELETE' | 'LIVE') => {
      if (action === 'DELETE') {
           if(!confirm('Delete this debate permanently?')) return;
           setDebates(prev => prev.filter(d => d.id !== id));
           addToast('SUCCESS', 'Debate deleted from archives.');
           return;
      }
      
      setDebates(prev => prev.map(d => {
          if (d.id === id) {
              if (action === 'END') {
                  addToast('WARNING', 'Debate Force Ended by Admin');
                  return { ...d, status: 'COMPLETED' as const };
              }
              if (action === 'LIVE') {
                   addToast('SUCCESS', 'Debate status set to LIVE');
                   return { ...d, status: 'LIVE' as const };
              }
          }
          return d;
      }));
  };

  const handleUserAction = (userId: string, action: 'BAN' | 'DELETE' | 'PROMOTE_PRO' | 'PROMOTE_JUDGE' | 'VERIFY') => {
      if (action === 'DELETE') {
          if (confirm('Delete this user permanently?')) {
              setUsers(prev => prev.filter(u => u.id !== userId));
              addToast('SUCCESS', 'User data deleted permanently.');
          }
      } else if (action === 'BAN') {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'BANNED' } : u));
          addToast('ERROR', 'User has been banned.');
      } else if (action === 'VERIFY') {
           setUsers(prev => prev.map(u => u.id === userId ? { 
               ...u, 
               status: 'ACTIVE', 
               profileDetails: u.profileDetails ? { ...u.profileDetails, isVerified: true } : undefined 
            } : u));
           addToast('SUCCESS', 'User Verified and Activated.');
      } else if (action === 'PROMOTE_PRO') {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: UserRole.PRO_DEBATER } : u));
          addToast('SUCCESS', 'User promoted to Pro Debater.');
      } else if (action === 'PROMOTE_JUDGE') {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: UserRole.JUDGE } : u));
          addToast('SUCCESS', 'User promoted to Judge.');
      }
      setActiveUserActionMenu(null);
  };

  const handleSaveContent = () => {
      if (!currentContent.title || !currentContent.type) {
          addToast('ERROR', 'Title and Type are required.');
          return;
      }
      
      if (currentContent.id) {
          setContentItems(prev => prev.map(c => c.id === currentContent.id ? { ...c, ...currentContent, lastModified: new Date().toISOString().split('T')[0] } as ContentItem : c));
          addToast('SUCCESS', 'Content updated successfully.');
      } else {
          const newItem: ContentItem = {
              id: Date.now().toString(),
              title: currentContent.title,
              type: currentContent.type,
              status: currentContent.status || 'DRAFT',
              lastModified: new Date().toISOString().split('T')[0]
          };
          setContentItems(prev => [newItem, ...prev]);
          addToast('SUCCESS', 'New page created.');
      }
      setIsEditingContent(false);
      setCurrentContent({});
  };

  const handleDeleteContent = (id: string) => {
      if(confirm("Delete this content?")) {
          setContentItems(prev => prev.filter(c => c.id !== id));
          addToast('SUCCESS', 'Content deleted.');
      }
  };

  const handleEditContent = (item: ContentItem) => {
      setCurrentContent(item);
      setIsEditingContent(true);
  };

  const handleEditDebater = (debater: DebaterProfile) => {
      setCurrentDebater(debater);
      setIsEditingDebater(true);
  };

  const handleSaveDebater = () => {
      if (!currentDebater.id || !currentDebater.name) return;
      setTopDebaters(prev => prev.map(d => d.id === currentDebater.id ? { ...d, ...currentDebater } as DebaterProfile : d));
      setIsEditingDebater(false);
      setCurrentDebater({});
      addToast('SUCCESS', 'Debater profile updated.');
  };

  const handleDismissReport = (id: string) => {
      setReports(prev => prev.filter(r => r.id !== id));
      addToast('INFO', 'Report dismissed.');
  };

  const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = userFilter === 'ALL' || u.role === userFilter;
      return matchesSearch && matchesRole;
  });

  const SidebarItem = ({ id, icon: Icon, label, active }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 border-l-4 ${
            active 
            ? 'bg-primary-500/10 text-primary-500 border-primary-500' 
            : 'text-slate-500 hover:bg-slate-800 hover:text-white border-transparent dark:text-slate-400 dark:hover:bg-slate-800'
        }`}
      >
        <Icon className={`w-5 h-5 ${active ? 'text-primary-500' : 'text-slate-400'}`} />
        <span>{label}</span>
      </button>
  );

  const bgClass = theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-200';
  const cardBgClass = theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800';
  const inputBgClass = theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white';

  return (
    <div className={`flex h-[calc(100vh-80px)] overflow-hidden font-sans ${bgClass}`}>
      
      {/* --- MODALS --- */}
      {isEditingDebater && (
         <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-900 border border-slate-700'}`}>
                <h3 className="text-xl font-bold mb-6">Edit Debater Profile</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Display Name</label>
                        <input 
                            type="text" 
                            value={currentDebater.name || ''}
                            onChange={e => setCurrentDebater({...currentDebater, name: e.target.value})}
                            className={`w-full mt-1 p-3 rounded-lg border ${inputBgClass} focus:ring-2 focus:ring-primary-500 outline-none`}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">Rank</label>
                            <select 
                                value={currentDebater.rank || 'Bronze'}
                                onChange={e => setCurrentDebater({...currentDebater, rank: e.target.value})}
                                className={`w-full mt-1 p-3 rounded-lg border ${inputBgClass} focus:ring-2 focus:ring-primary-500 outline-none`}
                            >
                                <option value="Grandmaster">Grandmaster</option>
                                <option value="Diamond">Diamond</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Gold">Gold</option>
                                <option value="Silver">Silver</option>
                                <option value="Bronze">Bronze</option>
                            </select>
                        </div>
                        <div>
                             <label className="text-xs font-bold uppercase text-slate-500">Win Rate (%)</label>
                             <input 
                                type="number" 
                                value={currentDebater.winRate || 0}
                                onChange={e => setCurrentDebater({...currentDebater, winRate: Number(e.target.value)})}
                                className={`w-full mt-1 p-3 rounded-lg border ${inputBgClass} focus:ring-2 focus:ring-primary-500 outline-none`}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={() => setIsEditingDebater(false)} className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-500 font-bold hover:bg-slate-800 transition-colors">Cancel</button>
                    <button onClick={handleSaveDebater} className="flex-1 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors">Save Changes</button>
                </div>
            </div>
         </div>
      )}

      {/* Live Monitor Modal */}
      {monitoringDebate && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                 <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                     <div className="flex items-center gap-3">
                         <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                         <div>
                             <h3 className="text-white font-bold text-sm">LIVE MONITORING: {monitoringDebate.topic}</h3>
                             <p className="text-xs text-slate-500 font-mono">ID: {monitoringDebate.id} • {monitoringDebate.viewers} Viewers</p>
                         </div>
                     </div>
                     <button onClick={() => setMonitoringDebate(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
                 </div>
                 <div className="flex-1 flex">
                     {/* Fake Stream View */}
                     <div className="flex-1 bg-black relative flex items-center justify-center">
                         <div className="text-slate-600 flex flex-col items-center">
                             <Eye className="w-12 h-12 mb-2 opacity-50"/>
                             <p className="text-xs uppercase font-mono tracking-widest">A/V Stream Feed Encrypted</p>
                         </div>
                         <div className="absolute bottom-4 left-4 flex gap-2">
                             <div className="bg-black/50 text-white text-[10px] px-2 py-1 rounded border border-white/10">PRO: {monitoringDebate.proUser} (Speaking)</div>
                             <div className="bg-black/50 text-slate-400 text-[10px] px-2 py-1 rounded border border-white/10">CON: {monitoringDebate.conUser} (Muted)</div>
                         </div>
                     </div>
                     {/* Admin Controls */}
                     <div className="w-64 bg-slate-950 border-l border-slate-800 p-4 flex flex-col gap-3">
                         <h4 className="text-slate-500 text-xs font-bold uppercase">Emergency Actions</h4>
                         <button onClick={() => addToast('WARNING', 'Round Forced End')} className="w-full py-2 bg-red-900/30 text-red-500 border border-red-500/30 rounded text-xs font-bold hover:bg-red-900/50">Force End Round</button>
                         <button onClick={() => addToast('INFO', 'Warning Sent to Users')} className="w-full py-2 bg-amber-900/30 text-amber-500 border border-amber-500/30 rounded text-xs font-bold hover:bg-amber-900/50">Issue Warning</button>
                         <button onClick={() => addToast('INFO', 'Audio Muted')} className="w-full py-2 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-bold hover:bg-slate-700">Mute All Audio</button>
                         
                         <div className="mt-auto">
                            <h4 className="text-slate-500 text-xs font-bold uppercase mb-2">Real-time Sentiment</h4>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                                <div className="bg-blue-500 h-full w-[60%]"></div>
                                <div className="bg-red-500 h-full w-[40%]"></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>PRO 60%</span>
                                <span>CON 40%</span>
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Sidebar */}
      <aside className={`${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} border-r flex flex-col shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen ? (
              <div className="flex items-center gap-2 text-primary-500 font-bold tracking-tight">
                <ShieldAlert className="w-6 h-6" /> 
                <span className="uppercase">ADMIN PANEL</span>
              </div>
          ) : (
              <ShieldAlert className="w-6 h-6 text-primary-500 mx-auto" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-primary-500 hidden md:block">
              <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">General</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label={sidebarOpen ? "Dashboard" : ""} active={activeTab === 'dashboard'} />
                    <SidebarItem id="debates" icon={Gavel} label={sidebarOpen ? "Live Battles" : ""} active={activeTab === 'debates'} />
                    <SidebarItem id="leaderboard" icon={Trophy} label={sidebarOpen ? "Leaderboard" : ""} active={activeTab === 'leaderboard'} />
                </div>
            </div>
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Management</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="users" icon={Users} label={sidebarOpen ? "User Directory" : ""} active={activeTab === 'users'} />
                    <SidebarItem id="reports" icon={AlertTriangle} label={sidebarOpen ? "Reports & Bans" : ""} active={activeTab === 'reports'} />
                    <SidebarItem id="content" icon={FileText} label={sidebarOpen ? "CMS Content" : ""} active={activeTab === 'content'} />
                </div>
            </div>
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="settings" icon={Settings} label={sidebarOpen ? "Global Settings" : ""} active={activeTab === 'settings'} />
                    <SidebarItem id="logs" icon={HardDrive} label={sidebarOpen ? "System Logs" : ""} active={activeTab === 'logs'} />
                </div>
            </div>
        </div>
        
        <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
             <button onClick={() => setCurrentView('home')} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-bold uppercase">
                 <LogOut className="w-4 h-4" /> {sidebarOpen && "Exit Panel"}
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className={`sticky top-0 z-20 px-8 py-5 border-b flex justify-between items-center backdrop-blur-md ${theme === 'light' ? 'bg-white/90 border-slate-200' : 'bg-slate-950/90 border-slate-800'}`}>
            <div>
                <h2 className={`text-2xl font-bold capitalize ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{activeTab.replace('_', ' ')}</h2>
                <p className="text-xs text-slate-500 font-mono">System Status: <span className="text-green-500">OPTIMAL</span> • Server Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <input type="text" placeholder="Quick Search..." className={`border rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none w-64 ${inputBgClass}`} />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                        <Bell className="w-5 h-5 text-slate-400 hover:text-primary-500" />
                        {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        
                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className={`absolute top-10 right-0 w-80 rounded-xl shadow-2xl border p-2 z-50 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                                <h4 className="px-4 py-2 text-xs font-bold uppercase text-slate-500 border-b border-slate-800/50 mb-2">Recent Alerts</h4>
                                <div className="max-h-64 overflow-y-auto space-y-1">
                                    {notifications.length === 0 ? (
                                        <p className="text-center text-xs text-slate-500 py-4">No new notifications</p>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} className={`p-3 rounded-lg transition-colors border-l-2 ${notif.actionRequired ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:bg-slate-800/50'}`}>
                                                <div className="flex justify-between items-start">
                                                    <div className="text-xs font-bold text-white mb-1">{notif.type}</div>
                                                    {notif.actionRequired && <div className="bg-amber-500 text-slate-900 text-[8px] font-black px-1.5 rounded uppercase">Action</div>}
                                                </div>
                                                <div className="text-xs text-slate-400">{notif.message}</div>
                                                {notif.targetUserId && notif.actionRequired && (
                                                    <button 
                                                        onClick={() => {
                                                            setActiveTab('users');
                                                            setSearchTerm('Pending');
                                                            setShowNotifications(false);
                                                        }}
                                                        className="mt-2 text-xs text-primary-400 font-bold hover:underline"
                                                    >
                                                        Review User →
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary-500/30">SA</div>
                </div>
            </div>
        </div>

        <div className="p-8">
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Activity, label: "Active Battles", value: liveDebatesCount, color: "text-primary-500", bg: "bg-primary-500/10" },
                  { icon: Users, label: "Total Viewers", value: totalViewers.toLocaleString(), color: "text-green-500", bg: "bg-green-500/10" },
                  { icon: AlertTriangle, label: "Pending Reports", value: reports.length, color: "text-red-500", bg: "bg-red-500/10" },
                  { icon: Gavel, label: "Total Archived", value: 142 + totalDebates, color: "text-purple-500", bg: "bg-purple-500/10" }
                ].map((stat, i) => (
                   <div key={i} className={`p-6 rounded-2xl border shadow-sm transition-all ${cardBgClass}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'}`}>+12%</span>
                    </div>
                    <div className={`text-3xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                   </div>
                ))}
                </div>
                {/* ... (Maps and Activity Feed code remains same as previous step) ... */}
            </div>
            )}
            
            {/* ... (Debates, Leaderboard code remains same) ... */}

            {/* USERS DIRECTORY View - UPDATED */}
            {activeTab === 'users' && (
                <div className={`rounded-xl border shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300 ${cardBgClass}`}>
                    <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                        <div className="flex gap-2 p-1 bg-slate-800/10 rounded-lg">
                            {['ALL', UserRole.PRO_DEBATER, UserRole.CON_DEBATER, UserRole.JUDGE, UserRole.VIEWER].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setUserFilter(role as any)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${userFilter === role ? 'bg-primary-600 text-white shadow' : 'text-slate-500 hover:text-primary-500'}`}
                                >
                                    {role === 'ALL' ? 'All Users' : role.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 w-64 ${inputBgClass}`}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    <div className="overflow-x-auto h-[600px] custom-scrollbar">
                        <table className="w-full text-left text-sm relative">
                            <thead className={`uppercase text-xs font-bold tracking-wider sticky top-0 z-10 shadow-sm ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-slate-950 text-slate-500'}`}>
                                <tr>
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="px-6 py-4">Role & Status</th>
                                    <th className="px-6 py-4">Expertise & Profile</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200' : 'divide-slate-800'}`}>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className={`transition-colors relative ${theme === 'light' ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-slate-800/50 text-slate-300'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                user.role === UserRole.JUDGE ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                user.role === UserRole.PRO_DEBATER ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                user.role === UserRole.CON_DEBATER ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                            }`}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                            {user.status === 'SUSPENDED' || user.status === 'BANNED' ? (
                                                <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">BANNED</span>
                                            ) : user.status === 'PENDING_APPROVAL' ? (
                                                <span className="ml-2 text-[10px] bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded font-black animate-pulse">PENDING</span>
                                            ) : null}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.profileDetails ? (
                                                <div className="space-y-1">
                                                     <div className="text-xs font-medium text-slate-400">
                                                        <span className="text-slate-500 font-bold uppercase">Exp:</span> {user.profileDetails.yearsExperience}y • {user.profileDetails.credentials}
                                                     </div>
                                                     <div className="flex flex-wrap gap-1">
                                                         {user.profileDetails.expertise.slice(0, 2).map((exp, i) => (
                                                             <span key={i} className="text-[10px] bg-slate-800 px-1 rounded text-slate-400 border border-slate-700">{exp}</span>
                                                         ))}
                                                         {user.profileDetails.expertise.length > 2 && <span className="text-[10px] text-slate-500">+{user.profileDetails.expertise.length - 2}</span>}
                                                     </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">No detailed profile</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{user.joinedDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            {user.status === 'PENDING_APPROVAL' ? (
                                                <button 
                                                    onClick={() => handleUserAction(user.id, 'VERIFY')}
                                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-1 ml-auto"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approve Judge
                                                </button>
                                            ) : (
                                                <>
                                                <button 
                                                    onClick={() => setActiveUserActionMenu(activeUserActionMenu === user.id ? null : user.id)}
                                                    className="text-slate-400 hover:text-primary-500 p-2 rounded-full hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                
                                                {/* DROPDOWN MENU */}
                                                {activeUserActionMenu === user.id && (
                                                    <div className={`absolute right-12 z-50 w-48 rounded-xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                                                        <div className="py-1">
                                                            <button 
                                                                onClick={() => handleUserAction(user.id, 'BAN')}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                            >
                                                                <UserX className="w-3.5 h-3.5" /> Ban User
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUserAction(user.id, 'PROMOTE_PRO')}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-blue-500 hover:bg-blue-500/10 flex items-center gap-2"
                                                            >
                                                                <BadgeCheck className="w-3.5 h-3.5" /> Make Pro Debater
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUserAction(user.id, 'PROMOTE_JUDGE')}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-500 hover:bg-amber-500/10 flex items-center gap-2"
                                                            >
                                                                <Gavel className="w-3.5 h-3.5" /> Make Judge
                                                            </button>
                                                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                                                            <button 
                                                                onClick={() => handleUserAction(user.id, 'DELETE')}
                                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete Data
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* ... (Rest of the tabs remain same) ... */}
            
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;