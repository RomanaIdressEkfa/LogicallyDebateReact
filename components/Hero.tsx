
import React from 'react';
import { MessageSquare, Zap, Trophy, BookOpen } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onLearnMore }) => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Master the Art of</span>{' '}
                <span className="block text-indigo-500 xl:inline">Logic & Rhetoric</span>
              </h1>
              <p className="mt-3 text-base text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Join the world's premier platform for structured debate. Watch live verbal sparring, judge arguments in real-time with AI assistance, and climb the global rankings.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button onClick={onStart} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all">
                    Start Watching
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button 
                    onClick={onLearnMore}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-100 bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-10 transition-all gap-2"
                  >
                    <BookOpen className="w-5 h-5" /> Learn Rules
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-60"
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80"
          alt="Debate stage"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent lg:via-slate-900/50"></div>
      </div>
    </div>
  );
};

export default Hero;
