import React from 'react';
import { LayoutDashboard, Grid, Download, Zap, CheckCircle2, Bookmark, Wand2 } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onImagineClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onImagineClick }) => {
  const navItems = [
    { id: 'generator', activeIcon: <CheckCircle2 className="w-[18px] h-[18px]" />, icon: <LayoutDashboard className="w-[18px] h-[18px]" />, label: 'Colors', badge: '16' },
    { id: 'scale', activeIcon: <Zap className="w-[18px] h-[18px]" />, icon: <Zap className="w-[18px] h-[18px]" />, label: 'Scales' },
    { id: 'contrast', activeIcon: <Grid className="w-[18px] h-[18px]" />, icon: <Grid className="w-[18px] h-[18px]" />, label: 'Contrast' },
    { id: 'export', activeIcon: <Download className="w-[18px] h-[18px]" />, icon: <Download className="w-[18px] h-[18px]" />, label: 'Export' }
  ];

  const renderItem = (item: any) => {
    const isActive = currentView === item.id || (item.id === 'imagine' && currentView === 'generator' && false); // We handle active state below
    return (
      <button
        key={item.id}
        onClick={() => {
          if (item.id === 'imagine') {
            onImagineClick();
          } else {
            onViewChange(item.id as ViewMode);
          }
        }}
        className={`
          relative flex items-center justify-center lg:justify-start lg:px-4 py-3 md:py-[clamp(0.75rem,2vw,1rem)] min-h-[44px] min-w-[44px] flex-1 md:flex-none transition-all duration-200 border
          ${isActive 
            ? 'bg-white text-slate-800 shadow-[0_2px_15px_rgba(0,0,0,0.03)] font-bold border-2 border-[var(--color-accent)] rounded-[8px]' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-white/40 font-medium border-transparent rounded-[8px]'}
        `}
      >
        <span className={isActive ? 'text-[var(--color-accent)]' : 'text-slate-400'}>
           {isActive ? item.activeIcon : item.icon}
        </span>
        <span className="hidden lg:block ml-3 text-[15px] max-w-[130px] truncate">{item.label}</span>
        {item.badge && isActive && (
            <span className="hidden lg:flex absolute right-4 text-[var(--color-accent)] text-[13px] font-bold">
                {item.badge}
            </span>
        )}
        {item.hasDropdown && !isActive && (
            <span className="hidden lg:flex absolute right-4 text-slate-400 text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-full md:w-[clamp(4.5rem,15vw,16.25rem)] lg:w-[clamp(12rem,20vw,16.25rem)] h-[auto] md:h-screen bg-white md:bg-transparent text-slate-600 flex flex-col transition-all duration-300 z-20 shrink-0 border-b md:border-b-0 md:border-r border-[#e8eaef]/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:shadow-none">
      <div className="flex h-[60px] md:h-[100px] items-center justify-center md:justify-center lg:justify-start lg:pl-8 shrink-0">
        <div className="w-8 h-8 rounded-[10px] bg-[var(--color-accent)] flex items-center justify-center shadow-md text-white font-bold text-xl leading-none transition-colors">
           Z
        </div>
        <span className="block md:hidden lg:block ml-3 font-bold text-[20px] tracking-tight text-slate-800 font-serif">
           ZECCO
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto md:overflow-y-auto px-2 md:px-4 mt-0 md:mt-6 py-2 md:py-0 no-scrollbar flex md:block">
        <nav className="flex flex-row md:flex-col gap-1 md:gap-1.5 mb-2 md:mb-8 w-full justify-around md:justify-start">
          {navItems.map(renderItem)}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
