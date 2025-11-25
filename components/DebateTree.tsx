
import React, { useState } from 'react';
import { ArgumentNode } from '../types';
import { ThumbsUp, Share2, Reply, CheckCircle2, XCircle, ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';

interface DebateTreeProps {
  node: ArgumentNode;
  onReply: (nodeId: string, type: 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT') => void;
  // Props for recursive positioning
  isRoot?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  hasParent?: boolean;
}

const DebateTree: React.FC<DebateTreeProps> = ({ 
    node, 
    onReply, 
    isRoot = true,
    isFirst = true,
    isLast = true,
    hasParent = false
}) => {
  const [expanded, setExpanded] = useState(true);

  // Advanced Card Styling
  const getCardStyle = () => {
    switch (node.type) {
      case 'ARGUMENT':
        return node.role === 'PRO' 
          ? 'bg-gradient-to-br from-white to-blue-50 border-l-4 border-blue-600 shadow-xl shadow-blue-900/5' 
          : 'bg-gradient-to-br from-white to-red-50 border-l-4 border-red-600 shadow-xl shadow-red-900/5';
      case 'REBUTTAL':
        return 'bg-gradient-to-br from-white to-amber-50 border-l-4 border-amber-500 shadow-xl shadow-amber-900/5';
      case 'AGREEMENT':
        return 'bg-gradient-to-br from-white to-emerald-50 border-l-4 border-emerald-500 shadow-xl shadow-emerald-900/5';
      case 'DISAGREEMENT':
        return 'bg-gradient-to-br from-white to-orange-50 border-l-4 border-orange-500 shadow-xl shadow-orange-900/5';
      default:
        return 'bg-white';
    }
  };

  const getRoleBadge = () => {
      if (node.role === 'PRO') return <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">PRO</span>;
      if (node.role === 'CON') return <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">CON</span>;
      return <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">JUDGE</span>;
  }

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center relative">
      
      {/* --- PERFECT TREE CONNECTORS --- */}
      
      {/* Vertical Stem from Parent */}
      {hasParent && (
        <div className="h-10 w-0.5 bg-slate-300"></div>
      )}

      {/* Horizontal Connector Bar (Only if multiple siblings and not root) */}
      {hasParent && !isRoot && (
         <div className="absolute -top-0 w-full flex justify-center h-10 pointer-events-none">
             {/* Left Arm: Draw line from left edge to center if this is NOT the first child */}
             <div className={`w-1/2 border-t-2 border-slate-300 rounded-tr-xl absolute top-0 left-0 h-full ${isFirst ? 'opacity-0' : 'opacity-100'}`} style={{ transform: 'translateX(-1px)' }}></div>
             {/* Right Arm: Draw line from center to right edge if this is NOT the last child */}
             <div className={`w-1/2 border-t-2 border-slate-300 rounded-tl-xl absolute top-0 right-0 h-full ${isLast ? 'opacity-0' : 'opacity-100'}`} style={{ transform: 'translateX(1px)' }}></div>
             {/* Note: The 'rounded' corners give it a smoother orthogonal look */}
         </div>
      )}

      {/* NODE CARD WRAPPER */}
      <div className={`relative z-10 transition-all duration-300 group ${isRoot ? 'w-full max-w-3xl' : 'w-80 md:w-96'}`}>
        
        {/* Card Itself */}
        <div className={`
            relative rounded-2xl p-5 text-slate-800 transition-all hover:-translate-y-1 hover:shadow-2xl border border-slate-200/60 backdrop-blur-sm
            ${getCardStyle()}
        `}>
          {/* Collapse/Expand Handle (Floating on Edge if children exist) */}
          {hasChildren && (
            <button 
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 rounded-full flex items-center justify-center border transition-all shadow-md ${expanded ? 'bg-white border-slate-300 text-slate-500 hover:bg-slate-100' : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500'}`}
                title={expanded ? "Collapse thread" : "Expand thread"}
            >
                {expanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-3 pb-3 border-b border-black/5">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300 shadow-inner">
                    {node.author.charAt(0)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 leading-none">{node.author}</span>
                        {getRoleBadge()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {new Date(node.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="mb-4">
             {node.type !== 'ARGUMENT' && (
                 <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/50 border border-black/5">
                     {node.type === 'REBUTTAL' && <><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Rebuttal</>}
                     {node.type === 'AGREEMENT' && <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Agreed</>}
                     {node.type === 'DISAGREEMENT' && <><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Disagreed</>}
                 </div>
             )}
             <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium text-slate-700 font-sans">
                {node.content}
             </p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 px-2 py-1 rounded-md border border-slate-100 hover:border-blue-200">
                        <ThumbsUp className="w-3 h-3" /> {node.votes.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 px-2 py-1 rounded-md border border-slate-100 hover:border-indigo-200">
                        <Share2 className="w-3 h-3" />
                    </button>
                </div>
                
                {!expanded && hasChildren && (
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                        {node.children.length} replies hidden
                    </span>
                )}
             </div>

             {/* Action Buttons (Only show if expanded or leaf) */}
             <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-slate-200">
                 <button 
                   onClick={() => onReply(node.id, 'AGREEMENT')}
                   className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-wide text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all shadow-sm hover:shadow"
                 >
                     <CheckCircle2 className="w-3 h-3" /> Agree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'DISAGREEMENT')}
                   className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-wide text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-all shadow-sm hover:shadow"
                 >
                     <XCircle className="w-3 h-3" /> Disagree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'REBUTTAL')}
                   className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-wide text-slate-600 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg transition-all shadow-sm hover:shadow"
                 >
                     <Reply className="w-3 h-3" /> Rebut
                 </button>
             </div>
          </div>
        </div>
      </div>

      {/* Vertical Stem to Children */}
      {hasChildren && expanded && (
          <div className="h-8 w-0.5 bg-slate-300"></div>
      )}

      {/* Children Nodes (Recursive) */}
      {hasChildren && expanded && (
        <div className="flex items-start justify-center w-full relative">
           {/* IMPORTANT: The container gap determines tree spread */}
           <div className="flex gap-4 md:gap-8 pt-2">
               {node.children.map((child, index) => (
                 <DebateTree 
                    key={child.id}
                    node={child} 
                    onReply={onReply}
                    isRoot={false}
                    hasParent={true}
                    isFirst={index === 0}
                    isLast={index === node.children.length - 1}
                 />
               ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default DebateTree;
