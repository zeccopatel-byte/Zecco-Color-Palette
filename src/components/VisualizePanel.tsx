import React, { useState } from 'react';
import { ColorSwatch } from '../types';
import { X, ArrowUpRight, ChevronDown } from 'lucide-react';

interface VisualizePanelProps {
  palette: ColorSwatch[];
  onClose: () => void;
}

const filterOptions = ['All', 'Nav', 'Hero', 'Branding', 'Illustration', 'Typography'];

const VisualizePanel: React.FC<VisualizePanelProps> = ({ palette, onClose }) => {
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const colors = palette.map(p => p.hex);
  const safeColor = (index: number) => colors[index % colors.length];

  return (
    <div className="flex flex-col h-full w-full bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
        <div className="w-9 h-9"></div> {/* Placeholder for balance */}
        <h2 className="text-lg font-bold text-slate-800">Imagine Style</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 bg-[#eef1f5]">
        
        {/* Nav Card */}
        {(filter === 'All' || filter === 'Nav') && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Navigation</div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col w-full relative" style={{ aspectRatio: '1.4/1' }}>
              {/* Top Nav */}
              <div className="h-14 flex items-center justify-between px-6 border-b" style={{ borderColor: safeColor(1), backgroundColor: safeColor(0) }}>
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: safeColor(2) }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: safeColor(0) }}></div>
                   </div>
                   <div className="font-bold text-sm tracking-tight" style={{ color: safeColor(4) }}>Zecco</div>
                 </div>
                 <div className="hidden md:flex gap-6 text-xs font-semibold" style={{ color: safeColor(4) }}>
                   <span style={{ color: safeColor(2) }}>Home</span>
                   <span className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">About</span>
                   <span className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Services</span>
                 </div>
                 <div className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: safeColor(2), color: safeColor(0) }}>
                   Sign In
                 </div>
              </div>
              {/* Body */}
              <div className="flex-1 p-6 flex gap-6" style={{ backgroundColor: safeColor(0) }}>
                 {/* Side Nav */}
                 <div className="w-32 h-full rounded-xl p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden" style={{ backgroundColor: safeColor(4) }}>
                   <div className="w-full h-8 rounded-lg flex items-center px-3 gap-2 relative z-10" style={{ backgroundColor: safeColor(2) }}>
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: safeColor(0) }}></div>
                      <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: safeColor(0) }}></div>
                   </div>
                   <div className="w-full h-8 rounded-lg flex items-center px-3 gap-2 relative z-10 opacity-70">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: safeColor(0) }}></div>
                      <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: safeColor(0) }}></div>
                   </div>
                   <div className="w-full h-8 rounded-lg flex items-center px-3 gap-2 relative z-10 opacity-70">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: safeColor(0) }}></div>
                      <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: safeColor(0) }}></div>
                   </div>
                   {/* Decorative circle in sidebar */}
                   <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: safeColor(1) }}></div>
                 </div>
                 {/* Content placeholder */}
                 <div className="flex-1 flex flex-col gap-4">
                   <div className="h-24 w-full rounded-xl shadow-sm relative overflow-hidden p-4 flex flex-col justify-end" style={{ backgroundColor: safeColor(1) }}>
                      <div className="w-1/3 h-2 rounded-full opacity-50 mb-2" style={{ backgroundColor: safeColor(0) }}></div>
                      <div className="w-1/2 h-3 rounded-full" style={{ backgroundColor: safeColor(0) }}></div>
                   </div>
                   <div className="flex-1 w-full flex gap-4">
                     <div className="flex-1 rounded-xl shadow-sm" style={{ backgroundColor: safeColor(3) }}></div>
                     <div className="flex-1 rounded-xl shadow-sm" style={{ backgroundColor: safeColor(3) }}></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Card */}
        {(filter === 'All' || filter === 'Hero') && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Hero Section</div>
            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm w-full relative overflow-hidden flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col justify-center relative z-10 w-full md:w-1/2">
                <h3 className="text-2xl md:text-[32px] font-bold leading-[1.1] mb-4 tracking-tight" style={{ color: safeColor(1) }}>
                  Zecco<br/>Design<br/>Academy
                </h3>
                <p className="text-[10px] md:text-[11px] mb-8 font-medium leading-relaxed max-w-[240px]" style={{ color: safeColor(1) }}>
                  Elevate your design skills to new heights with our curated selection of courses, designed to inspire, educate, and empower your creative journey.
                </p>
                
                <div className="flex gap-4 md:gap-6 mt-auto">
                   <div>
                     <div className="font-bold text-sm md:text-base" style={{ color: safeColor(1) }}>300+</div>
                     <div className="text-[8px] md:text-[9px] opacity-70 font-semibold" style={{ color: safeColor(1) }}>Courses</div>
                   </div>
                   <div>
                     <div className="font-bold text-sm md:text-base" style={{ color: safeColor(1) }}>50+</div>
                     <div className="text-[8px] md:text-[9px] opacity-70 font-semibold" style={{ color: safeColor(1) }}>Mentors</div>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 relative flex flex-col w-full md:w-1/2">
                <div className="flex gap-2 justify-end mb-6 w-full">
                  <button className="text-[9px] md:text-[10px] font-bold px-4 py-2 border-2 rounded-[8px] whitespace-nowrap" style={{ borderColor: safeColor(1), color: safeColor(1) }}>Explore</button>
                  <button className="text-[9px] md:text-[10px] font-bold px-4 py-2 rounded-[8px] whitespace-nowrap" style={{ backgroundColor: safeColor(3), color: safeColor(1) }}>Enroll Now</button>
                </div>
                
                <div className="grid grid-cols-2 grid-rows-3 w-full flex-1 gap-2 md:gap-3 min-h-[200px]">
                   <div className="rounded-tl-[40px]" style={{ backgroundColor: safeColor(1) }}></div>
                   <div className="rotate-45 scale-75 origin-center" style={{ backgroundColor: safeColor(3) }}></div>
                   <div className="border-[6px]" style={{ borderColor: safeColor(1) }}></div>
                   <div className="rounded-[40px]" style={{ backgroundColor: safeColor(3) }}></div>
                   <div className="rounded-tl-[80px]" style={{ backgroundColor: safeColor(1) }}></div>
                   <div className="w-full h-full flex items-end justify-center">
                      <div className="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[80px]" style={{ borderBottomColor: safeColor(3) }}></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branding Card */}
        {(filter === 'All' || filter === 'Branding') && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Branding</div>
            <div className="flex w-full relative shadow-sm rounded-xl overflow-hidden" style={{ aspectRatio: '1.6/1' }}>
              <div className="flex-1 bg-white p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-2xl leading-none tracking-tight" style={{ color: safeColor(4) }}>Zecco<br/>Studio</h3>
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: safeColor(4) }}>Zecco</div>
                  <div className="font-bold text-[8px] tracking-widest mt-1 uppercase" style={{ color: safeColor(1) }}>Art Director</div>
                  
                  <div className="mt-6 text-[8px] font-medium opacity-80" style={{ color: safeColor(4) }}>
                    123-456-7890<br/>
                    hello@zecco.com
                  </div>
                </div>
              </div>
              <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: safeColor(0) }}>
                 <div className="absolute -right-[20%] -top-[20%] w-[120%] h-[120%] rounded-full opacity-90" style={{ backgroundColor: safeColor(2) }}></div>
                 <div className="absolute left-[10%] -bottom-[30%] w-[120%] h-[120%] rounded-full opacity-90" style={{ backgroundColor: safeColor(1) }}></div>
                 <div className="absolute -left-[40%] top-[10%] w-[120%] h-[120%] rounded-full mix-blend-multiply opacity-80" style={{ backgroundColor: safeColor(3) }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Illustration Card */}
        {(filter === 'All' || filter === 'Illustration') && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Illustration</div>
            <div className="w-full relative rounded-[24px] overflow-hidden shadow-md border-[12px]" style={{ aspectRatio: '1.4/1', borderColor: safeColor(4), backgroundColor: safeColor(1) }}>
               
               {/* Sun / Moon */}
               <div className="absolute top-[20%] right-[25%] w-24 h-24 rounded-full mix-blend-overlay opacity-50" style={{ backgroundColor: safeColor(0) }}></div>
               <div className="absolute top-[20%] right-[25%] w-24 h-24 rounded-full border-[3px]" style={{ borderColor: safeColor(0), transform: 'translate(10px, -10px)' }}></div>
               
               {/* Mountains / Landscape */}
               <div className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-[100px] rotate-[15deg] shadow-2xl mix-blend-multiply opacity-90" style={{ backgroundColor: safeColor(2) }}></div>
               <div className="absolute -bottom-[10%] -right-[10%] w-[90%] h-[60%] rounded-tl-[120px] shadow-2xl mix-blend-multiply opacity-95" style={{ backgroundColor: safeColor(3) }}></div>
               
               {/* Foreground element */}
               <div className="absolute bottom-0 left-[25%] w-[35%] h-[55%] rounded-t-[100px] shadow-2xl mix-blend-multiply opacity-80" style={{ backgroundColor: safeColor(0) }}></div>
               
               {/* Texture/Noise overlay */}
               <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

               {/* Water/Wave reflection */}
               <div className="absolute bottom-0 left-0 right-0 h-[25%] opacity-30 flex flex-col justify-end pb-2 gap-1 px-4 mix-blend-overlay">
                  <div className="w-full h-1 rounded-full" style={{ backgroundColor: safeColor(1) }}></div>
                  <div className="w-[80%] h-1 rounded-full mx-auto" style={{ backgroundColor: safeColor(1) }}></div>
                  <div className="w-[60%] h-1 rounded-full mx-auto" style={{ backgroundColor: safeColor(1) }}></div>
               </div>

               <div className="absolute bottom-6 right-8 font-black text-3xl tracking-tighter mix-blend-overlay opacity-60 drop-shadow-md" style={{ color: safeColor(0) }}>ZECCO</div>
            </div>
          </div>
        )}

        {/* Typography Card */}
        {(filter === 'All' || filter === 'Typography') && (
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Typography</div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-8 relative" style={{ aspectRatio: '1.2/1' }}>
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${safeColor(1)} 2px, transparent 2px)`, backgroundSize: '20px 20px' }}></div>
               <div className="relative flex flex-col items-center">
                  <h2 className="font-serif text-[72px] leading-[0.7] italic -rotate-6 relative z-10 drop-shadow-md" style={{ color: safeColor(2) }}>
                    Zecco
                  </h2>
                  <h2 className="font-black text-[72px] leading-[0.8] -rotate-6 uppercase tracking-tighter relative z-20 drop-shadow-xl" style={{ color: safeColor(0), textShadow: `6px 6px 0 ${safeColor(1)}` }}>
                    Design
                  </h2>
                  
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full mix-blend-multiply" style={{ backgroundColor: safeColor(1) }}></div>
                  <div className="absolute -bottom-8 -right-4 w-16 h-16 rounded-full mix-blend-multiply" style={{ backgroundColor: safeColor(3) }}></div>
                  <div className="absolute top-1/2 -right-10 w-8 h-8 rotate-45" style={{ backgroundColor: safeColor(0) }}></div>
                  <div className="absolute bottom-8 -left-10 w-6 h-6 rotate-45" style={{ backgroundColor: safeColor(4) }}></div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VisualizePanel;
