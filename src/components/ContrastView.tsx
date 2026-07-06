import React from 'react';
import { ColorSwatch } from '../types';
import { getContrastRatio } from '../lib/colorUtils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ContrastViewProps {
  palette: ColorSwatch[];
}

const ContrastView: React.FC<ContrastViewProps> = ({ palette }) => {
  return (
    <div className="flex flex-col h-full w-full relative z-0 overflow-y-auto bg-[#fafafa]">
      <div className="sticky top-0 z-10 p-[clamp(1rem,4vw,2rem)] pb-4 border-b border-white/60 bg-white/70 backdrop-blur-2xl flex-shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
         <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-800 tracking-tight">Contrast Matrix</h1>
         <p className="text-slate-500 mt-1 md:mt-2 font-medium font-sans text-sm md:text-base">Check visual contrast ratio (WCAG AA/AAA) between your palette colors.</p>
      </div>

      <div className="flex-1 p-[clamp(1rem,4vw,2rem)] overflow-y-auto w-full max-w-7xl mx-auto pb-24">
          <div className="overflow-x-auto rounded-3xl border border-white bg-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
             <table className="w-full text-left border-collapse min-w-[40rem]">
                <thead>
                    <tr>
                        <th className="p-4 bg-white/40 border-b border-r border-white/60"></th>
                        {palette.map(col => (
                            <th key={col.id} className="p-4 bg-white/40 border-b border-white/60 font-mono text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ring-2 ring-white/50" style={{ backgroundColor: col.hex }}></div>
                                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-widest">{col.hex}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                     {palette.map(rowCol => (
                         <tr key={`row-${rowCol.id}`}>
                             <th className="p-4 bg-white/40 border-b border-r border-white/60 font-mono text-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ring-2 ring-white/50" style={{ backgroundColor: rowCol.hex }}></div>
                                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-widest">{rowCol.hex}</span>
                                </div>
                             </th>
                             {palette.map(col => {
                                 const ratio = getContrastRatio(rowCol.hex, col.hex);
                                 const isSelf = rowCol.id === col.id;
                                 const aaPass = ratio >= 4.5;
                                 const aaaPass = ratio >= 7;
                                 
                                 return (
                                     <td key={`cell-${rowCol.id}-${col.id}`} className="p-4 border-b border-white/60 text-center relative bg-white/20">
                                        {isSelf ? (
                                            <span className="text-slate-300 font-medium">-</span>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div 
                                                    className="w-full py-5 px-2 rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm border border-black/5"
                                                    style={{ backgroundColor: rowCol.hex, color: col.hex }}
                                                >
                                                    Aa
                                                </div>
                                                <div className="flex flex-col items-center mt-1">
                                                    <span className="text-lg font-bold text-slate-800">{ratio.toFixed(2)}</span>
                                                    <div className="flex gap-2 mt-1.5">
                                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${aaPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {aaPass ? <CheckCircle2 className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>} AA
                                                        </span>
                                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${aaaPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {aaaPass ? <CheckCircle2 className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>} AAA
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                     </td>
                                 );
                             })}
                         </tr>
                     ))}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};

export default ContrastView;
