import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PaletteView from './components/PaletteView';
import ScaleView from './components/ScaleView';
import ContrastView from './components/ContrastView';
import ExportView from './components/ExportView';
import SavedPalettesView from './components/SavedPalettesView';
import Onboarding from './components/Onboarding';
import { ColorSwatch, HarmonyMode, ViewMode } from './types';
import { generateId, generatePalette } from './lib/colorUtils';
import chroma from 'chroma-js';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('generator');
  const [isVisualizeOpen, setIsVisualizeOpen] = useState(false);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('random');
  const [palette, setPalette] = useState<ColorSwatch[]>(() => 
    generatePalette(
      Array.from({ length: 5 }, () => ({ id: generateId(), hex: '', locked: false })), 
      'random'
    )
  );

  const handleHarmonyChange = useCallback((mode: HarmonyMode) => {
    setHarmonyMode(mode);
    setPalette(prev => generatePalette(prev, mode));
  }, []);

  const handleGenerate = useCallback(() => {
    setPalette(prev => generatePalette(prev, harmonyMode));
  }, [harmonyMode]);

  const toggleLock = useCallback((id: string) => {
    setPalette(prev => prev.map(swatch => 
      swatch.id === id ? { ...swatch, locked: !swatch.locked } : swatch
    ));
  }, []);

  const updateHex = useCallback((id: string, newHex: string) => {
    setPalette(prev => prev.map(swatch => {
        if (swatch.id === id) {
             let formatted = newHex.startsWith('#') ? newHex : `#${newHex}`;
             return { ...swatch, hex: formatted };
        }
        return swatch;
    }));
  }, []);

  const addColor = useCallback((index: number) => {
    setPalette(prev => {
      if (prev.length >= 10) return prev; // Max 10 colors
      const newColor = generatePalette([{ id: 'temp', hex: '#000000', locked: false }], 'random')[0].hex;
      const newPalette = [...prev];
      newPalette.splice(index + 1, 0, {
        id: Math.random().toString(36).substring(2, 9),
        hex: newColor,
        locked: false
      });
      return newPalette;
    });
  }, []);

  const removeColor = useCallback((id: string) => {
    setPalette(prev => {
      if (prev.length <= 2) return prev; // Min 2 colors
      return prev.filter(swatch => swatch.id !== id);
    });
  }, []);

  const handleGenerateAIPalette = useCallback(async (prompt: string) => {
    try {
      const response = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI palette');
      }
      
      const data = await response.json();
      if (data.colors && Array.isArray(data.colors)) {
        setPalette(prev => {
          let newIdx = 0;
          return prev.map(swatch => {
             if (swatch.locked) return swatch;
             const generated = data.colors[newIdx++];
             return generated ? { ...swatch, hex: generated.hex, name: generated.name, reason: generated.reason } : swatch;
          });
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate palette. Please try again.');
    }
  }, []);

  const handleOnboardingComplete = async (prompt: string) => {
    await handleGenerateAIPalette(prompt);
    setShowOnboarding(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar to generate, if not typing in an input
      if (e.code === 'Space' && e.target instanceof Element && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  const renderView = () => {
    switch (currentView) {
      case 'generator':
        return (
          <PaletteView 
            palette={palette} 
            isVisualizeOpen={isVisualizeOpen}
            setIsVisualizeOpen={setIsVisualizeOpen}
            onToggleLock={toggleLock} 
            onHexChange={updateHex} 
            onGenerate={handleGenerate}
            onGenerateAIPalette={handleGenerateAIPalette}
            harmonyMode={harmonyMode}
            onHarmonyChange={handleHarmonyChange}
            onAddColor={addColor}
            onRemoveColor={removeColor}
          />
        );
      case 'scale':
        return <ScaleView palette={palette} />;
      case 'contrast':
        return <ContrastView palette={palette} />;
      case 'export':
        return <ExportView palette={palette} />;
      case 'saved':
        return <SavedPalettesView />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#f6f7fa] overflow-hidden font-sans relative"
      style={{ '--color-accent': palette[0]?.hex || '#2563eb' } as React.CSSProperties}
    >
      {/* Background Ambient Blobs for Glass Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#f6e5f8] opacity-80 mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[10%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-[#e8e7fa] opacity-80 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#eef3fb] opacity-80 mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>
      
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onImagineClick={() => {
          setCurrentView('generator');
          setIsVisualizeOpen(true);
        }}
      />
      <main className="flex-1 flex flex-col min-w-0 z-10">
        {renderView()}
      </main>
    </div>
  );
}
