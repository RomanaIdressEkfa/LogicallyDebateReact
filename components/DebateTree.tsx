
import React, { useState } from 'react';
import { ArgumentNode } from '../types';
import { ThumbsUp, Share2, Reply, CheckCircle2, XCircle, ChevronRight, MinusCircle } from 'lucide-react';

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

  // Styling based on node type
  const getCardStyle = () => {
    switch (node.type) {
      case 'ARGUMENT':
        return node.role === 'PRO' 
          ? 'bg-blue-50 border-l-4 border-blue-500 shadow-blue-900/5' 
          : 'bg-red-50 border-l-4 border-red-500 shadow-red-900/5';
      case 'REBUTTAL':
        return 'bg-amber-50 border-l-4 border-amber-500 shadow-amber-900/5';
      case 'AGREEMENT':
        return 'bg-emerald-50 border-l-4 border-emerald-500 shadow-emerald-900/5';
      case 'DISAGREEMENT':
        return 'bg-orange-50 border-l-4 border-orange-500 shadow-orange-900/5';
      default:
        return 'bg-white';
    }
  };

  const getRoleBadge = () => {
      if (node.role === 'PRO') return <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase border border-blue-200">Pro Side</span>;
      if (node.role === 'CON') return <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase border border-red-200">Con Side</span>;
      return <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase border border-slate-200">Judge</span>;
  }

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center relative">
      
      {/* PERFECT TREE CONNECTORS (CSS Geometry) */}
      {/* 1. Vertical line coming down from parent to this node */}
      {hasParent && (
        <div className="h-8 w-0.5 bg-slate-300"></div>
      )}

      {/* 2. Horizontal connectors for siblings */}
      {hasParent && !isRoot && (
         <div className="absolute -top-0 w-full flex justify-center h-8">
             {/* Left Line (if not first child) */}
             <div className={`w-1/2 h-[2px] bg-slate-300 ${isFirst ? 'opacity-0' : 'opacity-100'}`}></div>
             {/* Right Line (if not last child) */}
             <div className={`w-1/2 h-[2px] bg-slate-300 ${isLast ? 'opacity-0' : 'opacity-100'}`}></div>
         </div>
      )}

      {/* Node Card */}
      <div className={`relative z-10 transition-all duration-300 ${isRoot ? 'w-full max-w-2xl' : 'w-72 md:w-80'}`}>
        <div className={`
            relative rounded-xl shadow-sm p-4 text-slate-800 transition-all hover:shadow-lg border border-slate-200
            ${getCardStyle()}
        `}>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2">
                {/* Collapse Toggle */}
                {hasChildren && (
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors focus:outline-none"
                        title={expanded ? "Collapse thread" : "Expand thread"}
                    >
                        {expanded ? <MinusCircle className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-700 font-bold" />}
                    </button>
                )}
                <span className="font-bold text-xs md:text-sm">{node.author}</span>
                {getRoleBadge()}
             </div>
             <span className="text-[10px] text-slate-400 font-mono">
                {new Date(node.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </span>
          </div>

          {/* Content */}
          <div className="mb-4">
             {node.type !== 'ARGUMENT' && (
                 <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-90">
                     {node.type === 'REBUTTAL' && <span className="text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">Rebuttal</span>}
                     {node.type === 'AGREEMENT' && <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded">Agreed</span>}
                     {node.type === 'DISAGREEMENT' && <span className="text-orange-700 bg-orange-100 border border-orange-200 px-1.5 py-0.5 rounded">Disagreed</span>}
                 </div>
             )}
             <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-slate-700">{node.content}</p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-3 pt-3 border-t border-black/5">
             <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" /> <span className="font-bold">{node.votes.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                        <Share2 className="w-3 h-3" /> Share
                    </button>
                </div>
                
                {/* Collapsed indicator */}
                {!expanded && hasChildren && (
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></span>
                        {node.children.length} replies hidden
                    </span>
                )}
             </div>

             {/* Action Buttons */}
             <div className="grid grid-cols-3 gap-2 mt-1">
                 <button 
                   onClick={() => onReply(node.id, 'AGREEMENT')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 rounded-lg transition-colors shadow-sm"
                 >
                     <CheckCircle2 className="w-3 h-3" /> Agree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'DISAGREEMENT')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-lg transition-colors shadow-sm"
                 >
                     <XCircle className="w-3 h-3" /> Disagree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'REBUTTAL')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors shadow-sm"
                 >
                     <Reply className="w-3 h-3" /> Reply
                 </button>
             </div>
          </div>
        </div>
      </div>

      {/* Children Nodes (Recursive) */}
      {hasChildren && expanded && (
        <div className="flex items-start justify-center pt-0 w-full relative">
           <div className="flex gap-4 md:gap-8">
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
