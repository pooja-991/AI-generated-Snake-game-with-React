import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan font-mono screen-tear flex flex-col items-center justify-center relative overflow-hidden">
      <div className="noise"></div>
      
      <header className="absolute top-0 left-0 w-full p-4 border-b-2 border-cyan/30 flex justify-between items-center z-10 bg-black/80 backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-widest text-cyan glitch" data-text="NEON_SERPENT_OS">
          NEON_SERPENT_OS
        </h1>
        <div className="text-magenta text-sm animate-pulse">
          V.1.0.4_BETA
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl p-8 z-10 mt-16">
        <div className="flex-1 flex justify-center items-center w-full">
          <SnakeGame />
        </div>
        
        <div className="w-full lg:w-96 flex flex-col gap-8">
          <div className="border-glitch p-4 bg-black/80">
            <h2 className="text-magenta text-xl mb-2 border-b border-magenta/30 pb-1">SYS_LOG</h2>
            <div className="text-cyan/70 text-xs space-y-1 h-32 overflow-hidden flex flex-col justify-end">
              <p>&gt; INIT_NEURAL_LINK... OK</p>
              <p>&gt; AUD_SYS... MOUNTED</p>
              <p>&gt; EXEC_SERPENT.EXE... RUNNING</p>
              <p className="text-magenta animate-pulse">&gt; AWAITING_INPUT_</p>
            </div>
          </div>
          
          <MusicPlayer />
        </div>
      </main>
      
      <footer className="absolute bottom-0 left-0 w-full p-2 border-t border-cyan/20 text-center text-xs text-cyan/50 z-10 bg-black/80">
        (C) 2099 CYBER_DYNAMICS_CORP. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
