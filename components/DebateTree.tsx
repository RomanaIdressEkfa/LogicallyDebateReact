
import React, { useState } from 'react';
import { ArgumentNode } from '../types';
import { ThumbsUp, Share2, Reply, CheckCircle2, XCircle, MessageSquare, ChevronDown, ChevronRight, MinusCircle } from 'lucide-react';

interface DebateTreeProps {
  node: ArgumentNode;
  level?: number;
  onReply: (nodeId: string, type: 'REBUTTAL' | 'AGREEMENT' | 'DISAGREEMENT') => void;
}

const DebateTree: React.FC<DebateTreeProps> = ({ node, level = 0, onReply }) => {
  const [expanded, setExpanded] = useState(true);

  // Styling based on node type
  const getCardStyle = () => {
    switch (node.type) {
      case 'ARGUMENT':
        return node.role === 'PRO' 
          ? 'bg-blue-50 border-l-4 border-blue-500' 
          : 'bg-red-50 border-l-4 border-red-500';
      case 'REBUTTAL':
        return 'bg-amber-50 border-l-4 border-amber-500';
      case 'AGREEMENT':
        return 'bg-emerald-50 border-l-4 border-emerald-500';
      case 'DISAGREEMENT':
        return 'bg-orange-50 border-l-4 border-orange-500';
      default:
        return 'bg-white';
    }
  };

  const getRoleBadge = () => {
      if (node.role === 'PRO') return <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">Pro Side</span>;
      if (node.role === 'CON') return <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Con Side</span>;
      return <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">Judge</span>;
  }

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col relative items-center">
      {/* Connector Lines for Tree Structure (Vertical Line from Parent) */}
      {level > 0 && (
        <div className="absolute -top-8 left-1/2 -ml-[1px] w-0.5 h-8 bg-slate-300"></div>
      )}
      
      {/* Node Card Container */}
      <div className={`
        relative transition-all duration-300 transform z-10
        ${level === 0 ? 'w-full max-w-2xl' : 'w-72 md:w-80'}
      `}>
        {/* Connector dot */}
        {level > 0 && (
           <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
        )}

        <div className={`
            relative rounded-xl shadow-sm p-4 text-slate-800 transition-all hover:shadow-md border border-slate-100
            ${getCardStyle()}
        `}>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
             <div className="flex items-center gap-2">
                {/* Collapse Toggle */}
                {hasChildren && (
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="p-0.5 hover:bg-black/5 rounded transition-colors"
                        title={expanded ? "Collapse thread" : "Expand thread"}
                    >
                        {expanded ? <MinusCircle className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
                    </button>
                )}
                <span className="font-bold text-xs md:text-sm">{node.author}</span>
                {getRoleBadge()}
             </div>
             <span className="text-[10px] text-slate-400">
                {new Date(node.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </span>
          </div>

          {/* Content */}
          <div className="mb-4">
             {node.type !== 'ARGUMENT' && (
                 <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                     {node.type === 'REBUTTAL' && <span className="text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded">Rebuttal</span>}
                     {node.type === 'AGREEMENT' && <span className="text-emerald-700 bg-emerald-100/50 px-1.5 py-0.5 rounded">Agreed</span>}
                     {node.type === 'DISAGREEMENT' && <span className="text-orange-700 bg-orange-100/50 px-1.5 py-0.5 rounded">Disagreed</span>}
                 </div>
             )}
             <p className="text-sm leading-relaxed whitespace-pre-wrap">{node.content}</p>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-3 pt-3 border-t border-black/5">
             <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-3 h-3" /> {node.votes.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-600 transition-colors">
                        <Share2 className="w-3 h-3" /> Share
                    </button>
                </div>
                
                {/* Collapsed indicator */}
                {!expanded && hasChildren && (
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                        {node.children.length} replies hidden
                    </span>
                )}
             </div>

             {/* Action Buttons */}
             <div className="grid grid-cols-3 gap-2 mt-1">
                 <button 
                   onClick={() => onReply(node.id, 'AGREEMENT')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 rounded transition-colors"
                 >
                     <CheckCircle2 className="w-3 h-3" /> Agree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'DISAGREEMENT')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-orange-700 bg-orange-100/50 hover:bg-orange-100 rounded transition-colors"
                 >
                     <XCircle className="w-3 h-3" /> Disagree
                 </button>
                 <button 
                   onClick={() => onReply(node.id, 'REBUTTAL')}
                   className="flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                 >
                     <Reply className="w-3 h-3" /> Reply
                 </button>
             </div>
          </div>
        </div>
      </div>

      {/* Children Nodes (Recursive) */}
      {hasChildren && expanded && (
        <div className="relative flex justify-center pt-8 w-full">
           {/* Horizontal Bar connecting children */}
           {node.children.length > 1 && (
               <div className="absolute top-0 h-[2px] bg-slate-300"
                    style={{
                        left: '50%', // Start from center
                        width: 'calc(100% - 20rem)', // Rough adjustment based on child width
                        transform: 'translateX(-50%)'
                    }}
                ></div>
           )}
           
           {/* Flex container for children */}
           <div className="flex gap-4 md:gap-8 justify-center">
               {node.children.map((child, index) => (
                 <div key={child.id} className="relative flex flex-col items-center">
                    {/* Top vertical connector for each child */}
                    <div className="absolute -top-8 w-0.5 h-8 bg-slate-300"></div>
                    {/* Connection logic: The horizontal bar logic is complex in flexbox. 
                        A simpler CSS approach for trees often uses ::before/::after, 
                        but here we rely on the visual hierarchy. 
                    */}
                    <DebateTree 
                        node={child} 
                        level={level + 1} 
                        onReply={onReply}
                    />
                 </div>
               ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default DebateTree;
