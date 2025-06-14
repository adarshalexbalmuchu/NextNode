
import React, { useEffect, useState } from 'react';

const LoadingPage: React.FC = () => {
  const [showLightning, setShowLightning] = useState(false);
  const [logoGlow, setLogoGlow] = useState(false);

  const lightningStrike = () => {
    const main = document.querySelector('.bolt-main') as HTMLElement;
    const branches = document.querySelectorAll('.bolt-branch') as NodeListOf<HTMLElement>;
    const flash = document.querySelector('.flash-overlay') as HTMLElement;
    const flickerTimings = [0, 80, 140, 180, 223];

    if (!main || !branches.length || !flash) return;

    // Reset
    main.style.opacity = '0';
    branches.forEach(b => b.style.opacity = '0');
    flash.style.opacity = '0';

    // Main flash
    setTimeout(() => {
      main.style.opacity = '1';
      branches.forEach(b => b.style.opacity = String(0.7 + Math.random() * 0.3));
      flash.style.opacity = '0.55';
    }, flickerTimings[0]);

    // Flickers
    setTimeout(() => {
      main.style.opacity = '0.5';
      branches.forEach(b => b.style.opacity = '0.2');
      flash.style.opacity = '0.15';
    }, flickerTimings[1]);
    
    setTimeout(() => {
      main.style.opacity = '1';
      branches.forEach(b => b.style.opacity = String(0.8 + Math.random() * 0.2));
      flash.style.opacity = '0.38';
    }, flickerTimings[2]);
    
    setTimeout(() => {
      main.style.opacity = '0.2';
      branches.forEach(b => b.style.opacity = '0.1');
      flash.style.opacity = '0.05';
    }, flickerTimings[3]);
    
    // Fade out
    setTimeout(() => {
      main.style.opacity = '0';
      branches.forEach(b => b.style.opacity = '0');
      flash.style.opacity = '0';
    }, flickerTimings[4]);
  };

  useEffect(() => {
    // Start lightning after 500ms
    const lightningTimer = setTimeout(() => {
      setShowLightning(true);
      // Trigger first lightning strike
      setTimeout(() => {
        lightningStrike();
        // Trigger logo glow when lightning hits
        setLogoGlow(true);
      }, 100);
    }, 500);

    return () => {
      clearTimeout(lightningTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center overflow-hidden">
      
      {/* Dramatic Realistic Lightning Strike */}
      {showLightning && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div className="lightning-container">
            <svg className="lightning-bolt" width="120" height="100vh" viewBox="0 0 120 800">
              {/* Main jagged lightning bolt */}
              <polyline 
                points="60,0 65,80 50,120 75,200 55,280 80,360 45,440 70,520 40,600 65,680 50,760 60,800" 
                className="bolt-main"
              />
              {/* Lightning branches */}
              <polyline 
                points="65,80 85,130 75,180" 
                className="bolt-branch"
              />
              <polyline 
                points="75,200 95,240 85,280" 
                className="bolt-branch"
              />
              <polyline 
                points="45,440 25,480 35,520" 
                className="bolt-branch"
              />
              <polyline 
                points="70,520 90,560 80,600" 
                className="bolt-branch"
              />
            </svg>
            <div className="flash-overlay"></div>
          </div>
        </div>
      )}

      {/* Logo with Enhanced Glow Effect */}
      <div className="relative z-10">
        <div className="relative">
          <img
            src="/NextNode-Logo.svg"
            alt="NextNode"
            className={`w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] object-contain transition-all duration-1000 ${
              logoGlow 
                ? 'brightness-200 drop-shadow-[0_0_50px_hsl(var(--primary))] drop-shadow-[0_0_100px_rgba(0,255,255,0.6)] scale-110' 
                : 'brightness-100 scale-100'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
