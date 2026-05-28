import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Box, Layers, Target, CheckCircle } from 'lucide-react';

const HeroVideoSimulation = () => {
  const [phase, setPhase] = useState(1);
  // Phase 1: 0-3s (Scan)
  // Phase 2: 3-8s (Scandinavian)
  // Phase 3: 8-12s (Luxury)
  // Phase 4: 12-15s (End Banner)

  useEffect(() => {
    let timers = [];
    
    const runSequence = () => {
      setPhase(1);
      
      timers.push(setTimeout(() => {
        setPhase(2);
      }, 3000));
      
      timers.push(setTimeout(() => {
        setPhase(3);
      }, 8000));
      
      timers.push(setTimeout(() => {
        setPhase(4);
      }, 12000));
    };

    runSequence(); // Initial run

    const loop = setInterval(() => {
      // Clear any pending timeouts just in case, though they should have fired
      timers.forEach(clearTimeout);
      timers = [];
      runSequence();
    }, 15000);

    return () => {
      clearInterval(loop);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-black">
      
      {/* BASE IMAGES with crossfades */}
      <img 
        src="/hero/empty.png" 
        alt="Empty Room" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${phase === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
      />
      <img 
        src="/hero/scandinavian.png" 
        alt="Scandinavian Room" 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out transform ${phase === 2 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'} ${phase > 2 ? 'scale-110' : ''}`}
      />
      <img 
        src="/hero/luxury.png" 
        alt="Luxury Room" 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out transform ${phase >= 3 ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
      />

      {/* OVERLAYS & ANIMATIONS */}
      
      {/* Phase 1: Scanning effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_5px_rgba(34,211,238,0.6)] animate-[scan_2.5s_ease-in-out_infinite]" />
        
        {/* Wireframe / Dots (simulated) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:30px_30px] animate-[pulse_1s_infinite] opacity-50" />
        
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-cyan-400/50 flex items-center gap-3">
          <Target className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          <span className="text-cyan-400 font-mono text-sm font-bold tracking-widest uppercase">Analyzing Spatial Data...</span>
        </div>
      </div>

      {/* Phase 2: Scandinavian */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${phase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        {/* Style Badge */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/50 animate-slideUp">
          <p className="text-xs text-[#8B5E3C] uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Design Output</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937]">Scandinavian Minimalist</p>
        </div>

        {/* Dynamic Tags */}
        <div className="absolute top-[60%] left-[20%] bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm animate-popIn delay-500">
          + Low-Profile Sofa
        </div>
        <div className="absolute top-[70%] left-[60%] bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm animate-popIn delay-1000">
          + Oak Coffee Table
        </div>
      </div>

      {/* Phase 3: Luxury */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${phase === 3 ? 'opacity-100' : 'opacity-0'}`}>
        {/* Style Badge */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white/50 animate-slideUp">
          <p className="text-xs text-[#8B5E3C] uppercase tracking-wider font-bold mb-1 flex items-center gap-1"><Wand2 className="w-3 h-3"/> Style Mutated</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1F2937]">Ultra-Modern Luxury</p>
        </div>

        {/* Dynamic Tags */}
        <div className="absolute top-[65%] left-[30%] bg-[#8B5E3C]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm animate-popIn delay-300">
          + Emerald Velvet Sectional
        </div>
        <div className="absolute top-[50%] left-[70%] bg-[#8B5E3C]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm animate-popIn delay-700">
          + Brass Accents
        </div>
        <div className="absolute top-[30%] left-[50%] bg-[#8B5E3C]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm animate-popIn delay-1000">
          + Mood Lighting
        </div>
      </div>

      {/* Phase 4: Final Banner */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-1000 ${phase === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-center space-y-6 animate-scaleUp">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-extrabold text-white leading-tight">
            AI-Powered Interior Design <br/>
            <span className="text-[#D4A373]">In Seconds.</span>
          </h2>
        </div>
      </div>

    </div>
  );
};

export default HeroVideoSimulation;
