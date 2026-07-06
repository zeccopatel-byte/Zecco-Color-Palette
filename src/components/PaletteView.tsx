import React, { useState, useRef, useEffect } from 'react';
import { ColorSwatch, HarmonyMode } from '../types';
import SwatchColumn from './SwatchColumn';
import VisualizePanel from './VisualizePanel';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Sparkles, Loader2, Search, ChevronDown, Save, Check, Wand2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PaletteViewProps {
  palette: ColorSwatch[];
  isVisualizeOpen: boolean;
  setIsVisualizeOpen: (isOpen: boolean) => void;
  onToggleLock: (id: string) => void;
  onHexChange: (id: string, newHex: string) => void;
  onGenerate: () => void;
  onGenerateAIPalette: (prompt: string) => Promise<void>;
  harmonyMode: HarmonyMode;
  onHarmonyChange: (mode: HarmonyMode) => void;
  onAddColor: (index: number) => void;
  onRemoveColor: (id: string) => void;
}

const PaletteView: React.FC<PaletteViewProps> = ({ 
  palette,
  isVisualizeOpen,
  setIsVisualizeOpen,
  onToggleLock, 
  onHexChange, 
  onGenerate,
  onGenerateAIPalette,
  harmonyMode,
  onHarmonyChange,
  onAddColor,
  onRemoveColor
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      await onGenerateAIPalette(aiPrompt);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSavePalette = async () => {
    if (!user) {
      alert("Please login to save palettes");
      return;
    }
    
    setIsSaving(true);
    try {
      const paletteData = {
        userId: user.uid,
        colors: palette.map(p => p.hex),
        createdAt: Date.now()
      };
      
      await addDoc(collection(db, 'palettes'), paletteData);
      alert("Palette saved successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'palettes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Toolbar - Matches Reference UI */}
      <div className="h-auto min-h-[80px] md:h-[100px] py-4 px-4 md:py-0 md:px-0 md:pr-8 border-b border-[#e8eaef]/50 bg-transparent flex flex-wrap md:flex-nowrap items-center justify-between shrink-0 z-20 relative gap-3 md:gap-8">
        <form onSubmit={handleAiSubmit} className="flex-1 w-full md:w-auto max-w-2xl relative flex items-center group border border-transparent order-1 md:order-none">
           <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-[var(--color-accent)] transition-colors">
             <Search className="w-[18px] h-[18px]" />
           </div>
           
           <input
             type="text"
             value={aiPrompt}
             onChange={(e) => setAiPrompt(e.target.value)}
             placeholder="Find something... (e.g. 'Ocean neon')"
             className="w-full bg-white shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-transparent focus:border-[var(--color-accent)] rounded-[8px] py-3 md:py-3.5 pl-12 pr-12 text-[13px] md:text-[14px] focus:outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
             disabled={isAiLoading}
           />
           
           <button 
             type="submit" 
             disabled={isAiLoading || !aiPrompt.trim()}
             className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[var(--color-accent)] hover:bg-slate-50 rounded-[8px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             title="Generate AI Palette"
           >
             {isAiLoading ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Sparkles className="w-[18px] h-[18px]" />}
           </button>
        </form>
        
        <div className="flex items-center gap-2 md:gap-4 ml-auto order-2 md:order-none">
           <div className="relative hidden xl:block" ref={dropdownRef}>
             <button
               type="button"
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="bg-white border border-transparent text-slate-700 text-[14px] font-bold rounded-[8px] py-3.5 pl-5 pr-10 focus:outline-none shadow-[0_2px_15px_rgba(0,0,0,0.02)] appearance-none cursor-pointer hover:bg-slate-50 transition-colors w-[clamp(10rem,15vw,12rem)] min-w-[44px] min-h-[44px] text-left capitalize"
             >
               {harmonyMode}
             </button>
             <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
               <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
             </div>
             
             <AnimatePresence>
               {isDropdownOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   transition={{ duration: 0.15 }}
                   className="absolute top-full left-0 mt-2 w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 overflow-hidden"
                 >
                   {(['random', 'monochromatic', 'analogous', 'complementary', 'triadic'] as HarmonyMode[]).map((mode) => (
                     <button
                       key={mode} type="button"
                       onClick={() => {
                         onHarmonyChange(mode);
                         setIsDropdownOpen(false);
                       }}
                       className="w-full text-left px-4 py-2.5 text-[14px] font-semibold flex items-center justify-between hover:bg-slate-50 hover:text-[var(--color-accent)] transition-colors capitalize"
                     >
                       <span className={harmonyMode === mode ? "text-[var(--color-accent)]" : "text-slate-700"}>{mode}</span>
                       {harmonyMode === mode && <Check className="w-4 h-4 text-[var(--color-accent)]" />}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
           
           <button 
             onClick={() => setIsVisualizeOpen(true)}
             className="flex items-center justify-center gap-2 bg-transparent border-2 border-slate-200 text-slate-700 min-w-[44px] min-h-[44px] md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-[8px] font-semibold transition-all hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap active:scale-95"
             title="Imagine Style"
           >
             <Wand2 className="w-[18px] h-[18px]" />
             <span className="hidden md:block text-[14px]">Imagine Style</span>
           </button>

           <button 
             onClick={onGenerate}
             className="flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white min-w-[44px] min-h-[44px] md:w-auto md:h-auto md:px-6 md:py-3.5 rounded-[8px] font-semibold transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] whitespace-nowrap active:scale-95 hover:brightness-110"
             title="Generate Colors"
           >
             <Shuffle className="w-[18px] h-[18px]" />
             <span className="hidden md:block text-[14px]">Generate</span>
           </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex overflow-hidden relative bg-gray-50 flex-col md:flex-row">
         <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
           <AnimatePresence>
              {palette.map((swatch, index) => (
                <SwatchColumn 
                  key={swatch.id}
                  swatch={swatch}
                  index={index}
                  onToggleLock={() => onToggleLock(swatch.id)}
                  onHexChange={(newHex) => onHexChange(swatch.id, newHex)}
                  onAddColor={() => onAddColor(index)}
                  onRemoveColor={() => onRemoveColor(swatch.id)}
                  canRemove={palette.length > 2}
                  canAdd={palette.length < 10}
                />
              ))}
           </AnimatePresence>
         </div>

         <AnimatePresence>
           {isVisualizeOpen && (
             <motion.div
               initial={{ x: '100%', opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: '100%', opacity: 0 }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="h-full bg-white border-t md:border-t-0 md:border-l border-slate-200 shadow-2xl z-40 flex flex-col overflow-hidden shrink-0 absolute md:relative right-0 top-0 bottom-0 w-full md:w-[clamp(20rem,40vw,35rem)]"
             >
                <VisualizePanel palette={palette} onClose={() => setIsVisualizeOpen(false)} />
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
};

export default PaletteView;
