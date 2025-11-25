
import React, { useState } from 'react';
import { Debate } from '../types';
import { PenTool, Image, AlignLeft, Globe, Lock, ArrowRight } from 'lucide-react';

interface CreateDebateProps {
  onCreate: (newDebate: Debate) => void;
  onCancel: () => void;
}

const CreateDebate: React.FC<CreateDebateProps> = ({ onCreate, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Politics',
    description: '',
    type: 'Public'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDebate: Debate = {
      id: Date.now().toString(),
      topic: formData.topic,
      category: formData.category,
      description: formData.description,
      status: 'UPCOMING',
      proUser: 'You', // In a real app, this would be the logged in user
      conUser: 'Waiting...',
      viewers: 0,
      votes: { pro: 0, con: 0 },
      messages: [],
      argumentTree: [],
      imageUrl: `https://source.unsplash.com/random/800x600/?${formData.category.toLowerCase()},debate`
    };
    onCreate(newDebate);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center p-6 w-full">
      <div className="max-w-3xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-in-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
               <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Debate</h1>
              <p className="text-slate-400 text-sm">Challenge the world to a battle of logic.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Debate Topic</label>
                  <input 
                    type="text" 
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
                    placeholder="e.g., Artificial Intelligence will replace doctors..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Politics', 'Technology', 'Philosophy', 'Science', 'Economics', 'Culture'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`py-3 rounded-lg text-sm font-medium transition-all ${formData.category === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white font-medium">Cancel</button>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    disabled={!formData.topic}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    placeholder="Provide context, definitions, and rules for this debate..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Privacy Settings</label>
                  <div className="flex gap-4">
                     <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'Public'})}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.type === 'Public' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                     >
                        <div className="bg-slate-800 p-2 rounded-lg"><Globe className="w-5 h-5 text-indigo-400" /></div>
                        <div className="text-left">
                           <div className="text-white font-bold text-sm">Public Debate</div>
                           <div className="text-slate-500 text-xs">Anyone can watch</div>
                        </div>
                     </button>
                     <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'Private'})}
                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.type === 'Private' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                     >
                        <div className="bg-slate-800 p-2 rounded-lg"><Lock className="w-5 h-5 text-amber-400" /></div>
                        <div className="text-left">
                           <div className="text-white font-bold text-sm">Invite Only</div>
                           <div className="text-slate-500 text-xs">Private room</div>
                        </div>
                     </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-white font-medium">Back</button>
                  <button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                  >
                    Launch Debate
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDebate;
