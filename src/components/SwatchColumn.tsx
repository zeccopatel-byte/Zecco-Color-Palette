import React, { useState, useEffect } from 'react';
import { ColorSwatch } from '../types';
import { getContrastColor } from '../lib/colorUtils';
import { Lock, Unlock, Copy, Check, X, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import chroma from 'chroma-js';

interface SwatchColumnProps {
  swatch: ColorSwatch;
  index: number;
  onToggleLock: () => void;
  onHexChange: (hex: string) => void;
  onAddColor: () => void;
  onRemoveColor: () => void;
  canRemove: boolean;
  canAdd: boolean;
}

const SwatchColumn: React.FC<SwatchColumnProps> = ({ 
  swatch, index, onToggleLock, onHexChange, onAddColor, onRemoveColor, canRemove, canAdd 
}) => {
  const [copied, setCopied] = useState(false);
  const [localHex, setLocalHex] = useState(swatch.hex);
  
  const textColor = getContrastColor(swatch.hex);

  useEffect(() => {
    setLocalHex(swatch.hex);
  }, [swatch.hex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(swatch.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalHex(val);
    if (chroma.valid(val)) {
        onHexChange(val);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, backgroundColor: swatch.hex }}
      animate={{ opacity: 1, scale: 1, backgroundColor: swatch.hex }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-1 flex flex-col items-center justify-end md:justify-center relative group min-h-[80px] md:min-h-0"
      style={{ color: textColor }}
    >
      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
         <div className="flex-1 flex flex-row md:flex-col items-center justify-end md:justify-center pr-4 md:pr-0 gap-4 md:gap-6 pb-0 pointer-events-auto w-full h-full">
             <button
                 onClick={handleCopy}
                className="p-2 md:p-4 rounded-full md:bg-white/20 md:backdrop-blur-xl md:border md:border-white/40 md:shadow-lg hover:scale-110 active:scale-95 transition-all tooltip-trigger opacity-60 hover:opacity-100"
                title="Copy Hex"
             >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
             </button>

             {canRemove && (
               <button
                   onClick={onRemoveColor}
                  className="p-2 md:p-4 rounded-full md:bg-white/20 md:backdrop-blur-xl md:border md:border-white/40 md:shadow-lg hover:text-red-400 hover:scale-110 active:scale-95 transition-all tooltip-trigger opacity-60 hover:opacity-100"
                  title="Remove color"
               >
                  <X className="w-5 h-5" />
               </button>
             )}
             
             <button
                 onClick={onToggleLock}
                className="p-2 md:p-4 rounded-full md:bg-white/20 md:backdrop-blur-xl md:border md:border-white/40 md:shadow-lg hover:scale-110 active:scale-95 transition-all tooltip-trigger opacity-60 hover:opacity-100"
                title={swatch.locked ? "Unlock color" : "Lock color"}
             >
                {swatch.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
             </button>
         </div>
      </div>

      {/* Add Button on Right Edge */}
      {canAdd && (
        <button
            onClick={onAddColor}
           className="hidden md:flex absolute z-20 left-1/2 md:left-auto md:right-0 bottom-0 md:top-1/2 translate-y-1/2 md:-translate-y-1/2 -translate-x-1/2 md:translate-x-1/2 p-2 md:p-3 rounded-full bg-white shadow-xl text-slate-800 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all !cursor-pointer hover:bg-indigo-50"
           title="Add color"
        >
           <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}

      {/* Info bottom */}
      <div className="absolute bottom-0 left-4 md:left-0 w-full md:p-6 flex flex-col items-start md:items-center justify-center md:justify-end h-full md:h-auto pointer-events-none pb-0 md:pb-8">
          <input 
            type="text" 
            value={localHex.toUpperCase()} 
            onChange={handleHexInput}
            className="bg-transparent border-none text-left md:text-center font-mono font-bold text-lg md:text-2xl w-32 md:w-full outline-none uppercase pointer-events-auto"
            style={{ color: textColor }}
          />
          <div className="text-[10px] md:text-sm font-medium opacity-80 mt-0 md:mt-1 uppercase tracking-widest hidden md:block text-center relative group/name cursor-help pointer-events-auto">
              {swatch.name || (chroma.valid(swatch.hex) ? chroma(swatch.hex).name() : 'Unknown')}
              {swatch.reason && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-md shadow-lg p-3 opacity-0 group-hover/name:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal">
                      <strong className="block mb-1 text-indigo-300">{swatch.name}</strong>
                      {swatch.reason}
                  </div>
              )}
          </div>
      </div>
    </motion.div>
  );
};

export default SwatchColumn;
