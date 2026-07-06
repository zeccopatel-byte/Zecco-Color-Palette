import React, { useState } from 'react';
import { ColorSwatch } from '../types';
import { Copy, Check, Download } from 'lucide-react';
import chroma from 'chroma-js';
import { getColorScale } from '../lib/colorUtils';

interface ExportViewProps {
  palette: ColorSwatch[];
}

const ExportView: React.FC<ExportViewProps> = ({ palette }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const cssVars = `:root {\n${palette.map((p, i) => `  --color-${i + 1}: ${p.hex};`).join('\n')}\n}`;
  
  const tailwindConfig = `theme: {\n  extend: {\n    colors: {\n      brand: {\n${palette.map((p, i) => `        ${(i + 1) * 100}: '${p.hex}',`).join('\n')}\n      }\n    }\n  }\n}`;
  
  let multiScaleTailwind = `theme: {\n  extend: {\n    colors: {\n`;
  palette.forEach((p, i) => {
      const scale = getColorScale(p.hex);
      if(scale.length) {
          multiScaleTailwind += `      'brand-${i+1}': {\n`;
          scale.forEach(s => {
              multiScaleTailwind += `        ${s.stop}: '${s.hex}',\n`;
          });
          multiScaleTailwind += `      },\n`;
      }
  });
  multiScaleTailwind += `    }\n  }\n}`;

  const hexArray = `const palette = [${palette.map(p => `'${p.hex}'`).join(', ')}];`;

  const handleDownloadImage = (format: 'png' | 'jpeg') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padding = 80;
    const swatchWidth = (canvas.width - padding * 2) / palette.length;
    const swatchHeight = 500;

    // Draw swatches
    palette.forEach((swatch, i) => {
      ctx.fillStyle = swatch.hex;
      ctx.fillRect(padding + i * swatchWidth, padding, swatchWidth, swatchHeight);
      
      // Text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(swatch.hex.toUpperCase(), padding + i * swatchWidth + swatchWidth / 2, padding + swatchHeight + 80);
    });

    const link = document.createElement('a');
    link.download = `palette.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="flex flex-col h-full w-full relative z-0 overflow-y-auto bg-[#fafafa]">
      <div className="sticky top-0 z-10 p-[clamp(1rem,4vw,2rem)] pb-4 border-b border-white/60 bg-white/70 backdrop-blur-2xl flex-shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
         <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-800 tracking-tight">Export Palette</h1>
         <p className="text-slate-500 mt-1 md:mt-2 font-medium font-sans text-sm md:text-base">Export your colors to design tools or code.</p>
      </div>

      <div className="flex-1 p-[clamp(1rem,4vw,2rem)] overflow-y-auto w-full max-w-7xl mx-auto pb-24">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-[clamp(1rem,4vw,2rem)]">
              
              <ExportCard 
                title="CSS Variables" 
                code={cssVars} 
                isCopied={copiedType === 'css'} 
                onCopy={() => handleCopy(cssVars, 'css')} 
              />
              
              <ExportCard 
                title="JavaScript Array" 
                code={hexArray} 
                isCopied={copiedType === 'js'} 
                onCopy={() => handleCopy(hexArray, 'js')} 
              />

              <ExportCard 
                title="Tailwind Config (Simple)" 
                code={tailwindConfig} 
                isCopied={copiedType === 'tw-simple'} 
                onCopy={() => handleCopy(tailwindConfig, 'tw-simple')} 
              />

              <ExportCard 
                title="Tailwind Config (Full Scales)" 
                code={multiScaleTailwind} 
                isCopied={copiedType === 'tw-full'} 
                onCopy={() => handleCopy(multiScaleTailwind, 'tw-full')} 
              />

              <div className="bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col md:col-span-2 xl:col-span-1">
                <div className="px-6 py-5 border-b border-white/80 flex items-center justify-between bg-white/40">
                  <h3 className="font-bold text-slate-800 font-sans">Image Export</h3>
                </div>
                <div className="p-6 bg-white/40 flex flex-col gap-6 justify-center items-center h-full min-h-[250px]">
                    <p className="text-slate-600 font-medium text-center">Download a visual representation of your palette.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={() => handleDownloadImage('png')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] active:scale-95"
                      >
                        <Download className="w-5 h-5" /> Download PNG
                      </button>
                      <button 
                        onClick={() => handleDownloadImage('jpeg')}
                        className="flex items-center gap-2 bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-200 hover:bg-slate-50 font-bold py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                      >
                        <Download className="w-5 h-5" /> Download JPG
                      </button>
                    </div>
                </div>
              </div>

          </div>
      </div>
    </div>
  );
};

const ExportCard = ({ title, code, isCopied, onCopy }: { title: string, code: string, isCopied: boolean, onCopy: () => void }) => (
    <div className="bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-white/80 flex items-center justify-between bg-white/40">
            <h3 className="font-bold text-slate-800 font-sans">{title}</h3>
            <button 
                onClick={onCopy}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-slate-50 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border border-indigo-100"
            >
                {isCopied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                {isCopied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>
        <div className="p-6 overflow-x-auto bg-[#1e293b] text-indigo-100 font-mono text-sm leading-relaxed max-h-80 shadow-inner">
            <pre><code>{code}</code></pre>
        </div>
    </div>
)

export default ExportView;
