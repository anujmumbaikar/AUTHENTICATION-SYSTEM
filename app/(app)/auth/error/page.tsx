import React, { useState, useEffect } from 'react';
import { RotateCcw, Home } from 'lucide-react';

function ErrorPage() {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    }, 4000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
      <div className="text-center space-y-8 max-w-md">
        
        {/* Error Symbol */}
        <div className="relative">
          <div className={`text-8xl transition-all duration-150 select-none ${
            isGlitching ? 'transform -rotate-12 scale-110' : ''
          }`}>
            💀
          </div>
          <div className="absolute inset-0 text-8xl opacity-20 animate-pulse">
            💀
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className={`text-6xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-150 ${
            isGlitching ? 'blur-sm' : ''
          }`}>
            404
          </h1>
          <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full overflow-hidden">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-100 animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Page Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 rounded-md font-medium transition-all hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <RotateCcw className="w-4 h-4" />
            Go Back
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-md font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default ErrorPage;