
import React from 'react';
import { Check, Zap, Crown, Shield } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">Choose Your Arena Tier</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Unlock advanced analytics, priority debate matching, and exclusive badges with our Pro memberships.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Novice</h3>
              <div className="text-4xl font-extrabold text-white mb-1">$0</div>
              <p className="text-sm text-slate-500">Forever Free</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-green-500 shrink-0" /> Watch unlimited debates
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-green-500 shrink-0" /> Participate as Audience
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-green-500 shrink-0" /> 1 Public Debate / Month
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm line-through">
                <Check className="w-5 h-5 text-slate-700 shrink-0" /> AI Argument Analysis
              </li>
            </ul>
            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-indigo-900/20 to-slate-900 rounded-3xl p-8 border border-indigo-500/50 shadow-2xl relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">Most Popular</div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2"><Zap className="w-5 h-5" /> Pro Rhetorician</h3>
              <div className="text-4xl font-extrabold text-white mb-1">$9.99</div>
              <p className="text-sm text-slate-500">Per Month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white text-sm">
                <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited Public Debates
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Basic AI Analysis (5/mo)
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <Check className="w-5 h-5 text-indigo-400 shrink-0" /> "Pro" Badge on Profile
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Priority Matchmaking
              </li>
            </ul>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/20">
              Upgrade to Pro
            </button>
          </div>

          {/* Elite Tier */}
          <div className="bg-slate-900/50 rounded-3xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2"><Crown className="w-5 h-5" /> Grandmaster</h3>
              <div className="text-4xl font-extrabold text-white mb-1">$29.99</div>
              <p className="text-sm text-slate-500">Per Month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Unlimited AI Analysis
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Create Private Tournaments
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <Check className="w-5 h-5 text-amber-500 shrink-0" /> Verified "Expert" Status
              </li>
            </ul>
            <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold transition-colors shadow-lg">
              Get Elite Access
            </button>
          </div>
        </div>

        <div className="mt-20 text-center bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Institutional Access?</h3>
          <p className="text-slate-400 mb-6">We offer bulk licenses for Universities, Debate Clubs, and High Schools.</p>
          <button className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors border-b border-indigo-400 pb-0.5 hover:border-indigo-300">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
