
import React from 'react';
import { BookOpen, ShieldAlert, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Rules: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 w-full">
      <div className="w-full space-y-12">
        
        <div className="text-center">
           <h1 className="text-4xl font-extrabold text-white mb-4">Platform Rules & Guidelines</h1>
           <p className="text-slate-400 text-lg max-w-2xl mx-auto">
             LogicallyDebate is a sanctuary for intellectual discourse. To maintain quality, all participants must adhere to our strict code of conduct.
           </p>
        </div>

        {/* Section 1: The Core */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                 <Scale className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">The 3 Pillars of Debate</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                 <h3 className="font-bold text-white mb-2">1. Logic Over Emotion</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   Arguments must be grounded in reason. Emotional appeals (pathos) are permitted only if supported by strong logos (logic).
                 </p>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                 <h3 className="font-bold text-white mb-2">2. Burden of Proof</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   The person making a claim bears the burden of proof. You cannot ask your opponent to disprove a baseless assertion.
                 </p>
              </div>
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                 <h3 className="font-bold text-white mb-2">3. Charity</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   Interpret your opponent's argument in its strongest possible form (Steel Man) before refuting it. Do not attack Straw Men.
                 </p>
              </div>
           </div>
        </div>

        {/* Section 2: Prohibited Conduct */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-500" /> Prohibited Conduct
           </h2>
           <div className="space-y-4">
              <div className="flex gap-4 items-start bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                 <AlertTriangle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                 <div>
                    <h4 className="font-bold text-red-200">Ad Hominem Attacks</h4>
                    <p className="text-sm text-red-200/70">Attacking the person rather than the argument will result in an immediate deduction of points and potential ban.</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                 <AlertTriangle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                 <div>
                    <h4 className="font-bold text-red-200">Gish Gallop</h4>
                    <p className="text-sm text-red-200/70">Overwhelming an opponent with excessive, weak arguments to prevent them from responding to all points is forbidden.</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                 <AlertTriangle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                 <div>
                    <h4 className="font-bold text-red-200">Hate Speech</h4>
                    <p className="text-sm text-red-200/70">Zero tolerance policy for racism, sexism, or any form of discrimination.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Section 3: AI Scoring */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">How AI Scoring Works</h2>
            <div className="prose prose-invert max-w-none text-slate-400">
               <p className="mb-4">
                  Our Gemini-powered AI judge analyzes every round based on a weighted matrix:
               </p>
               <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Logical Consistency (40%)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Evidence Quality (30%)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Rebuttal Effectiveness (20%)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Rhetorical Clarity (10%)</li>
               </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Rules;
