import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  score: number;
  bestScore: number;
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
}

export const GameHeader = ({ score, bestScore, onUndo, canUndo, onReset }: HeaderProps) => {
  return (
    <div className="w-full max-w-[400px] mx-auto mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white glow-base inline-block">2048</h1>
          <p className="text-[var(--color-base-blue)] text-xs font-bold tracking-widest mt-1 uppercase">Base Edition</p>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-[var(--card)] px-4 py-2 rounded-lg border border-[var(--border)] text-center shadow-lg">
            <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Score</span>
            <span className="block text-xl font-mono text-white font-bold">{score}</span>
          </div>
          <div className="bg-[var(--card)] px-4 py-2 rounded-lg border border-[var(--border)] text-center shadow-lg">
            <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Best</span>
            <span className="block text-xl font-mono text-[var(--color-base-blue)] font-bold">{bestScore}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-400 max-w-[200px] leading-tight">
          Join the numbers and get to the <span className="font-bold text-white">2048</span> tile!
        </p>
        
        <div className="flex gap-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="flex items-center gap-1 bg-[#2a2e37] hover:bg-[#3a3f4b] text-gray-300 px-3 py-2 rounded-lg transition-colors font-bold disabled:opacity-30 disabled:hover:bg-[#2a2e37]"
          >
            <RotateCcw size={16} /> Undo
          </button>
          
          <button 
            onClick={onReset}
            className="bg-[var(--color-base-blue)] hover:bg-[#0040cc] text-white px-4 py-2 rounded-lg font-bold transition-colors glow-base"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};
