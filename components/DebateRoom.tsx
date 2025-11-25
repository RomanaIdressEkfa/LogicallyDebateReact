
import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown, ShieldAlert, Gavel, Cpu, Mic, Video, LogOut, AlertOctagon, Plus, GitMerge } from 'lucide-react';
import { Debate, UserRole, Message, AnalysisResult, ArgumentNode } from '../types';
import { analyzeDebateRound } from '../services/geminiService';
import DebateTree from './DebateTree';

interface DebateRoomProps {
  debate: Debate;
  currentUserRole: UserRole;
  onLeave: () => void;
  onEndDebate: (debateId: string) => void;
}

const DebateRoom: React.FC<DebateRoomProps> = ({ debate, currentUserRole, onLeave, onEndDebate }) => {
  const [messages, setMessages] = useState<Message[]>(debate.messages); // Keep legacy linear chat for transcript if needed
  const [argumentTree, setArgumentTree] = useState<ArgumentNode[]>(debate.argumentTree);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyType, setReplyType] = useState<'ARGUMENT' | 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT'>('ARGUMENT');
  
  const [votes, setVotes] = useState(debate.votes);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);

  const handleTreeReply = (nodeId: string, type: 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT') => {
      setReplyingTo(nodeId);
      setReplyType(type);
      document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    let role: 'PRO' | 'CON' | 'JUDGE' = 'PRO'; // Default fallback
    if (currentUserRole === UserRole.PRO_DEBATER) role = 'PRO';
    else if (currentUserRole === UserRole.CON_DEBATER) role = 'CON';
    else if (currentUserRole === UserRole.JUDGE) role = 'JUDGE';
    else if (currentUserRole === UserRole.ADMIN) role = 'JUDGE';

    const senderName = currentUserRole === UserRole.ADMIN ? 'SYSTEM ADMIN' : 
                      role === 'PRO' ? debate.proUser : 
                      role === 'CON' ? debate.conUser : 'Judge';

    const newNode: ArgumentNode = {
        id: Date.now().toString(),
        author: senderName,
        role: role,
        content: inputText,
        type: replyingTo ? replyType : 'ARGUMENT', // If no reply, it's a new root argument
        timestamp: Date.now(),
        votes: { likes: 0, support: 0 },
        children: []
    };

    if (replyingTo) {
        // Function to recursively find the node and add child
        const addChildToNode = (nodes: ArgumentNode[], targetId: string): ArgumentNode[] => {
            return nodes.map(node => {
                if (node.id === targetId) {
                    return { ...node, children: [...node.children, newNode] };
                }
                if (node.children.length > 0) {
                    return { ...node, children: addChildToNode(node.children, targetId) };
                }
                return node;
            });
        };
        setArgumentTree(prev => addChildToNode(prev, replyingTo));
        setReplyingTo(null);
    } else {
        // Add as root argument
        setArgumentTree(prev => [...prev, newNode]);
    }

    setInputText('');
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Flatten tree content for analysis
    const flatContent: Message[] = [];
    const traverse = (nodes: ArgumentNode[]) => {
        nodes.forEach(n => {
            flatContent.push({ id: n.id, sender: n.author, role: n.role === 'JUDGE' ? 'JUDGE' : n.role, content: n.content, timestamp: n.timestamp });
            traverse(n.children);
        });
    };
    traverse(argumentTree);

    const result = await analyzeDebateRound(debate.topic, flatContent);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleVote = (side: 'pro' | 'con') => {
    setVotes(prev => ({
      ...prev,
      [side]: prev[side] + 1
    }));
  };

  const handleForceEnd = () => {
      if(confirm("Are you sure you want to force end this debate?")) {
          onEndDebate(debate.id);
      }
  }

  const canType = currentUserRole === UserRole.PRO_DEBATER || currentUserRole === UserRole.CON_DEBATER || currentUserRole === UserRole.JUDGE || currentUserRole === UserRole.ADMIN;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Header Info */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shrink-0 shadow-md z-20">
        <div className="flex items-center gap-4">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    LIVE ARENA: {debate.topic}
                </h2>
                <p className="text-slate-400 text-xs mt-1 font-mono">ID: {debate.id} | Viewer Count: {debate.viewers.toLocaleString()}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            {currentUserRole === UserRole.ADMIN && (
                <button 
                    onClick={handleForceEnd}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-500/50 text-red-400 rounded hover:bg-red-900/40 transition-colors text-sm font-medium"
                >
                    <AlertOctagon className="w-4 h-4" /> End Debate (Admin)
                </button>
            )}
            <button onClick={onLeave} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2 hover:bg-slate-800 rounded transition-colors">
                <LogOut className="w-4 h-4" /> Leave Arena
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Main Debate Tree Area */}
          <div className="flex-1 overflow-y-auto bg-slate-100 p-8 relative custom-scrollbar">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="max-w-[90rem] mx-auto space-y-16">
                  {argumentTree.length === 0 ? (
                      <div className="text-center text-slate-400 mt-20">
                          <GitMerge className="w-16 h-16 mx-auto mb-4 opacity-20" />
                          <p className="text-xl font-bold text-slate-500">No arguments placed yet.</p>
                          <p>The arena is open. Start the debate by posting the first argument.</p>
                      </div>
                  ) : (
                      argumentTree.map((rootNode) => (
                          <div key={rootNode.id} className="bg-white/50 p-8 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
                              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12 text-center border-b border-slate-200 pb-2">Argument Thread</div>
                              <DebateTree 
                                node={rootNode} 
                                onReply={handleTreeReply}
                              />
                          </div>
                      ))
                  )}
              </div>
              <div className="h-40"></div> {/* Spacer */}
          </div>

          {/* Right Sidebar: Stats & Controls */}
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 shadow-xl z-10">
              {/* Video Feeds */}
              <div className="grid grid-rows-2 h-64 gap-0.5 bg-black">
                 <div className="relative group overflow-hidden">
                     <img src={debate.imageUrl} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                     <div className="absolute bottom-2 left-3">
                         <div className="text-blue-400 text-xs font-bold">PRO SIDE</div>
                         <div className="text-white font-bold text-sm truncate">{debate.proUser}</div>
                     </div>
                 </div>
                 <div className="relative group overflow-hidden">
                     <img src={`https://picsum.photos/seed/${debate.id}con/400/300`} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                     <div className="absolute bottom-2 right-3 text-right">
                         <div className="text-red-400 text-xs font-bold">CON SIDE</div>
                         <div className="text-white font-bold text-sm truncate">{debate.conUser}</div>
                     </div>
                 </div>
              </div>

              {/* Voting */}
              <div className="p-6 border-b border-slate-800">
                  <div className="flex justify-between text-white font-bold text-xl mb-2">
                      <span className="text-blue-400">{votes.pro}</span>
                      <span className="text-red-400">{votes.con}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex mb-4">
                      <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(votes.pro / (votes.pro + votes.con || 1)) * 100}%` }}></div>
                      <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${(votes.con / (votes.pro + votes.con || 1)) * 100}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleVote('pro')} className="bg-slate-800 hover:bg-blue-900/30 text-blue-400 py-2 rounded text-sm font-bold transition-colors border border-transparent hover:border-blue-800">Support Pro</button>
                      <button onClick={() => handleVote('con')} className="bg-slate-800 hover:bg-red-900/30 text-red-400 py-2 rounded text-sm font-bold transition-colors border border-transparent hover:border-red-800">Support Con</button>
                  </div>
              </div>

              {/* Input Area */}
              <div id="input-area" className="flex-1 p-4 flex flex-col bg-slate-900">
                  {canType ? (
                      <div className="flex-1 flex flex-col">
                          {replyingTo ? (
                              <div className="bg-slate-800 p-2 rounded text-xs text-slate-300 mb-2 flex flex-col gap-2 border-l-2 border-indigo-500">
                                  <div className="flex justify-between items-center">
                                      <span className="font-bold text-indigo-400">Replying to argument...</span>
                                      <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white">Cancel</button>
                                  </div>
                                  <div className="flex gap-1">
                                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                          replyType === 'AGREEMENT' ? 'bg-emerald-900 text-emerald-400' :
                                          replyType === 'DISAGREEMENT' ? 'bg-orange-900 text-orange-400' :
                                          'bg-slate-700 text-slate-300'
                                      }`}>
                                          TYPE: {replyType}
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-xs text-slate-500 mb-2 text-center uppercase font-bold tracking-wider">New Root Argument</div>
                          )}

                          {replyingTo && (
                              <div className="flex gap-1 mb-2">
                                  <button onClick={() => setReplyType('REBUTTAL')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${replyType === 'REBUTTAL' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Rebut</button>
                                  <button onClick={() => setReplyType('AGREEMENT')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${replyType === 'AGREEMENT' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Agree</button>
                                  <button onClick={() => setReplyType('DISAGREEMENT')} className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${replyType === 'DISAGREEMENT' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Disagree</button>
                              </div>
                          )}
                          
                          <textarea 
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                             className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none flex-1 mb-3"
                             placeholder="Construct your argument..."
                          />
                          <button 
                             onClick={handleSendMessage}
                             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                              <Send className="w-4 h-4" /> Post Argument
                          </button>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-4 border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
                          <ShieldAlert className="w-8 h-8 mb-2" />
                          <p className="text-sm">Audience Mode</p>
                          <p className="text-xs mt-1">Listen and vote.</p>
                      </div>
                  )}

                  {/* AI Tools */}
                  {(currentUserRole === UserRole.JUDGE || currentUserRole === UserRole.ADMIN) && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                           <button 
                           onClick={handleAiAnalysis}
                           disabled={isAnalyzing}
                           className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-lg"
                         >
                           {isAnalyzing ? <Cpu className="w-3 h-3 animate-spin" /> : <Gavel className="w-3 h-3" />}
                           RUN AI JUDGEMENT
                         </button>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default DebateRoom;
