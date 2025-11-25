
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Gavel, 
  Users, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Play, 
  Square,
  Search,
  Bell,
  Clock,
  Globe,
  ShieldAlert,
  FileText,
  MessageSquare,
  BarChart,
  HardDrive,
  LogOut,
  Palette,
  Lock,
  Menu
} from 'lucide-react';
import { Debate, UserRole, Notification } from '../types';

interface AdminPanelProps {
  debates: Debate[];
  setDebates: React.Dispatch<React.SetStateAction<Debate[]>>;
  setCurrentView: (view: string) => void;
  notifications: Notification[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ debates, setDebates, setCurrentView, notifications }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debates' | 'users' | 'reports' | 'content' | 'settings'>('dashboard');
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'security' | 'appearance'>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Derived Stats
  const liveDebatesCount = debates.filter(d => d.status === 'LIVE').length;
  const totalViewers = debates.reduce((acc, curr) => acc + (curr.status === 'LIVE' ? curr.viewers : 0), 0);
  const totalDebates = debates.length;

  const handleStatusChange = (id: string, newStatus: Debate['status']) => {
    setDebates(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this debate record?')) {
      setDebates(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredDebates = debates.filter(d => 
    d.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.proUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SidebarItem = ({ id, icon: Icon, label, active }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-full transition-all duration-200 border-l-4 ${
            active 
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white border-transparent'
        }`}
      >
        <Icon className={`w-5 h-5 ${active ? 'text-indigo-500' : 'text-slate-500'}`} />
        <span>{label}</span>
      </button>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* "AmazCart" Style Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen ? (
              <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-tight">
                <ShieldAlert className="w-6 h-6" /> 
                <span className="uppercase">ADMIN PANEL</span>
              </div>
          ) : (
              <ShieldAlert className="w-6 h-6 text-indigo-400 mx-auto" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-white hidden md:block">
              <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 custom-scrollbar">
            {/* General Section */}
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">General</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="dashboard" icon={LayoutDashboard} label={sidebarOpen ? "Dashboard" : ""} active={activeTab === 'dashboard'} />
                    <SidebarItem id="debates" icon={Gavel} label={sidebarOpen ? "Live Battles" : ""} active={activeTab === 'debates'} />
                </div>
            </div>

            {/* Management Section */}
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Management</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="users" icon={Users} label={sidebarOpen ? "User Directory" : ""} active={activeTab === 'users'} />
                    <SidebarItem id="reports" icon={AlertTriangle} label={sidebarOpen ? "Reports & Bans" : ""} active={activeTab === 'reports'} />
                    <SidebarItem id="content" icon={FileText} label={sidebarOpen ? "CMS Content" : ""} active={activeTab === 'content'} />
                </div>
            </div>

            {/* System Section */}
            <div>
                {sidebarOpen && <h3 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">System</h3>}
                <div className="pr-4 space-y-1">
                    <SidebarItem id="settings" icon={Settings} label={sidebarOpen ? "Global Settings" : ""} active={activeTab === 'settings'} />
                    <SidebarItem id="logs" icon={HardDrive} label={sidebarOpen ? "System Logs" : ""} active={false} />
                </div>
            </div>
        </div>
        
        <div className="p-4 border-t border-slate-800">
             <button onClick={() => setCurrentView('home')} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors text-xs font-bold uppercase">
                 <LogOut className="w-4 h-4" /> {sidebarOpen && "Exit Panel"}
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        {/* Top Header */}
        <div className="sticky top-0 bg-slate-950/90 backdrop-blur z-20 px-8 py-5 border-b border-slate-800 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white capitalize">{activeTab.replace('_', ' ')}</h2>
                <p className="text-xs text-slate-500 font-mono">System Status: <span className="text-green-500">OPTIMAL</span> • Server Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <input type="text" placeholder="Quick Search..." className="bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none w-64" />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer">
                        <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
                        {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/30">SA</div>
                </div>
            </div>
        </div>

        <div className="p-8">
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded">+12%</span>
                    </div>
                    <div className="text-3xl font-black text-white">{liveDebatesCount}</div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Battles</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-green-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded">+8%</span>
                    </div>
                    <div className="text-3xl font-black text-white">{totalViewers.toLocaleString()}</div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Viewers</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-amber-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded">+2</span>
                    </div>
                    <div className="text-3xl font-black text-white">12</div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Reports</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-purple-500/50 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <Gavel className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white">{142 + totalDebates}</div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Archived</p>
                </div>
                </div>

                {/* Notifications */}
                {notifications.length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Bell className="w-4 h-4 text-indigo-400" /> Recent System Alerts
                        </h3>
                        <div className="space-y-2">
                            {notifications.slice(0, 5).map(notif => (
                                <div key={notif.id} className="flex items-center gap-4 p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-200 font-medium">{notif.message}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Live Monitoring Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                            Live Monitoring
                        </h2>
                        <button className="text-xs text-indigo-400 hover:text-white font-bold">View All Streams</button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {debates.filter(d => d.status === 'LIVE').length === 0 ? (
                        <div className="col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-500 border-dashed">
                            <p>No active live debates detected.</p>
                        </div>
                        ) : (
                        debates.filter(d => d.status === 'LIVE').map(debate => (
                            <div key={debate.id} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col hover:border-indigo-500/50 transition-all shadow-lg group">
                            <div className="relative h-40">
                                <img src={debate.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-lg font-bold text-white truncate">{debate.topic}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-300 font-mono">{debate.proUser} vs {debate.conUser}</span>
                                    <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-lg border border-red-400">LIVE</span>
                                </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800 flex justify-between items-center border-t border-slate-700">
                                <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-400" /> {debate.viewers.toLocaleString()} watching
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleStatusChange(debate.id, 'COMPLETED')}
                                        className="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white rounded-lg text-xs font-bold transition-all uppercase"
                                    >
                                        Force End
                                    </button>
                                </div>
                            </div>
                            </div>
                        ))
                        )}
                    </div>
                </div>
            </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
                <div className="max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4">
                    <div className="flex border-b border-slate-800">
                        <button 
                            onClick={() => setSettingsSubTab('general')}
                            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${settingsSubTab === 'general' ? 'border-indigo-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            General Settings
                        </button>
                        <button 
                            onClick={() => setSettingsSubTab('security')}
                            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${settingsSubTab === 'security' ? 'border-indigo-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            Security & Access
                        </button>
                        <button 
                            onClick={() => setSettingsSubTab('appearance')}
                            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${settingsSubTab === 'appearance' ? 'border-indigo-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
                        >
                            Appearance
                        </button>
                    </div>

                    <div className="p-8">
                        {settingsSubTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Platform Name</label>
                                    <input type="text" defaultValue="LogicallyDebate" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Contact Email</label>
                                    <input type="email" defaultValue="admin@logicallydebate.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <div>
                                        <h4 className="text-white font-bold">Maintenance Mode</h4>
                                        <p className="text-xs text-slate-500">Disable access for non-admins.</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full bg-slate-700 cursor-pointer">
                                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {settingsSubTab === 'security' && (
                             <div className="space-y-6">
                                <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm flex gap-3">
                                    <ShieldAlert className="w-5 h-5 shrink-0" />
                                    Security settings require Super Admin password confirmation to save.
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <div>
                                        <h4 className="text-white font-bold">Two-Factor Authentication (2FA)</h4>
                                        <p className="text-xs text-slate-500">Enforce for all moderator accounts.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></span></div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">IP Whitelist</label>
                                    <textarea rows={3} placeholder="Enter IPs separated by commas" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none font-mono text-xs"></textarea>
                                </div>
                             </div>
                        )}

                        {settingsSubTab === 'appearance' && (
                             <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-slate-950 border-2 border-indigo-500 rounded-xl cursor-pointer">
                                        <div className="h-20 bg-slate-900 rounded mb-2"></div>
                                        <div className="text-center text-white font-bold text-sm">Dark Mode</div>
                                    </div>
                                    <div className="p-4 bg-white border-2 border-transparent rounded-xl cursor-pointer opacity-50">
                                        <div className="h-20 bg-gray-100 rounded mb-2"></div>
                                        <div className="text-center text-slate-900 font-bold text-sm">Light Mode</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Primary Color</label>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 ring-2 ring-white cursor-pointer"></div>
                                        <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer opacity-50"></div>
                                        <div className="w-8 h-8 rounded-full bg-purple-600 cursor-pointer opacity-50"></div>
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 cursor-pointer opacity-50"></div>
                                    </div>
                                </div>
                             </div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Fallback for other tabs */}
            {(activeTab === 'users' || activeTab === 'reports' || activeTab === 'content') && (
                <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                        {activeTab === 'users' && <Users className="w-10 h-10" />}
                        {activeTab === 'reports' && <AlertTriangle className="w-10 h-10" />}
                        {activeTab === 'content' && <FileText className="w-10 h-10" />}
                    </div>
                    <h3 className="text-xl font-bold text-white capitalize">{activeTab} Management</h3>
                    <p>This module allows you to manage {activeTab} records.</p>
                </div>
            )}

            {/* Debates Tab */}
            {activeTab === 'debates' && (
                 <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                 <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                     <input 
                       type="text" 
                       placeholder="Search database..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 transition-all"
                     />
                   </div>
                   <div className="flex gap-2">
                      <select className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none cursor-pointer hover:border-slate-600 transition-colors">
                          <option>All Categories</option>
                          <option>Politics</option>
                          <option>Technology</option>
                      </select>
                   </div>
                 </div>
                 
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-300">
                     <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold tracking-wider">
                       <tr>
                         <th className="px-6 py-4">Topic Details</th>
                         <th className="px-6 py-4">Participants</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Metrics</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {filteredDebates.map((debate) => (
                         <tr key={debate.id} className="hover:bg-slate-800/50 transition-colors group">
                           <td className="px-6 py-4">
                             <div className="font-bold text-white line-clamp-1 w-64 group-hover:text-indigo-400 transition-colors">{debate.topic}</div>
                             <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                 <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                                 {debate.category}
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-col gap-1.5">
                                 <span className="text-blue-400 text-xs font-medium bg-blue-900/20 px-2 py-0.5 rounded border border-blue-900/30 w-fit">PRO: {debate.proUser}</span>
                                 <span className="text-red-400 text-xs font-medium bg-red-900/20 px-2 py-0.5 rounded border border-red-900/30 w-fit">CON: {debate.conUser}</span>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                               ${debate.status === 'LIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                 debate.status === 'UPCOMING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                               {debate.status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                               {debate.status}
                             </span>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex flex-col text-xs font-medium">
                                <span className="text-white">{debate.viewers.toLocaleString()} Viewers</span>
                                <span className="text-slate-500">{debate.votes.pro + debate.votes.con} Votes</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {debate.status === 'UPCOMING' && (
                                    <button 
                                      onClick={() => handleStatusChange(debate.id, 'LIVE')}
                                      title="Start Debate"
                                      className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                                    >
                                        <Play className="w-4 h-4" />
                                    </button>
                                )}
                                {debate.status === 'LIVE' && (
                                    <button 
                                      onClick={() => handleStatusChange(debate.id, 'COMPLETED')}
                                      title="End Debate"
                                      className="p-2 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white rounded-lg transition-colors border border-amber-500/20"
                                    >
                                        <Square className="w-4 h-4" />
                                    </button>
                                )}
                                <button 
                                  onClick={() => handleDelete(debate.id)}
                                  title="Delete Debate"
                                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
