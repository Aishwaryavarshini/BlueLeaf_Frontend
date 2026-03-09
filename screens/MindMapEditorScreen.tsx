
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Pencil, 
  Mic, 
  Plus, 
  Minus,
  Trash2, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  Save,
  Check,
  Sparkles,
  HelpCircle,
  Layout,
  Info,
  Beaker,
  Lightbulb,
  Zap,
  Target,
  X,
  MoreVertical
} from 'lucide-react';
import { UserPreferences } from '../App';
import { aiService } from '../services/aiService';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'core' | 'branch' | 'leaf' | 'formula' | 'example' | 'tip';
  level?: number;
  groupId?: number;
  details?: string;
  collapsed?: boolean;
}

interface Link {
  from: string;
  to: string;
}

interface MindMapEditorScreenProps {
  preferences: UserPreferences;
  unitName: string;
  onBack: () => void;
}

const MICRO_LESSONS = [
  "Whole Lesson",
  "Introduction to Algebra",
  "Algebraic Expressions",
  "Simplification of Algebraic Expressions",
  "Polynomials",
  "Degree of a Polynomial",
  "Addition and Subtraction of Polynomials",
  "Multiplication of Polynomials",
  "Algebraic Identities",
  "Factorisation",
  "Simple Algebraic Word Problems",
  "Revision & Board-Oriented Problems"
];

const BRANCH_COLORS = [
  '#FF6B6B', // Red
  '#4D96FF', // Blue
  '#6BCB77', // Green
  '#FFD93D', // Yellow
  '#9B59B6', // Purple
  '#FF9F43', // Orange
  '#1DD1A1', // Teal
];

const SECONDARY_COLORS = [
  '#FFB2B2',
  '#A6C9FF',
  '#B5E6BB',
  '#FFF0B3',
  '#D7BDE2',
  '#FFD1A3',
  '#A2EEE0',
];

const BRANCH_BORDERS = [
  '#EE5253',
  '#2E86DE',
  '#10AC84',
  '#F1C40F',
  '#8E44AD',
  '#F39C12',
  '#10AC84',
];

const DEMO_NODES: Node[] = [
  { id: 'root', label: 'Algebraic Expressions', x: 0, y: 0, type: 'core', level: 0 },
  { id: 'v', label: 'Variables', x: 0, y: 0, type: 'branch', level: 1 },
  { id: 'c', label: 'Constants', x: 0, y: 0, type: 'branch', level: 1 },
  { id: 'o', label: 'Operators', x: 0, y: 0, type: 'branch', level: 1 },
  { id: 't', label: 'Terms', x: 0, y: 0, type: 'branch', level: 1 },
  { id: 'vx', label: 'x', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'vy', label: 'y', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'vz', label: 'z', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'op', label: '+', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'om', label: '-', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'ot', label: '×', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'od', label: '÷', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'ts', label: 'Single Term', x: 0, y: 0, type: 'leaf', level: 2 },
  { id: 'tm', label: 'Multiple Terms', x: 0, y: 0, type: 'leaf', level: 2 },
];

const DEMO_LINKS: Link[] = [
  { from: 'root', to: 'v' },
  { from: 'root', to: 'c' },
  { from: 'root', to: 'o' },
  { from: 'root', to: 't' },
  { from: 'v', to: 'vx' },
  { from: 'v', to: 'vy' },
  { from: 'v', to: 'vz' },
  { from: 'o', to: 'op' },
  { from: 'o', to: 'om' },
  { from: 'o', to: 'ot' },
  { from: 'o', to: 'od' },
  { from: 't', to: 'ts' },
  { from: 't', to: 'tm' },
];

