
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Shield, User, Users, Gavel, ArrowRight, Lock } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onSelectRole: (role: UserRole, email?: string) => void;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onSelectRole, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  if (!isOpen) return null;

  const handleRoleClick = (role: UserRole) => {
    if (role === UserRole.VIEWER) {
      onSelectRole(role);
    } else {
      setSelectedRole(role);
      setShowEmailInput(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onSelectRole(selectedRole, email);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        {!showEmailInput ? (
            <>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Identify Yourself</h2>
                    <p className="text-slate-400">Please confirm your role to continue accessing the debate floor.</p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => handleRoleClick(UserRole.VIEWER)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-700 p-2 rounded-lg group-hover:bg-slate-600 transition-colors">
                                <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Audience Member</div>
                                <div className="text-xs text-slate-400">View and vote</div>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </button>

                    <button 
                        onClick={() => handleRoleClick(UserRole.JUDGE)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group"
                    >
                         <div className="flex items-center gap-3">
                            <div className="bg-slate-700 p-2 rounded-lg group-hover:bg-slate-600 transition-colors">
                                <Gavel className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Official Judge</div>
                                <div className="text-xs text-slate-400">Verification required</div>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                    </button>

                    <button 
                        onClick={() => handleRoleClick(UserRole.PRO_DEBATER)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-700 p-2 rounded-lg group-hover:bg-slate-600 transition-colors">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Pro Debater</div>
                                <div className="text-xs text-slate-400">Login required</div>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                    </button>

                     <button 
                        onClick={() => handleRoleClick(UserRole.CON_DEBATER)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-700 p-2 rounded-lg group-hover:bg-slate-600 transition-colors">
                                <User className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Con Debater</div>
                                <div className="text-xs text-slate-400">Login required</div>
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                    </button>
                </div>
            </>
        ) : (
            <form onSubmit={handleSubmit}>
                <div className="text-center mb-6">
                    <button type="button" onClick={() => setShowEmailInput(false)} className="text-slate-400 hover:text-white text-xs mb-4">← Back to selection</button>
                    <h2 className="text-xl font-bold text-white">Verify Identity</h2>
                    <p className="text-slate-400 text-sm mt-1">Enter your registered email to alert the Admin.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-300 uppercase ml-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="name@example.com"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Verify & Login
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionModal;
