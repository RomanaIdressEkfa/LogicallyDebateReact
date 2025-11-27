
import React from 'react';
import { Scale, Shield, LayoutDashboard, LogIn, TrendingUp, CreditCard } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, currentUserRole, setCurrentUserRole }) => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-2xl">
      <div className="w-full px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section - Restored to Premium Design */}
          <div className="flex items-center cursor-pointer gap-3 group" onClick={() => setCurrentView('home')}>
            <div className="relative">
                <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-2.5 rounded-xl border border-primary-500/30 shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                    <Scale className="h-6 w-6 text-white" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-primary-300 tracking-tight leading-none group-hover:to-white transition-all">
                LogicallyDebate
                </span>
                <span className="text-[10px] font-bold text-primary-500 tracking-[0.3em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                    Intellectual Arena
                </span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-inner">
              {[
                  { id: 'home', label: 'Home' },
                  { id: 'debates', label: 'Live Battles' },
                  { id: 'create', label: 'Create Debate' },
                  { id: 'profile', label: 'My Profile' }
              ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        currentView === item.id 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 ring-1 ring-primary-400/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
              ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
             {currentUserRole === UserRole.ADMIN ? (
                 <button 
                   onClick={() => setCurrentView('admin')}
                   className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/30 hover:scale-105 active:scale-95"
                 >
                    <LayoutDashboard className="w-4 h-4" /> SUPER ADMIN
                 </button>
             ) : (
                 <button 
                   onClick={() => setCurrentView('login')}
                   className="hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700 hover:border-slate-500"
                 >
                    <Shield className="w-4 h-4" /> Staff Access
                 </button>
             )}

            <div className="h-8 w-px bg-slate-800 mx-2 hidden lg:block"></div>

            <div className="flex items-center gap-3 hidden lg:flex">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">View As</span>
              <div className="relative group">
                  <select 
                    value={currentUserRole}
                    onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        setCurrentUserRole(newRole);
                        if (newRole !== UserRole.ADMIN && currentView === 'admin') {
                            setCurrentView('home');
                        }
                    }}
                    className="appearance-none bg-slate-900 text-white text-xs font-bold rounded-lg border border-slate-700 pl-4 pr-10 py-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors cursor-pointer hover:bg-slate-800 hover:border-slate-600"
                  >
                    <option value={UserRole.VIEWER}>Spectator</option>
                    <option value={UserRole.PRO_DEBATER}>Pro Debater</option>
                    <option value={UserRole.CON_DEBATER}>Con Debater</option>
                    <option value={UserRole.JUDGE}>Judge</option>
                    {currentUserRole === UserRole.ADMIN && <option value={UserRole.ADMIN}>Super Admin</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-primary-500 transition-colors">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
