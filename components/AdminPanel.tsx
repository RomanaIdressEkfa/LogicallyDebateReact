
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
  Clock
} from 'lucide-react';
import { Debate, UserRole, Notification } from '../types';

interface AdminPanelProps {
  debates: Debate[];
  setDebates: React.Dispatch<React.SetStateAction<Debate[]>>;
  setCurrentView: (view: string) => void;
  notifications: Notification[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ debates, setDebates, setCurrentView, notifications }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'debates' | 'users'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Super Admin</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('debates')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'debates' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Gavel className="w-5 h-5" />
              Manage Debates
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Users className="w-5 h-5" />
              Users & Reports
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-slate-400">System Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {activeTab === 'dashboard' && 'Overview'}
            {activeTab === 'debates' && 'Debate Management'}
            {activeTab === 'users' && 'User Administration'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
                <Bell className="w-6 h-6 text-slate-400" />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">{notifications.filter(n => !n.read).length}</span>}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">Super Admin</p>
              <p className="text-xs text-slate-400">admin@logicallydebate.com</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" className="w-10 h-10 rounded-full ring-2 ring-indigo-500" alt="Admin" />
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Notifications Alert Box */}
            {notifications.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-400" /> Recent System Notifications
                    </h3>
                    <div className="space-y-3">
                        {notifications.slice(0, 5).map(notif => (
                            <div key={notif.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                <Clock className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-300">{notif.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Active Live Debates</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{liveDebatesCount}</h3>
                </div>
                <Activity className="absolute right-4 top-6 text-indigo-500/20 w-16 h-16" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Total Concurrent Viewers</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{totalViewers.toLocaleString()}</h3>
                </div>
                <Users className="absolute right-4 top-6 text-green-500/20 w-16 h-16" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Pending Reports</p>
                  <h3 className="text-3xl font-bold text-white mt-2">12</h3>
                </div>
                <AlertTriangle className="absolute right-4 top-6 text-amber-500/20 w-16 h-16" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"></div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Total Debates Hosted</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{142 + totalDebates}</h3>
                </div>
                <Gavel className="absolute right-4 top-6 text-purple-500/20 w-16 h-16" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>
              </div>
            </div>

            {/* Live Monitoring Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                Live Monitoring
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {debates.filter(d => d.status === 'LIVE').length === 0 ? (
                  <div className="col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500 border-dashed">
                    No active live debates at the moment.
                  </div>
                ) : (
                  debates.filter(d => d.status === 'LIVE').map(debate => (
                    <div key={debate.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
                      <div className="relative h-40">
                        <img src={debate.imageUrl} className="w-full h-full object-cover opacity-50" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white truncate">{debate.topic}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-slate-300">{debate.proUser} vs {debate.conUser}</span>
                            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">LIVE</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-800 flex justify-between items-center border-t border-slate-700">
                        <div className="text-sm text-slate-400">
                          <Users className="w-4 h-4 inline mr-1" /> {debate.viewers} watching
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleStatusChange(debate.id, 'COMPLETED')}
                                className="px-3 py-1 bg-red-900/50 text-red-400 border border-red-900 hover:bg-red-900 rounded text-xs font-medium transition-colors"
                            >
                                Force End
                            </button>
                            <button className="px-3 py-1 bg-slate-700 text-white hover:bg-slate-600 rounded text-xs font-medium transition-colors">
                                Moderate Chat
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

        {/* Debates Management Tab */}
        {activeTab === 'debates' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search debates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-64"
                />
              </div>
              <div className="flex gap-2">
                 <select className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white outline-none">
                     <option>All Categories</option>
                     <option>Politics</option>
                     <option>Technology</option>
                 </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Topic</th>
                    <th className="px-6 py-4 font-semibold">Debaters</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Engagement</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredDebates.map((debate) => (
                    <tr key={debate.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white line-clamp-1 w-64">{debate.topic}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{debate.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-blue-400 text-xs">PRO: {debate.proUser}</span>
                            <span className="text-red-400 text-xs">CON: {debate.conUser}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${debate.status === 'LIVE' ? 'bg-red-900/30 text-red-400 border-red-900' : 
                            debate.status === 'UPCOMING' ? 'bg-blue-900/30 text-blue-400 border-blue-900' : 
                            'bg-slate-700 text-slate-400 border-slate-600'}`}>
                          {debate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                           <span>{debate.viewers} Viewers</span>
                           <span className="text-slate-500">{debate.votes.pro + debate.votes.con} Votes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {debate.status === 'UPCOMING' && (
                               <button 
                                 onClick={() => handleStatusChange(debate.id, 'LIVE')}
                                 title="Start Debate"
                                 className="p-1.5 bg-green-900/30 text-green-400 hover:bg-green-900 hover:text-white rounded transition-colors"
                               >
                                   <Play className="w-4 h-4" />
                               </button>
                           )}
                           {debate.status === 'LIVE' && (
                               <button 
                                 onClick={() => handleStatusChange(debate.id, 'COMPLETED')}
                                 title="End Debate"
                                 className="p-1.5 bg-amber-900/30 text-amber-400 hover:bg-amber-900 hover:text-white rounded transition-colors"
                               >
                                   <Square className="w-4 h-4" />
                               </button>
                           )}
                           <button 
                             onClick={() => handleDelete(debate.id)}
                             title="Delete Debate"
                             className="p-1.5 bg-red-900/30 text-red-400 hover:bg-red-900 hover:text-white rounded transition-colors"
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
            {filteredDebates.length === 0 && (
                <div className="p-8 text-center text-slate-500">No debates found matching your search.</div>
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
           <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg p-8 text-center">
               <div className="max-w-md mx-auto">
                   <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-white mb-2">User Management Module</h3>
                   <p className="text-slate-400 mb-6">
                       This module handles user roles, bans, and detailed profile editing. 
                       Currently populated with 1,240 active users in the system database.
                   </p>
                   <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                       View User Database
                   </button>
               </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
