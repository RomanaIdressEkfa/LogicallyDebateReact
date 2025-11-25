
import React from 'react';
import { Scale, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, currentUserRole, setCurrentUserRole }) => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <Scale className="h-8 w-8 text-indigo-500 mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hidden sm:block">
              LogicallyDebate
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 sm:hidden">
              LD
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => setCurrentView('home')}
                className={`${currentView === 'home' || currentView === 'debates' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                Live Debates
              </button>
              <button 
                onClick={() => setCurrentView('create')}
                className={`${currentView === 'create' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                Start Debate
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className={`${currentView === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition-colors`}>
                Profile
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {currentUserRole === UserRole.ADMIN && (
                <span className="flex items-center gap-1 text-indigo-400 bg-indigo-900/20 border border-indigo-500/30 px-2 py-1 rounded text-xs font-bold mr-2">
                    <Shield className="w-3 h-3" /> Admin Mode
                </span>
             )}

            <span className="text-xs text-slate-400 uppercase hidden lg:block">View As:</span>
            <select 
              value={currentUserRole}
              onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  setCurrentUserRole(newRole);
                  // If switching away from admin while on admin view, go home
                  if (newRole !== UserRole.ADMIN && currentView === 'admin') {
                      setCurrentView('home');
                  }
              }}
              className="bg-slate-800 text-slate-200 text-xs rounded border border-slate-600 px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value={UserRole.VIEWER}>Audience</option>
              <option value={UserRole.PRO_DEBATER}>Pro Debater</option>
              <option value={UserRole.CON_DEBATER}>Con Debater</option>
              <option value={UserRole.JUDGE}>Judge</option>
              {currentUserRole === UserRole.ADMIN && <option value={UserRole.ADMIN}>Super Admin</option>}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
