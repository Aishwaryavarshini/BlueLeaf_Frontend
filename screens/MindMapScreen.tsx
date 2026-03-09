
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Settings2, 
  Mic, 
  Send, 
  ChevronDown, 
  Plus, 
  Minus, 
  Maximize2,
  Edit2
} from 'lucide-react';
import { UserPreferences } from '../App';
import { aiService } from '../services/aiService';

interface Node {
  id: string;
  label: string;
  type: 'core' | 'branch' | 'leaf';
  details?: string;
  side?: 'left' | 'right';
  parentId?: string;
}

interface Link {
  from: string;
  to: string;
}

interface MindMapScreenProps {
  preferences: UserPreferences;
  unitName: string;
  onBack: () => void;
  onUpdatePrefs: (p: any) => void;
}

const MindMapScreen: React.FC<MindMapScreenProps> = ({ preferences, unitName, onBack, onUpdatePrefs }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState('Whole Lesson');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    generateMindMap(`Generate a comprehensive mind map for ${unitName}`);
  }, [unitName]);

  const generateMindMap = async (command: string) => {
    setIsProcessing(true);
    try {
      const data = await aiService.generateMindMap(command, preferences);
      // Process nodes to assign sides
      const coreNode = data.nodes.find((n: any) => n.type === 'core') || data.nodes[0];
      const otherNodes = data.nodes.filter((n: any) => n.id !== coreNode.id);
      
      // Simple heuristic: split branches into left and right
      const processedNodes = data.nodes.map((node: any) => {
        if (node.id === coreNode.id) return { ...node, type: 'core' as const };
        
        // Find if it's a direct child of core
        const isDirectChild = data.links.some((l: any) => l.from === coreNode.id && l.to === node.id);
        
        return { 
          ...node, 
          type: isDirectChild ? 'branch' as const : 'leaf' as const,
          parentId: data.links.find((l: any) => l.to === node.id)?.from
        };
      });

      // Assign sides to branches
      const branches = processedNodes.filter((n: any) => n.type === 'branch');
      branches.forEach((branch: any, index: number) => {
        branch.side = index % 2 === 0 ? 'left' : 'right';
      });

      // Assign sides to leaves based on their parent branch
      processedNodes.forEach((node: any) => {
        if (node.type === 'leaf') {
          const parent = processedNodes.find((p: any) => p.id === node.parentId);
          if (parent) node.side = parent.side;
        }
      });

      setNodes(processedNodes);
      setLinks(data.links);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  // Layout constants
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 60;
  const VERTICAL_SPACING = 100;
  const HORIZONTAL_SPACING = 300;
  const SUB_NODE_OFFSET = 120;

  // Calculate positions
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number, y: number }> = {};
    const coreNode = nodes.find(n => n.type === 'core');
    if (!coreNode) return positions;

    // Center
    positions[coreNode.id] = { x: 0, y: 0 };

    const leftBranches = nodes.filter(n => n.type === 'branch' && n.side === 'left');
    const rightBranches = nodes.filter(n => n.type === 'branch' && n.side === 'right');

    const calculateColumn = (branches: Node[], side: 'left' | 'right') => {
      const totalHeight = (branches.length - 1) * VERTICAL_SPACING;
      const startY = -totalHeight / 2;
      const x = side === 'left' ? -HORIZONTAL_SPACING : HORIZONTAL_SPACING;

      branches.forEach((branch, i) => {
        const y = startY + i * VERTICAL_SPACING;
        positions[branch.id] = { x, y };

        // Position leaves for this branch
        const leaves = nodes.filter(n => n.type === 'leaf' && n.parentId === branch.id);
        const leafX = side === 'left' ? x - SUB_NODE_OFFSET : x + SUB_NODE_OFFSET;
        const leafTotalHeight = (leaves.length - 1) * 40;
        const leafStartY = y - leafTotalHeight / 2;

        leaves.forEach((leaf, j) => {
          positions[leaf.id] = { x: leafX, y: leafStartY + j * 40 };
        });
      });
    };

    calculateColumn(leftBranches, 'left');
    calculateColumn(rightBranches, 'right');

    return positions;
  }, [nodes]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 2));
  };

  const handleNodeClick = (node: Node) => {
    setEditingNodeId(node.id);
    setEditValue(node.label);
  };

  const saveNodeEdit = () => {
    if (editingNodeId) {
      setNodes(prev => prev.map(n => n.id === editingNodeId ? { ...n, label: editValue } : n));
      setEditingNodeId(null);
    }
  };

  const colors = [
    'bg-blue-500', 
    'bg-emerald-500', 
    'bg-orange-500', 
    'bg-rose-500', 
    'bg-amber-500', 
    'bg-slate-500'
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden relative font-sans">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Mind Map</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{unitName}</p>
          </div>
        </div>

        {/* Lesson Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-all">
            <span>{selectedLesson}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {['Whole Lesson', 'Micro Lesson 1', 'Micro Lesson 2'].map(lesson => (
              <button 
                key={lesson}
                onClick={() => setSelectedLesson(lesson)}
                className="w-full text-left px-4 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 first:rounded-t-xl last:rounded-b-xl transition-colors"
              >
                {lesson}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
            <Save size={14} />
            <span>Save</span>
          </button>
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setIsManualMode(!isManualMode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${!isManualMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              AI
            </button>
            <button 
              onClick={() => setIsManualMode(!isManualMode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${isManualMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              Manual
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <main 
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="absolute top-1/2 left-1/2 transition-transform duration-75 ease-out pointer-events-none"
          style={{ 
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          }}
        >
          <div className="relative w-[1px] h-[1px]">
            {/* Connectors Layer */}
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
              {links.map((link, i) => {
                const fromPos = nodePositions[link.from];
                const toPos = nodePositions[link.to];
                if (!fromPos || !toPos) return null;

                // Smooth curve path
                const dx = toPos.x - fromPos.x;
                const midX = fromPos.x + dx / 2;
                
                const path = `M ${fromPos.x} ${fromPos.y} C ${midX} ${fromPos.y}, ${midX} ${toPos.y}, ${toPos.x} ${toPos.y}`;

                return (
                  <path 
                    key={i} 
                    d={path} 
                    fill="none" 
                    stroke="#444" 
                    strokeWidth="2" 
                    strokeOpacity="0.2"
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Nodes Layer */}
            <div className="relative pointer-events-auto">
              {nodes.map((node, i) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isCore = node.type === 'core';
                const isBranch = node.type === 'branch';
                const isLeaf = node.type === 'leaf';

                const bgColor = isCore 
                  ? 'bg-white border-4 border-blue-600' 
                  : colors[i % colors.length];

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      left: pos.x, 
                      top: pos.y, 
                      transform: 'translate(-50%, -50%)',
                      position: 'absolute'
                    }}
                    className={`
                      flex items-center justify-center text-center transition-all cursor-pointer
                      ${isCore ? 'w-56 h-24 rounded-2xl shadow-2xl z-20' : ''}
                      ${isBranch ? 'px-6 py-3 rounded-full shadow-lg z-10 min-w-[140px]' : ''}
                      ${isLeaf ? 'px-4 py-2 rounded-full shadow-md z-0 min-w-[100px]' : ''}
                      ${bgColor}
                      ${editingNodeId === node.id ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(node);
                    }}
                  >
                    {editingNodeId === node.id ? (
                      <input 
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveNodeEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveNodeEdit()}
                        className="bg-transparent text-center outline-none w-full font-bold text-white"
                      />
                    ) : (
                      <span className={`
                        font-bold uppercase tracking-wide
                        ${isCore ? 'text-blue-600 text-sm' : 'text-white text-[10px]'}
                        ${isLeaf ? 'text-[8px]' : ''}
                      `}>
                        {node.label}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-32 right-6 flex flex-col space-y-2 z-40">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Minus size={20} />
          </button>
          <button 
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-lg text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </main>

      {/* AI Edit Bar */}
      <div className="p-6 bg-white border-t border-slate-100 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Blue AI</span>
          </div>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateMindMap(prompt)}
            placeholder="Ask Blue to modify this mind map..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-24 pr-24 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Mic size={20} />
            </button>
            <button 
              onClick={() => generateMindMap(prompt)}
              disabled={isProcessing || !prompt.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20 active:scale-90 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapScreen;
