
import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, ThumbsDown, ShieldAlert, Gavel, Cpu, Mic, Video, LogOut, AlertOctagon, Plus, GitMerge, Reply, Users } from 'lucide-react';
import { Debate, UserRole, Message, AnalysisResult, ArgumentNode, Toast } from '../types';
import { analyzeDebateRound } from '../services/geminiService';
import DebateTree from './DebateTree';

interface DebateRoomProps {
  debate: Debate;
  currentUserRole: UserRole;
  onLeave: () => void;
  onEndDebate: (debateId: string) => void;
  addToast: (type: Toast['type'], message: string) => void;
}

const DebateRoom: React.FC<DebateRoomProps> = ({ debate, currentUserRole, onLeave, onEndDebate, addToast }) => {
  const [messages, setMessages] = useState<Message[]>(debate.messages);
  const [argumentTree, setArgumentTree] = useState<ArgumentNode[]>(debate.argumentTree);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyType, setReplyType] = useState<'ARGUMENT' | 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT'>('ARGUMENT');
  
  const [votes, setVotes] = useState(debate.votes);
  const [viewers, setViewers] = useState(debate.viewers);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (debate.status !== 'LIVE') return;
    
    const interval = setInterval(() => {
        setViewers(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.max(0, prev + change);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [debate.status]);

  const handleTreeReply = (nodeId: string, type: 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT') => {
      setReplyingTo(nodeId);
      setReplyType(type);
      document.getElementById('input-area')?.scrollIntoView({ behavior: 'smooth' });
      addToast('INFO', `Replying with ${type}`);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    let role: 'PRO' | 'CON' | 'JUDGE' = 'PRO';
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
        type: replyingTo ? replyType : 'ARGUMENT',
        timestamp: Date.now(),
        votes: { likes: 0, support: 0 },
        children: []
    };

    if (replyingTo) {
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
        setArgumentTree(prev => [...prev, newNode]);
    }

    setInputText('');
    addToast('SUCCESS', 'Argument Posted to Chain');
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    addToast('INFO', 'Running Gemini AI Analysis...');
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
    addToast('SUCCESS', 'AI Analysis Complete');
  };

  const handleVote = (side: 'pro' | 'con') => {
    setVotes(prev => ({
      ...prev,
      [side]: prev[side] + 1
    }));
    addToast('SUCCESS', `Vote Registered for ${side.toUpperCase()}`);
  };

  const handleForceEnd = () => {
      if(confirm("Are you sure you want to force end this debate?")) {
          onEndDebate(debate.id);
      }
  }

  const canType = currentUserRole === UserRole.PRO_DEBATER || currentUserRole === UserRole.CON_DEBATER || currentUserRole === UserRole.JUDGE || currentUserRole === UserRole.ADMIN;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 w-full">
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 shadow-md z-20 gap-4 md:gap-0">
        <div className="flex items-center gap-4">
            <div>
                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-3">
                    {debate.status === 'LIVE' && (
                        <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                    <span className="line-clamp-1">{debate.topic}</span>
                </h2>
                <div className="flex items-center gap-4 mt-1">
                    <span className="text-slate-400 text-xs font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">ID: {debate.id}</span>
                    <span className="text-primary-400 text-xs font-bold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> AI Moderation Active</span>
                    <span className="text-red-400 text-xs font-bold flex items-center gap-1"><Users className="w-3 h-3"/> {viewers.toLocaleString()} Watching</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {currentUserRole === UserRole.ADMIN && (
                <button 
                    onClick={handleForceEnd}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <AlertOctagon className="w-4 h-4" /> End Debate (Admin)
                </button>
            )}
            <button onClick={onLeave} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                <LogOut className="w-4 h-4" /> Leave Arena
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
          <div className="flex-1 overflow-y-auto bg-slate-100 relative custom-scrollbar order-2 md:order-1">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ 
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
                   }}>
              </div>
              
              <div className="w-full px-4 md:px-12 py-12 space-y-16 min-h-full">
                  {argumentTree.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 mt-20">
                          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                             <GitMerge className="w-12 h-12 text-slate-400" />
                          </div>
                          <p className="text-2xl font-black text-slate-600 mb-2">The Floor is Open</p>
                          <p className="max-w-md text-center text-slate-500">No arguments have been made yet. Pro debater usually starts the opening statement.</p>
                      </div>
                  ) : (
                      argumentTree.map((rootNode) => (
                          <div key={rootNode.id} className="w-full">
                              <div className="flex justify-center mb-8">
                                  <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] border border-slate-300">New Argument Chain</span>
                              </div>
                              <DebateTree 
                                node={rootNode} 
                                onReply={handleTreeReply}
                              />
                          </div>
                      ))
                  )}
              </div>
              <div className="h-40"></div>
          </div>

          <div className="w-full md:w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 shadow-2xl z-30 order-1 md:order-2">
              <div className="grid grid-cols-2 md:grid-rows-2 md:grid-cols-1 h-40 md:h-72 gap-1 bg-black p-1">
                 <div className="relative group overflow-hidden rounded md:rounded-t-lg bg-slate-900">
                     <img src={debate.imageUrl} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                     <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">PRO</div>
                     <div className="absolute bottom-3 left-3">
                         <div className="text-white font-bold text-xs md:text-base truncate shadow-black drop-shadow-md">{debate.proUser}</div>
                         <div className="flex items-center gap-1 text-green-400 text-[10px] md:text-xs"><Mic className="w-3 h-3" /> Speaking</div>
                     </div>
                 </div>
                 <div className="relative group overflow-hidden rounded md:rounded-b-lg bg-slate-900">
                     <img src={`https://picsum.photos/seed/${debate.id}con/400/300`} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                     <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">CON</div>
                     <div className="absolute bottom-3 right-3 text-right">
                         <div className="text-white font-bold text-xs md:text-base truncate shadow-black drop-shadow-md">{debate.conUser}</div>
                         <div className="flex items-center justify-end gap-1 text-slate-500 text-[10px] md:text-xs"><Mic className="w-3 h-3" /> Muted</div>
                     </div>
                 </div>
              </div>

              <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900">
                  <div className="flex justify-between items-end mb-3">
                      <div className="text-left">
                          <span className="block text-xs text-blue-400 font-bold uppercase tracking-wider">Pro Support</span>
                          <span className="text-xl md:text-2xl font-black text-white">{votes.pro}</span>
                      </div>
                      <div className="text-right">
                          <span className="block text-xs text-red-400 font-bold uppercase tracking-wider">Con Support</span>
                          <span className="text-xl md:text-2xl font-black text-white">{votes.con}</span>
                      </div>
                  </div>
                  
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex mb-6 relative border border-slate-700">
                      <div className="absolute inset-0 flex items-center justify-center z-10 text-[10px] font-bold text-white/50 mix-blend-overlay">AUDIENCE SENTIMENT</div>
                      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-700 ease-out relative" style={{ width: `${(votes.pro / (votes.pro + votes.con || 1)) * 100}%` }}>
                          <div className="absolute right-0 top-0 bottom-0 w-px bg-white/30"></div>
                      </div>
                      <div className="bg-gradient-to-l from-red-600 to-red-400 h-full transition-all duration-700 ease-out" style={{ width: `${(votes.con / (votes.pro + votes.con || 1)) * 100}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleVote('pro')} className="bg-blue-900/20 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-blue-900/50 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
                          <ThumbsUp className="w-4 h-4" /> Vote Pro
                      </button>
                      <button onClick={() => handleVote('con')} className="bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-900/50 hover:border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2">
                          <ThumbsUp className="w-4 h-4" /> Vote Con
                      </button>
                  </div>
              </div>

              <div id="input-area" className="flex-1 p-4 flex flex-col bg-slate-950">
                  {canType ? (
                      <div className="flex-1 flex flex-col">
                          {replyingTo ? (
                              <div className="bg-primary-900/20 p-3 rounded-xl border border-primary-500/30 mb-3 animate-in fade-in slide-in-from-bottom-2">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-primary-400 text-xs flex items-center gap-1"><Reply className="w-3 h-3"/> Replying to Thread</span>
                                      <button onClick={() => setReplyingTo(null)} className="text-slate-500 hover:text-white text-xs">Cancel</button>
                                  </div>
                                  <div className="flex gap-1">
                                      <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                                          replyType === 'AGREEMENT' ? 'bg-emerald-500 text-slate-900' :
                                          replyType === 'DISAGREEMENT' ? 'bg-orange-500 text-slate-900' :
                                          'bg-amber-500 text-slate-900'
                                      }`}>
                                          {replyType}
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-xs text-slate-600 mb-3 text-center uppercase font-black tracking-[0.2em]">New Root Argument</div>
                          )}

                          {replyingTo && (
                              <div className="flex gap-2 mb-3">
                                  <button onClick={() => setReplyType('REBUTTAL')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors border ${replyType === 'REBUTTAL' ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}>Rebut</button>
                                  <button onClick={() => setReplyType('AGREEMENT')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors border ${replyType === 'AGREEMENT' ? 'bg-emerald-500 text-slate-900 border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}>Agree</button>
                                  <button onClick={() => setReplyType('DISAGREEMENT')} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors border ${replyType === 'DISAGREEMENT' ? 'bg-orange-500 text-slate-900 border-orange-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}>Disagree</button>
                              </div>
                          )}
                          
                          <textarea 
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                             className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none flex-1 mb-3 placeholder:text-slate-600 transition-all"
                             placeholder="Construct your argument here..."
                          />
                          <button 
                             onClick={handleSendMessage}
                             className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary-900/20"
                          >
                              <Send className="w-4 h-4" /> Post Argument
                          </button>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                             <ShieldAlert className="w-6 h-6 text-slate-600" />
                          </div>
                          <p className="text-white font-bold">Spectator Mode</p>
                          <p className="text-xs mt-1 max-w-[200px]">You are viewing as an audience member. Login as a debater to participate.</p>
                      </div>
                  )}

                  {(currentUserRole === UserRole.JUDGE || currentUserRole === UserRole.ADMIN) && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                           <button 
                           onClick={handleAiAnalysis}
                           disabled={isAnalyzing}
                           className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-orange-900/20 border border-orange-500/20"
                         >
                           {isAnalyzing ? <Cpu className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                           RUN AI JUDGEMENT PROTOCOL
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