const MindMapEditorScreen: React.FC<MindMapEditorScreenProps> = ({ preferences, unitName, onBack }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("Whole Lesson");
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [detailLevel, setDetailLevel] = useState(2); // 1: Overview, 2: Standard, 3: Detailed
  const [activeNodeMenu, setActiveNodeMenu] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: '', details: '' });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Initial Load & Selector Change
  useEffect(() => {
    const savedData = localStorage.getItem(`mindmap_${unitName}_${selectedLesson}`);
    if (savedData) {
      const { nodes: savedNodes, links: savedLinks } = JSON.parse(savedData);
      setNodes(savedNodes);
      setLinks(savedLinks);
    } else {
      if (selectedLesson === "Algebraic Expressions" || selectedLesson === "Whole Lesson") {
        const positioned = layoutNodes(DEMO_NODES, DEMO_LINKS);
        setNodes(positioned);
        setLinks(DEMO_LINKS);
      } else {
        generateInitialMap();
      }
    }
  }, [selectedLesson, unitName]);

  useEffect(() => {
    const handleResize = () => {
      reorganizeMap();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateInitialMap = async () => {
    setIsProcessing(true);
    try {
      const data = await aiService.generateMindMap(
        selectedLesson === "Whole Lesson" ? unitName : `${unitName}: ${selectedLesson}`, 
        preferences
      );
      
      const positionedNodes = layoutNodes(data.nodes, data.links);
      setNodes(positionedNodes);
      setLinks(data.links);
    } catch (error) {
      console.error("Failed to generate mind map:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const layoutNodes = (inputNodes: Node[], currentLinks: Link[]) => {
    const centerX = 0;
    const centerY = 0;
    
    const positionedNodes = inputNodes.map(n => ({ 
      ...n, 
      x: 0,
      y: 0
    }));
    
    const root = positionedNodes.find(n => n.type === 'core');
    if (root) {
      root.x = centerX;
      root.y = centerY;
      root.level = 0;
    }
    
    const mainBranches = currentLinks
      .filter(l => l.from === root?.id)
      .map(l => positionedNodes.find(n => n.id === l.to))
      .filter(Boolean) as Node[];
      
    const radiusPrimary = 260;
    const angleStep = (2 * Math.PI) / (mainBranches.length || 1);

    mainBranches.forEach((node, i) => {
      const angle = i * angleStep - Math.PI / 2;
      node.x = centerX + radiusPrimary * Math.cos(angle);
      node.y = centerY + radiusPrimary * Math.sin(angle);
      node.level = 1;
      node.groupId = i % BRANCH_COLORS.length;
      
      const subBranches = currentLinks
        .filter(l => l.from === node.id)
        .map(l => positionedNodes.find(n => n.id === l.to))
        .filter(Boolean) as Node[];
        
      const subRadius = 140;
      const subSpread = Math.PI / 2.5;

      subBranches.forEach((subNode, j) => {
        const startAngle = angle - subSpread / 2;
        const step = subBranches.length > 1 ? subSpread / (subBranches.length - 1) : 0;
        const subAngle = subBranches.length > 1 ? startAngle + j * step : angle;
        
        subNode.x = node.x + subRadius * Math.cos(subAngle);
        subNode.y = node.y + subRadius * Math.sin(subAngle);
        subNode.level = 2;
        subNode.groupId = node.groupId;
      });
    });

    return positionedNodes;
  };

  const reorganizeMap = () => {
    setNodes(prev => layoutNodes(prev, links));
  };

  const handleAISubmit = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    try {
      const currentData = { nodes, links };
      const updatedData = await aiService.modifyMindMap(currentData, prompt, preferences);
      
      const positionedNodes = layoutNodes(updatedData.nodes, updatedData.links);
      setNodes(positionedNodes);
      setLinks(updatedData.links);
      setPrompt('');
    } catch (error) {
      console.error("Failed to modify mind map:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const expandNode = async (nodeId: string, type: 'explain' | 'example' | 'formula' | 'simplify' | 'not_clear') => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setIsProcessing(true);
    setActiveNodeMenu(null);
    try {
      const { newNodes, newLinks } = await aiService.expandNode(node, type, preferences);
      
      // Position new nodes around the parent
      const positionedNewNodes = newNodes.map((newNode: any, index: number) => {
        const angle = (index / newNodes.length) * 2 * Math.PI;
        const radius = 150;
        return {
          ...newNode,
          x: node.x + radius * Math.cos(angle),
          y: node.y + radius * Math.sin(angle)
        };
      });

      setNodes(prev => [...prev, ...positionedNewNodes]);
      setLinks(prev => [...prev, ...newLinks]);
    } catch (error) {
      console.error("Failed to expand node:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveState = () => {
    localStorage.setItem(`mindmap_${unitName}_${selectedLesson}`, JSON.stringify({ nodes, links }));
    // Store preferred structure (memory)
    localStorage.setItem(`mindmap_pref_${unitName}`, JSON.stringify({ detailLevel }));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  // Canvas Interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggingNodeId) return;
    setIsDraggingCanvas(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setActiveNodeMenu(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 3));
  };

  // Manual Edit Actions
  const addNode = () => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      label: "New Concept",
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      type: 'branch',
      level: 1
    };
    setNodes([...nodes, newNode]);
    if (selectedNodeId) {
      setLinks([...links, { from: selectedNodeId, to: id }]);
    }
  };

  const addSubNode = (parentId: string) => {
    const id = `node_${Date.now()}`;
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;
    
    const newNode: Node = {
      id,
      label: "New Detail",
      x: parent.x + (Math.random() - 0.5) * 100,
      y: parent.y + (Math.random() - 0.5) * 100,
      type: 'leaf',
      level: (parent.level || 1) + 1
    };
    setNodes([...nodes, newNode]);
    setLinks([...links, { from: parentId, to: id }]);
    setSelectedNodeId(id);
    setActiveNodeMenu(null);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setLinks(links.filter(l => l.from !== id && l.to !== id));
    setSelectedNodeId(null);
  };

  const renameNode = (id: string, newLabel: string, newDetails?: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, label: newLabel, details: newDetails } : n));
  };

  const startEditing = (node: Node) => {
    setEditingNodeId(node.id);
    setEditForm({ label: node.label, details: node.details || '' });
    setActiveNodeMenu(null);
  };

  const saveEdit = () => {
    if (editingNodeId) {
      renameNode(editingNodeId, editForm.label, editForm.details);
      setEditingNodeId(null);
    }
  };

  const getNodeClasses = (node: Node) => {
    const isSelected = selectedNodeId === node.id;
    const baseClasses = "group relative transition-all cursor-pointer flex items-center justify-center text-center overflow-hidden";
    const shadowClasses = isSelected ? "ring-4 ring-blue-100 shadow-xl scale-105" : "shadow-md hover:shadow-lg";
    
    if (node.type === 'core') {
      return `${baseClasses} ${shadowClasses} rounded-full bg-[#1c2b4a] text-white w-[180px] h-[180px] font-bold text-xl uppercase tracking-tight p-4`;
    }
    
    if (node.level === 1) {
      return `${baseClasses} ${shadowClasses} rounded-full w-[130px] h-[130px] font-bold text-sm p-3 text-white`;
    }
    
    return `${baseClasses} ${shadowClasses} rounded-full w-[90px] h-[90px] font-semibold text-[10px] p-2 bg-white border-2`;
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden font-sans" style={{ background: '#FFF9F5' }}>
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#1c2b4a]">Mind Map</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={reorganizeMap}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Reorganize Map"
          >
            <Layout size={20} />
          </button>
          <button 
            onClick={saveState}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all text-xs font-bold"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button 
            onClick={() => setIsManualEdit(!isManualEdit)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-xs font-bold ${
              isManualEdit 
                ? 'bg-gradient-to-r from-[#3f6fff] to-[#5a82ff] text-white shadow-lg shadow-blue-200' 
                : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Pencil size={16} />
            <span>{isManualEdit ? 'Manual Mode' : 'AI Mode'}</span>
          </button>
        </div>
      </nav>

      {/* Controls Bar */}
      <div className="bg-white px-6 py-3 border-b border-slate-50 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Lesson</span>
          <div className="relative group">
            <select 
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="appearance-none bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-[#3c4f7a] outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              {MICRO_LESSONS.map(lesson => (
                <option key={lesson} value={lesson}>{lesson}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Detail Level</span>
            <div className="flex items-center space-x-3">
              <span className={`text-[10px] font-bold ${detailLevel === 1 ? 'text-blue-600' : 'text-slate-400'}`}>Overview</span>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={detailLevel}
                onChange={(e) => setDetailLevel(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className={`text-[10px] font-bold ${detailLevel === 3 ? 'text-blue-600' : 'text-slate-400'}`}>Detailed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mind Map Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ background: '#f8fafc' }}
      >
        {/* Background Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5"/>
              </pattern>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#94a3b8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Mind Map Content */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: isDraggingCanvas ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Branches (SVG) */}
          <svg 
            className="absolute inset-0 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none"
            viewBox="-1000 -1000 2000 2000"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="#4b5563" />
              </marker>
            </defs>
            {links.map((link, i) => {
              const from = nodes.find(n => n.id === link.from);
              const to = nodes.find(n => n.id === link.to);
              if (!from || !to) return null;
              
            return (
              <motion.line
                key={`link-${link.from}-${link.to}-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#4b5563"
                strokeWidth="3"
                strokeLinecap="round"
                markerEnd="url(#arrow)"
              />
            );
          })}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <motion.div
              key={node.id}
              layoutId={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                left: isNaN(node.x) ? 0 : node.x,
                top: isNaN(node.y) ? 0 : node.y,
                transform: 'translate(-50%, -50%)',
                zIndex: selectedNodeId === node.id ? 100 : 10
              }}
              className="absolute pointer-events-auto"
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  if (editingNodeId !== node.id) {
                    setActiveNodeMenu(node.id);
                  }
                }}
                className={getNodeClasses(node)}
                style={{
                  backgroundColor: node.type === 'core' 
                    ? undefined 
                    : (node.groupId !== undefined 
                        ? (node.level === 1 ? BRANCH_COLORS[node.groupId] : SECONDARY_COLORS[node.groupId]) 
                        : 'white'),
                  borderColor: node.type === 'core' ? undefined : (node.groupId !== undefined ? BRANCH_BORDERS[node.groupId] : '#cbd5e1'),
                  borderWidth: node.type === 'core' ? '0px' : '2px',
                  zIndex: selectedNodeId === node.id ? 100 : 10
                }}
              >
                <div className="flex flex-col items-center p-2">
                  <span className="font-bold leading-tight">
                    {node.label}
                  </span>
                  {node.details && (
                    <span className="text-[8px] opacity-80 mt-1 max-w-[80%] text-center line-clamp-2">
                      {node.details}
                    </span>
                  )}
                </div>

                {/* Confusion Detector Icon */}
                {!isManualEdit && node.type !== 'core' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      expandNode(node.id, 'not_clear');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-200 shadow-sm transition-all"
                    title="Not clear?"
                  >
                    <HelpCircle size={14} />
                  </button>
                )}

                {/* Node Option Panel */}
                <AnimatePresence>
                  {activeNodeMenu === node.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 flex flex-col min-w-[160px] z-[200]"
                    >
                      <button 
                        onClick={() => expandNode(node.id, 'explain')}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-700"
                      >
                        <Plus size={14} className="text-blue-500" />
                        <span>Expand</span>
                      </button>
                      <button 
                        onClick={() => setNodes(nodes.map(n => n.id === node.id ? { ...n, collapsed: !n.collapsed } : n))}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-700"
                      >
                        <Minimize2 size={14} className="text-slate-400" />
                        <span>Collapse</span>
                      </button>
                      <button 
                        onClick={() => startEditing(node)}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-700"
                      >
                        <Pencil size={14} className="text-amber-500" />
                        <span>Edit content</span>
                      </button>
                      <button 
                        onClick={() => addSubNode(node.id)}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-700"
                      >
                        <Plus size={14} className="text-emerald-500" />
                        <span>Add sub-node</span>
                      </button>
                      <div className="h-[1px] bg-slate-100 my-1" />
                      <button 
                        onClick={() => { deleteNode(node.id); setActiveNodeMenu(null); }}
                        className="flex items-center space-x-3 px-3 py-2 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold text-red-600"
                      >
                        <Trash2 size={14} />
                        <span>Delete node</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Manual Edit Controls */}
                <AnimatePresence>
                  {isManualEdit && selectedNodeId === node.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-xl"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); addNode(); }}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <div className="w-[1px] h-3 bg-white/20" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingNodeId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
              onClick={() => setEditingNodeId(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Edit Node Content</h3>
                  <button onClick={() => setEditingNodeId(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Title</label>
                    <input 
                      autoFocus
                      value={editForm.label}
                      onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1c2b4a] outline-none focus:border-blue-500 transition-all"
                      placeholder="Enter title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description (Optional)</label>
                    <textarea 
                      value={editForm.details}
                      onChange={(e) => setEditForm(prev => ({ ...prev, details: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-[#3c4f7a] outline-none focus:border-blue-500 transition-all min-h-[100px] resize-none"
                      placeholder="Enter description..."
                    />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 flex items-center justify-end space-x-3">
                  <button 
                    onClick={() => setEditingNodeId(null)}
                    className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEdit}
                    className="px-8 py-2.5 bg-[#3f6fff] text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-[#2f5bd3] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Controls */}
        <div className="absolute bottom-24 right-6 flex flex-col space-y-2">
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
            className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
            title="Zoom In"
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
            title="Zoom Out"
          >
            <Minus size={18} />
          </button>
          <button 
            onClick={() => { setOffset({ x: 0, y: 0 }); setZoom(1); }}
            className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
            title="Center Map"
          >
            <Target size={18} />
          </button>
        </div>
      </div>

      {/* Chat Prompt Area (Bottom) */}
      <div className="p-6 bg-white border-t border-slate-100 z-50">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -top-10 left-0 flex space-x-2">
            {['simplify this map', 'add examples', 'show formulas'].map(suggestion => (
              <button 
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              placeholder="Ask Blue to modify this mind map..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-24 text-sm font-medium text-[#3c4f7a] outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
              <Sparkles size={20} className={isProcessing ? 'animate-pulse' : ''} />
            </div>
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleAISubmit}
                disabled={isProcessing || !prompt.trim()}
                className={`p-2 rounded-xl transition-all ${
                  isProcessing || !prompt.trim() 
                    ? 'bg-slate-100 text-slate-300' 
                    : 'bg-gradient-to-r from-[#3f6fff] to-[#5a82ff] text-white shadow-lg shadow-blue-200'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 z-[100]"
          >
            <Check size={18} className="text-emerald-400" />
            <span className="text-sm font-bold">Mind map saved successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindMapEditorScreen;
