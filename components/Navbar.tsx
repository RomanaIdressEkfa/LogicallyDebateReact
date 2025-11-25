
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
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="w-full px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center cursor-pointer gap-3" onClick={() => setCurrentView('home')}>
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
                <Scale className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight hidden sm:block">
              LogicallyDebate
            </span>
            <span className="text-xl font-bold text-indigo-500 sm:hidden">LD</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 backdrop-blur-sm">
              <button 
                onClick={() => setCurrentView('home')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                Home
              </button>
              <button 
                onClick={() => setCurrentView('debates')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'debates' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                Live Battles
              </button>
              <button 
                onClick={() => setCurrentView('create')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'create' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                Create Debate
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                My Profile
              </button>
          </div>

          <div className="flex items-center gap-4">
             {/* Admin Quick Access Button */}
             {currentUserRole === UserRole.ADMIN ? (
                 <button 
                   onClick={() => setCurrentView('admin')}
                   className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/30 border border-red-500/30"
                 >
                    <LayoutDashboard className="w-3.5 h-3.5" /> SUPER ADMIN
                 </button>
             ) : (
                 <button 
                   onClick={() => setCurrentView('login')}
                   className="hidden lg:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-slate-700 hover:border-slate-600"
                 >
                    <Shield className="w-3.5 h-3.5" /> Staff Access
                 </button>
             )}

            <div className="h-8 w-px bg-slate-800 mx-2 hidden lg:block"></div>

            <div className="flex items-center gap-3 hidden lg:flex">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Viewing As</span>
              <div className="relative">
                  <select 
                    value={currentUserRole}
                    onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        setCurrentUserRole(newRole);
                        if (newRole !== UserRole.ADMIN && currentView === 'admin') {
                            setCurrentView('home');
                        }
                    }}
                    className="appearance-none bg-slate-900 text-white text-xs font-bold rounded-lg border border-slate-700 pl-3 pr-8 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors cursor-pointer hover:bg-slate-800"
                  >
                    <option value={UserRole.VIEWER}>Spectator</option>
                    <option value={UserRole.PRO_DEBATER}>Pro Debater</option>
                    <option value={UserRole.CON_DEBATER}>Con Debater</option>
                    <option value={UserRole.JUDGE}>Judge</option>
                    {currentUserRole === UserRole.ADMIN && <option value={UserRole.ADMIN}>Super Admin</option>}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
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
