import React from 'react';
import { ColorSwatch } from '../types';
import { getColorScale, getContrastColor } from '../lib/colorUtils';

interface ScaleViewProps {
  palette: ColorSwatch[];
}

const ScaleView: React.FC<ScaleViewProps> = ({ palette }) => {
  return (
    <div className="flex flex-col h-full w-full relative z-0 overflow-y-auto bg-[#fafafa]">
      <div className="sticky top-0 z-10 p-[clamp(1rem,4vw,2rem)] pb-4 border-b border-white/60 bg-white/70 backdrop-blur-2xl flex-shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
         <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-800 tracking-tight">Color Scales</h1>
         <p className="text-slate-500 mt-1 md:mt-2 font-medium font-sans text-sm md:text-base">Comprehensive 50-950 scales for your current palette.</p>
      </div>

      <div className="flex-1 p-[clamp(1rem,4vw,2rem)] overflow-y-auto w-full max-w-7xl mx-auto space-y-12 pb-24">
         {palette.map((swatch, idx) => {
            const scale = getColorScale(swatch.hex);
            if (!scale.length) return null;
            return (
                <div key={swatch.id} className="space-y-4">
                   <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: swatch.hex }} />
                       <h2 className="text-xl font-bold font-mono uppercase text-gray-800">{swatch.hex}</h2>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                       {scale.map((s) => (
                           <div key={s.stop} className="flex md:flex-col items-stretch md:items-center">
                               <div 
                                    className="h-16 w-16 md:w-full md:h-24 flex items-center justify-center transition-transform hover:scale-110 z-10 origin-center relative cursor-pointer group shrink-0"
                                    style={{ backgroundColor: s.hex }}
                                    title={`Copy ${s.hex}`}
                                    onClick={() => navigator.clipboard.writeText(s.hex)}
                               >
                                  <div className="opacity-0 group-hover:opacity-100 font-mono text-xs font-bold transition-opacity shadow-sm rounded px-2 py-1 bg-black/10 backdrop-blur-md" style={{ color: getContrastColor(s.hex) }}>
                                     {s.hex.toUpperCase()}
                                  </div>
                               </div>
                               <div className="flex-1 md:flex-none flex items-center md:justify-center p-3 md:py-3 bg-white border-t md:border-t-0 md:border-l border-slate-100 text-xs font-semibold text-slate-500 text-center w-full min-w-0">
                                   {s.stop}
                               </div>
                           </div>
                       ))}
                   </div>
                </div>
            )
         })}
      </div>
    </div>
  );
};

export default ScaleView;
