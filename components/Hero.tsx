
import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onLearnMore }) => {
  return (
    <div className="relative bg-slate-950 overflow-hidden min-h-[85vh] flex items-center">
      <div className="w-full relative z-10">
        <div className="w-full">
          <main className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-left max-w-7xl mx-auto py-20 lg:py-32">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-6xl leading-tight">
                <span className="block xl:inline">Master the Art of</span>{' '}
                <span className="block text-primary-500 xl:inline">Logic & Rhetoric</span>
              </h1>
              <p className="mt-6 text-base text-slate-300 sm:mt-8 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 leading-relaxed font-medium drop-shadow-md">
                Join the world's premier platform for structured debate. Watch live verbal sparring, judge arguments in real-time with AI assistance, and climb the global rankings.
              </p>
              <div className="mt-10 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-md shadow">
                  <button onClick={onStart} className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg shadow-primary-900/50 hover:scale-105 active:scale-95">
                    Start Watching
                  </button>
                </div>
                <div className="mt-3 sm:mt-0">
                  <button 
                    onClick={onLearnMore}
                    className="w-full flex items-center justify-center px-8 py-4 border border-slate-600 text-base font-bold rounded-2xl text-white bg-slate-900/60 hover:bg-slate-800 md:py-4 md:text-lg md:px-10 transition-all gap-2 backdrop-blur-md hover:border-primary-500/50"
                  >
                    <BookOpen className="w-5 h-5" /> Learn Rules
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 pointer-events-none">
        <img
          className="h-full w-full object-cover opacity-40 lg:opacity-50 mix-blend-luminosity"
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
          alt="Debate stage"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent lg:via-slate-950/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
