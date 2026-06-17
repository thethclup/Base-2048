import { use2048 } from './lib/use2048';
import { Board } from './components/Board';
import { GameHeader } from './components/GameHeader';
import { Web3Provider } from './providers/Web3Provider';
import { Web3Connect } from './components/Web3Utils';
import { SayGMButton } from './components/SayGMButton';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Trophy, Twitter } from 'lucide-react';
import { useAccount } from 'wagmi';

function GameContent() {
  const { board, bestScore, move, undo, reset, canUndo } = use2048();
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 flex flex-col items-center">
      <div className="w-full max-w-[400px] flex justify-between items-center mb-10">
        <div className="flex gap-4">
          <a href="#" className="p-2 bg-[var(--card)] rounded-full hover:bg-[var(--border)] transition">
            <Trophy size={20} className="text-[#edc22e]" />
          </a>
          <a href="#" className="p-2 bg-[var(--card)] rounded-full hover:bg-[var(--border)] transition">
            <Twitter size={20} className="text-[#1da1f2]" />
          </a>
        </div>
        <Web3Connect />
      </div>

      <GameHeader 
        score={board.score} 
        bestScore={bestScore} 
        onUndo={undo} 
        canUndo={canUndo} 
        onReset={reset} 
      />

      <div className="relative mb-8 mt-4">
        <Board tiles={board.tiles} />
        
        <AnimatePresence>
          {board.gameOver && !board.won && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm"
            >
              <h2 className="text-4xl font-black text-white mb-2">Game Over!</h2>
              <p className="text-gray-300 mb-6 font-mono text-sm">Score: {board.score}</p>
              <button 
                onClick={reset}
                className="px-6 py-3 bg-[var(--color-base-blue)] text-white rounded-full font-bold shadow-lg glow-base"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[400px] pt-8 border-t border-[var(--border)] flex flex-col items-center gap-6">
        <p className="text-center text-sm font-mono text-gray-400">
          Built for <span className="text-[var(--color-base-blue)] font-bold">Base</span> Mainnet.
        </p>
        
        {isConnected && <SayGMButton />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameContent />
    </Web3Provider>
  );
}

