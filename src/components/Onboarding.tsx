import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import chroma from 'chroma-js';

interface OnboardingProps {
  onComplete: (prompt: string) => Promise<void>;
}

const BAND_COLORS = chroma.scale([
  '#0dbab1', '#2ea07c', '#5aae64', '#8eb744', '#babc2c', '#dfb12c', '#eba031', '#e97042', '#de4c5a', '#cd3576', '#ac3d8d', '#864192', '#583f8b'
]).colors(15);
const CENTER_COLOR = '#ffffff';

const QUESTIONS = [
  {
    id: 'project',
    title: 'What are you designing for?',
    options: ['Web App', 'Mobile App', 'Brand Identity', 'Marketing'],
  },
  {
    id: 'mood',
    title: 'What mood to convey?',
    options: ['Professional', 'Playful', 'Elegant', 'Bold'],
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ project: '', mood: '', theme: '' });
  const [customTheme, setCustomTheme] = useState('');

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStep(4);
    const finalAnswers = { ...answers, theme: customTheme || 'Surprise me' };
    const prompt = `A color palette for a ${finalAnswers.project} project. The mood should be ${finalAnswers.mood}. Specific preferences: ${finalAnswers.theme}.`;
    await onComplete(prompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gray-950 font-sans"
    >
      {/* Background Animated Concentric Circles */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {BAND_COLORS.map((color, i) => {
          const nextColor = BAND_COLORS[(i + 2) % BAND_COLORS.length];
          const size = `${150 - (i * (150 / BAND_COLORS.length))}vmax`;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: 360 
              }}
              transition={{
                scale: { duration: 1.2, ease: "easeOut", delay: i * 0.04 },
                opacity: { duration: 1.2, ease: "easeOut", delay: i * 0.04 },
                rotate: { duration: 20 + i * 2, repeat: Infinity, ease: "linear" }
              }}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                background: `linear-gradient(${i * 15}deg, ${color} 0%, ${nextColor} 100%)`,
                borderRadius: '50%',
                zIndex: i,
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)',
              }}
            />
          );
        })}
      </div>

      {/* Central Content Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: BAND_COLORS.length * 0.04, type: 'spring', damping: 20 }}
        className="relative z-50 flex flex-col items-center justify-center rounded-full shadow-2xl p-4 md:p-10 overflow-hidden"
        style={{
           width: 'min(95vw, 550px)',
           height: 'min(95vw, 550px)',
           backgroundColor: CENTER_COLOR,
        }}
      >
        <AnimatePresence initial={false}>
          {step === 0 && (
            <motion.div
              key="intro"
              variants={{
                enter: { opacity: 0, scale: 0.95 },
                center: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.05 }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 text-center flex flex-col items-center justify-center w-full h-full text-[#041f42]"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#041f42] tracking-tight leading-tight mb-4">
                Add<br />color to<br />your vision
              </h1>
              <p className="text-sm md:text-base text-[#041f42]/80 mb-8 max-w-xs font-sans px-4">
                Discover your perfect palette with Zecco's AI color creator.
              </p>
              
              <button
                onClick={() => setStep(1)}
                className="bg-[#041f42] text-white hover:bg-[#041f42]/90 font-bold py-3 md:py-4 px-6 md:px-[clamp(1.5rem,4vw,2rem)] rounded-full text-sm md:text-lg transition-transform hover:scale-105 shadow-xl font-sans w-[clamp(14rem,70vw,20rem)]"
              >
                On a coloring adventure!
              </button>
            </motion.div>
          )}

          {(step === 1 || step === 2) && (
            <motion.div
              key={`q${step}`}
              variants={{
                enter: { opacity: 0, x: 40 },
                center: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -40 }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 text-center flex flex-col justify-center items-center w-full h-full px-6 lg:px-12 text-[#041f42]"
            >
              <h2 className="text-xl md:text-3xl font-serif mb-4 md:mb-8 text-[#041f42]">
                {QUESTIONS[step - 1].title}
              </h2>
              <div className="flex flex-col gap-1.5 md:gap-3 w-[clamp(14rem,75vw,20rem)]">
                {QUESTIONS[step - 1].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(QUESTIONS[step - 1].id, opt)}
                    className="w-full text-center px-4 py-2 md:py-3 rounded-full bg-slate-50 hover:bg-[#041f42] text-[#041f42] hover:text-white font-semibold transition-all border border-slate-200 hover:border-[#041f42] text-xs md:text-base font-sans"
                  >
                    {opt}
                  </button>
                ))}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = new FormData(e.currentTarget).get('customInput') as string;
                    if (input.trim()) handleSelectOption(QUESTIONS[step - 1].id, input.trim());
                  }}
                  className="w-full relative mt-0 md:mt-1"
                >
                  <input 
                    name="customInput"
                    placeholder="Or type your own & press enter..."
                    className="w-full px-4 py-2 md:py-3 rounded-full bg-transparent border-2 border-slate-200 text-[#041f42] placeholder-[#041f42]/50 focus:outline-none focus:border-[#041f42] text-xs md:text-base font-medium font-sans text-center transition-all bg-white/50 backdrop-blur-sm"
                  />
                </form>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="q3"
              variants={{
                enter: { opacity: 0, x: 40 },
                center: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -40 }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 text-center flex flex-col justify-center items-center w-full h-full px-6 lg:px-12 text-[#041f42]"
            >
               <h2 className="text-2xl md:text-3xl font-serif mb-3 text-[#041f42]">
                Any hints?
              </h2>
              <p className="text-xs md:text-sm text-[#041f42]/70 mb-6 max-w-[250px] font-sans">
                Tell us what you have in mind, or let AI surprise you.
              </p>
              
              <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4 w-[clamp(14rem,75vw,18.75rem)]">
                <input 
                  type="text" 
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="e.g. 'Ocean blues', 'Vaporwave'"
                  className="w-full bg-transparent border-b-2 border-slate-300 text-[#041f42] placeholder-slate-400 focus:outline-none focus:border-[#041f42] transition-all text-center pb-2 text-base md:text-lg font-medium font-sans"
                  autoFocus
                />
                
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={!customTheme.trim()}
                    className="w-full bg-[#041f42] hover:bg-[#041f42]/90 disabled:opacity-50 disabled:hover:bg-[#041f42] text-white font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 font-sans"
                  >
                    Generate <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinalSubmit()}
                    className="w-full bg-transparent hover:bg-slate-50 text-[#041f42] font-semibold py-3 rounded-full transition-colors border border-slate-300 font-sans"
                  >
                    Surprise me
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 4 && (
             <motion.div
              key="generating"
              variants={{
                enter: { opacity: 0, scale: 0.95 },
                center: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 1.05 }
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 text-center flex flex-col justify-center items-center w-full h-full text-[#041f42]"
            >
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-[#041f42] animate-spin mb-4 md:mb-6" />
              <h2 className="text-xl md:text-2xl font-serif text-[#041f42] mb-2">
                Synthesizing...
              </h2>
              <p className="text-[#041f42]/70 text-xs md:text-sm font-sans">Curating brilliant harmonies.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Navigation Buttons */}
      {step > 0 && step < 4 && (
        <>
          <button 
            onClick={() => setStep(prev => prev - 1)}
            className="absolute top-8 left-8 md:top-10 md:left-10 z-[100] text-indigo-100/80 hover:text-white text-xs md:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 uppercase tracking-widest font-sans"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <button 
            onClick={() => {
              setStep(4);
              onComplete('Create a beautiful, balanced modern UI color palette');
            }}
            className="absolute bottom-6 md:bottom-10 z-[100] text-indigo-100/80 hover:text-white text-xs md:text-sm font-bold transition-colors cursor-pointer tracking-widest uppercase font-sans"
          >
            Skip onboarding
          </button>
        </>
      )}
    </motion.div>
  );
};

export default Onboarding;
